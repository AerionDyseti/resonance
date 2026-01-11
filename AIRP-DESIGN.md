# AIRP Memory Server — Design Document

> Comprehensive design for a vector-memory MCP server for AI-assisted solo roleplaying, integrating with Claude Code to provide persistent, semantically-searchable world state.

---

## Table of Contents

1. [Overview & Goals](#1-overview--goals)
2. [Architecture Summary](#2-architecture-summary)
3. [Storage Layer](#3-storage-layer)
4. [Entity Model](#4-entity-model)
5. [Edge Model](#5-edge-model)
6. [Scene System](#6-scene-system)
7. [Runtime Architecture](#7-runtime-architecture)
8. [MCP Tool Interface](#8-mcp-tool-interface)
9. [Query Patterns](#9-query-patterns)
10. [Sync & Persistence Flow](#10-sync--persistence-flow)
11. [Scale Analysis](#11-scale-analysis)
12. [AIRP System Rules Reference](#12-airp-system-rules-reference)
13. [Open Questions](#13-open-questions)

---

## 1. Overview & Goals

### Purpose

A memory system for AI-assisted solo RPG campaigns using the AIRP rules-light system. The GM (Claude) needs to:

- Maintain narrative continuity across sessions
- Recall established facts before introducing elements
- Support emergent storytelling without railroading
- Query world state semantically ("NPCs who might betray us")
- Traverse relationship graphs ("How is Kira connected to the Baron?")

### Design Principles

1. **File-first during play** — Claude operates on `scene.json` directly, zero latency mid-scene
2. **Database at boundaries** — MCP handles durable storage, queried at scene start, written at scene end
3. **Three retrieval modes** — Exact/fuzzy search, semantic search, graph traversal
4. **Single file portability** — SQLite, no external services during play
5. **Context-window aware** — Database holds everything; Claude sees only what's scene-relevant

---

## 2. Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                       During Play                           │
│                                                             │
│   scene.json (Claude reads/writes directly via file tools)  │
│   ├── scene: { stakes, pressures, exit_conditions }         │
│   ├── context: { loaded entities from MCP at scene start }  │
│   └── working: { new/modified entities created in play }    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Scene end / compaction / commit
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Git Hook / Script                        │
│                                                             │
│   1. Parse scene.json working entities                      │
│   2. Detect promotion candidates (trait/level changes)      │
│   3. MCP: upsert_entities() for each                        │
│   4. MCP: upsert_edges() for relationships                  │
│   5. Generate embeddings for new/changed entities           │
│   6. Create session event record                            │
│   7. Archive or clear scene.json                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MCP Database (SQLite)                     │
│                                                             │
│   entities + entities_fts + entities_vec + edges            │
│   (cold storage, semantic search, graph traversal)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Storage Layer

### Technology Stack

| Component        | Choice                         | Rationale                                |
| ---------------- | ------------------------------ | ---------------------------------------- |
| Database         | SQLite                         | Single file, portable, no daemon         |
| Full-text search | FTS5                           | Built-in, fast trigram/prefix matching   |
| Vector search    | sqlite-vec                     | Embedded, ~50ms queries, 384-dim vectors |
| Embeddings       | Local model (all-MiniLM-L6-v2) | No runtime API dependency                |

### Core Schema

```sql
-- Core entity storage
CREATE TABLE entities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,           -- character, location, event, etc.
  subtype TEXT,                 -- pc, major_npc, minor_npc, etc.
  name TEXT NOT NULL,
  summary TEXT,
  body TEXT,
  properties JSON,              -- Flexible k/v store
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Full-text search on name + summary + body
CREATE VIRTUAL TABLE entities_fts USING fts5(
  name, summary, body,
  content='entities',
  content_rowid='rowid',
  tokenize='porter'
);

-- Vector embeddings (sqlite-vec)
CREATE VIRTUAL TABLE entities_vec USING vec0(
  id TEXT PRIMARY KEY,
  embedding FLOAT[384]
);

-- Relationship edges (the graph)
CREATE TABLE edges (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  target_id TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  properties JSON NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  UNIQUE(source_id, target_id)  -- One edge per directed pair
);

-- Indexes for fast traversal
CREATE INDEX idx_edges_source ON edges(source_id);
CREATE INDEX idx_edges_target ON edges(target_id);
```

### Embedding Strategy

- **When:** Batch at entity creation/update (between sessions)
- **Model:** all-MiniLM-L6-v2 via ONNX (384 dimensions, ~50ms per embed)
- **Chunks:** Header (name + summary), body paragraphs, properties
- **Storage:** ~10 MB for 1,000 entities × 7 chunks average

---

## 4. Entity Model

### Entity Types (11)

| Type             | Purpose                       | Key Properties                                        |
| ---------------- | ----------------------------- | ----------------------------------------------------- |
| **Character**    | PCs and NPCs                  | subtype, stats, traits, level, category               |
| **Location**     | Places in the world           | parent_location, atmosphere, notable_features         |
| **Organization** | Factions, guilds, governments | goals, structure, notable_members                     |
| **Event**        | Specific happenings           | when, who_involved, outcome, consequences             |
| **Story**        | Plot threads and arcs         | status (active/resolved), stakes, involved_characters |
| **Item**         | Equipment and artifacts       | significance, current_holder, properties              |
| **Lore**         | Background truths             | category (magic/history/geography/etc.)               |
| **Session**      | Session summaries             | session_number, key_events, decisions_made            |
| **Ancestry**     | Biological heritage           | typical_traits, physical_characteristics              |
| **Culture**      | Society/upbringing            | values, customs, typical_occupations                  |
| **Scene**        | Active scene state            | stakes, pressures, exit_conditions                    |

### Character Subtypes

```typescript
interface Character extends Entity {
  type: 'character';
  subtype: 'pc' | 'major_npc' | 'minor_npc';

  // Full stats (PCs and major NPCs only)
  stats?: {
    str: number;
    dex: number;
    tgh: number; // Physical
    chr: number;
    wts: number;
    cmp: number; // Social
    knw: number;
    itn: number;
    det: number; // Mental
  };
  measures?: {
    health: number; // tgh + 1
    standing: number; // cmp + 1
    resolve: number; // det + 1
  };
  traits?: string[]; // Permanent and temporary

  // Minor NPC simplified stats
  level?: number; // 0-5
  category?: 'physical' | 'social' | 'mental';
  // In-category stats = level, out-of-category = ceil(level/2)
  // Max traits = floor(level/2)
}
```

### NPC Promotion Rules

Minor NPCs stay minor unless explicitly promoted. Promotion triggers:

1. **Mechanical change** — NPC gains or loses a trait
2. **Level increase** — NPC goes from level 1 → 2+
3. **Explicit request** — Player asks or GM decides
4. **Relationship entanglement** — NPC becomes target of Story thread

Sync script detects (1) and (2) mechanically and flags for review:

```
Sync complete:
  - 3 minor NPCs persisted
  - 5 events recorded

Flagged for review:
  ⚑ Borik the Innkeeper — gained trait "Owes Kira a favor"
    Promote to major NPC? [y/N]
```

---

## 5. Edge Model

### Design Decision: One Edge Per Pair

Rather than multiple typed edges between entities, use **one directed edge per entity pair** with all meaning in properties.

```typescript
interface EdgeProperties {
  // What kinds of connection exist (can be multiple)
  facets: ConnectionFacet[];

  // Numeric scales (-5 to +5, null if unknown/irrelevant)
  disposition?: number; // How source feels about target
  trust?: number; // How much source trusts target
  influence?: number; // Power dynamic (positive = source has power over target)

  // Narrative context
  context?: string; // How they met / nature of connection
  history?: string[]; // Key events in the relationship

  // Knowledge (what source knows about target)
  knowledge?: {
    summary: string; // One-line assessment
    facts: string[]; // Individual known facts with sourcing
  };

  // Metadata
  established_at?: string; // Session/event when connection formed
  last_interaction?: string; // Most recent session/event
}

type ConnectionFacet =
  | 'knows' // Have met / aware of each other
  | 'family' // Blood or legal relation
  | 'member_of' // Belongs to (org, faction, group)
  | 'located_in' // Spatial containment
  | 'possesses' // Owns or carries
  | 'involved_in' // Participated in (event, story)
  | 'created_by'; // Made by / originates from
```

### Example Edges

**Kira → Baron** (interpersonal):

```json
{
  "facets": ["knows"],
  "disposition": -1,
  "trust": -3,
  "context": "Met at the Governor's gala. He was charming but evasive.",
  "knowledge": {
    "summary": "Powerful, secretive. Up to something.",
    "facts": [
      "Former soldier (told by Borik)",
      "Scar on left cheek (observed)",
      "Visits the docks at night (rumor)"
    ]
  },
  "established_at": "session:3",
  "last_interaction": "session:5"
}
```

**Kira → Thieves Guild** (membership):

```json
{
  "facets": ["member_of", "knows"],
  "disposition": 2,
  "trust": 1,
  "influence": -2,
  "context": "Junior member. Owes advancement to Guildmaster Vex.",
  "history": [
    "Inducted after proving herself in the Dockside job",
    "Promoted to runner after the warehouse heist"
  ],
  "established_at": "session:1"
}
```

### Edge Directionality

- **Symmetric relationships** (e.g., `knows`) → create two edges with potentially different properties (Kira distrusts Baron; Baron is indifferent to Kira)
- **Asymmetric relationships** (e.g., `member_of`, `located_in`, `possesses`) → one edge only

```typescript
async function upsertEdge(
  sourceId: string,
  targetId: string,
  properties: EdgeProperties,
  options?: { symmetric?: boolean }
): Promise<void> {
  // Insert/update source → target edge
  await db.run(upsertSQL, [sourceId, targetId, properties]);

  // If symmetric, also create target → source
  if (options?.symmetric) {
    await upsertEdge(targetId, sourceId, properties, { symmetric: false });
  }
}
```

### Why This Approach?

**Edges for structure, prose for knowledge.**

| Question                                   | Mechanism                      |
| ------------------------------------------ | ------------------------------ |
| "What does Kira know about the Baron?"     | `edge.properties.knowledge`    |
| "Has Kira met the Baron?"                  | Edge exists with `knows` facet |
| "Who does Kira trust?"                     | Edges where `trust > 0`        |
| "What factions is the Baron connected to?" | Graph traversal                |

This avoids edge explosion while maintaining queryability. A PC might have 50-100 edges total, not thousands.

---

## 6. Scene System

### Scene Entity

Scenes are active containers that drive play forward without railroading.

```typescript
interface Scene {
  id: string;
  name: string;
  location_id: string;

  // Narrative structure
  central_tension: string; // "Will Kira convince the Baron or expose her as a spy?"
  stakes: {
    success: string; // What happens if PC achieves goal
    failure: string; // What happens if PC fails
    stalemate: string; // What happens if neither resolves
  };

  // Drive mechanics
  pressures: Array<{
    source_id: string; // NPC or entity creating pressure
    direction: string; // What they're pushing toward
    urgency: 1 | 2 | 3 | 4 | 5;
  }>;

  exit_conditions: string[]; // Scene ends when any of these resolve

  escalation_triggers: Array<{
    if: string; // "Player hasn't acted in 3 exchanges"
    then: string; // "Baron's guard enters with urgent news"
  }>;

  status: 'active' | 'resolved';
  resolution?: string;
}
```

### scene.json Structure

```typescript
interface SceneFile {
  // Active scene metadata
  scene: Scene;

  // Loaded from MCP at scene start (read-mostly)
  context: {
    location: Entity;
    characters: Entity[];
    relationships: Edge[];
    pc_knowledge: Edge[]; // Edges where PC is source, has knowledge
    active_stories: Entity[];
  };

  // Created/modified during play (all gets persisted)
  working: {
    new_entities: Entity[];
    modified_entities: Entity[];
    new_edges: Edge[];
    events: GameEvent[]; // What happened this scene
  };
}
```

### Scene Lifecycle

1. **Scene Start** — Call `load_scene_context()`, populate `context`
2. **During Play** — Claude reads `context`, writes to `working`
3. **Scene End** — Triggered by exit condition or player action
4. **Sync** — `working` entities persisted to MCP, embeddings generated

---

## 7. Runtime Architecture

### File-First Design

During play, Claude operates entirely on `scene.json`:

- **Read** context for established facts
- **Write** new entities/edges to working section
- **No MCP calls** mid-scene (zero latency)

### Context Loading

At scene start, MCP returns a bundled context:

```typescript
async function loadSceneContext(params: {
  location_id: string;
  character_ids: string[];
  pc_id: string;
}): Promise<SceneContext> {
  const [location, characters, relationships, knowledge, stories] = await Promise.all([
    getEntityWithAncestors(params.location_id, 'located_in'),
    getEntities(params.character_ids),
    getEdgesBetween(params.character_ids),
    getKnowledgeEdges(params.pc_id, params.character_ids),
    getActiveStories(params.character_ids),
  ]);

  return {
    location,
    characters,
    relationships,
    pc_knowledge: knowledge,
    active_stories: stories,
    npc_agendas: characters
      .filter((c) => c.id !== params.pc_id)
      .map((c) => ({ npc: c.name, goals: c.properties?.goals })),
  };
}
```

### Compaction (Optional Mid-Scene)

If `scene.json` grows too large (token threshold), compact by:

1. Persisting `working` entities to MCP
2. Replacing full entities with summaries in `context`
3. Clearing `working`

---

## 8. MCP Tool Interface

### Core Tools

```typescript
// Scene initialization
tool: "load_scene_context"
params: {
  location_id: string;
  character_ids: string[];
  pc_id: string;
}
returns: SceneContext

// Fuzzy search by name/text
tool: "search_entities"
params: {
  query: string;
  types?: EntityType[];
  limit?: number;
}
returns: EntitySummary[]

// Semantic search by concept
tool: "search_semantic"
params: {
  query: string;           // "NPCs with hidden agendas"
  types?: EntityType[];
  min_similarity?: number;
  limit?: number;
}
returns: EntitySummary[]

// Graph traversal
tool: "get_connections"
params: {
  entity_id: string;
  facets?: ConnectionFacet[];
  direction: 'outgoing' | 'incoming' | 'both';
  depth?: number;          // 1 = direct, 2 = friends-of-friends
  limit?: number;
}
returns: { entities: Entity[]; edges: Edge[] }

// Single entity fetch
tool: "get_entity"
params: { id: string }
returns: Entity | null

// Persistence (called at sync time)
tool: "persist_entities"
params: { entities: Entity[] }
returns: { persisted_ids: string[] }

tool: "persist_edges"
params: { edges: Edge[] }
returns: { persisted_count: number }

tool: "create_session_event"
params: {
  session_number: number;
  summary: string;
  key_events: string[];
  decisions_made: string[];
  threads_advanced: string[];
}
returns: { event_id: string }
```

---

## 9. Query Patterns

### Exact/Fuzzy Search (FTS5)

```sql
-- Find by name
SELECT * FROM entities WHERE id IN (
  SELECT rowid FROM entities_fts WHERE entities_fts MATCH 'baron'
);

-- Prefix search
SELECT * FROM entities WHERE id IN (
  SELECT rowid FROM entities_fts WHERE entities_fts MATCH 'bar*'
);
```

### Semantic Search (sqlite-vec)

```sql
-- Find similar to query embedding
SELECT e.*, v.distance
FROM entities e
JOIN entities_vec v ON e.id = v.id
WHERE v.embedding MATCH ?  -- query embedding
ORDER BY v.distance
LIMIT 10;
```

### Graph Traversal

```sql
-- Who does Kira know?
SELECT e.* FROM edges
JOIN entities e ON e.id = edges.target_id
WHERE edges.source_id = 'kira'
  AND json_extract(properties, '$.facets') LIKE '%knows%';

-- Who does Kira distrust?
SELECT e.* FROM edges
JOIN entities e ON e.id = edges.target_id
WHERE edges.source_id = 'kira'
  AND json_extract(properties, '$.trust') < 0;

-- What does Kira know about the Baron?
SELECT json_extract(properties, '$.knowledge')
FROM edges
WHERE source_id = 'kira' AND target_id = 'baron';

-- Path finding (3 hops max)
WITH RECURSIVE path AS (
  SELECT target_id, 1 as depth, source_id || '->' || target_id as route
  FROM edges WHERE source_id = 'kira'

  UNION ALL

  SELECT e.target_id, p.depth + 1, p.route || '->' || e.target_id
  FROM edges e
  JOIN path p ON e.source_id = p.target_id
  WHERE p.depth < 3
)
SELECT * FROM path WHERE target_id = 'king' LIMIT 1;
```

---

## 10. Sync & Persistence Flow

### Git Hook (`post-commit`)

```bash
#!/bin/bash
SCENE_FILE="campaign/scene.json"

if [ -f "$SCENE_FILE" ]; then
  # Check if scene has working changes
  if jq -e '.working.new_entities | length > 0' "$SCENE_FILE" > /dev/null || \
     jq -e '.working.modified_entities | length > 0' "$SCENE_FILE" > /dev/null; then

    echo "Syncing scene.json to MCP database..."
    npx ts-node scripts/sync-to-mcp.ts "$SCENE_FILE"

    # Clear working section
    jq '.working = { new_entities: [], modified_entities: [], new_edges: [], events: [] }' \
      "$SCENE_FILE" > tmp.json && mv tmp.json "$SCENE_FILE"

    git add "$SCENE_FILE"
    git commit --amend --no-edit
  fi
fi
```

### Sync Script Logic

```typescript
async function syncSceneToMcp(scenePath: string): Promise<SyncReport> {
  const scene = JSON.parse(await fs.readFile(scenePath, 'utf-8'));

  // 1. Persist all new entities
  for (const entity of scene.working.new_entities) {
    await mcp.upsertEntity(entity);
    await mcp.embedEntity(entity.id);
  }

  // 2. Persist modified entities, detect promotions
  const flagged: FlaggedEntity[] = [];
  for (const entity of scene.working.modified_entities) {
    const original = scene.context.characters.find(c => c.id === entity.id);

    if (detectPromotion(original, entity)) {
      flagged.push({ entity, reason: getPromotionReason(original, entity) });
    }

    await mcp.upsertEntity(entity);
    await mcp.embedEntity(entity.id);
  }

  // 3. Persist edges
  await mcp.upsertEdges(scene.working.new_edges);

  // 4. Create session event from scene.working.events
  if (scene.working.events.length > 0) {
    await mcp.createSessionEvent({
      summary: scene.scene.resolution || 'Scene completed',
      key_events: scene.working.events.map(e => e.description),
    });
  }

  return { persisted: { ... }, flagged };
}

function detectPromotion(original: Entity, modified: Entity): boolean {
  if (original?.subtype !== 'minor_npc') return false;

  const oldTraits = original.properties?.traits || [];
  const newTraits = modified.properties?.traits || [];
  const oldLevel = original.properties?.level || 0;
  const newLevel = modified.properties?.level || 0;

  return newTraits.length !== oldTraits.length || newLevel > oldLevel;
}
```

---

## 11. Scale Analysis

### Stress Test: Massive Campaign

| Type               | Count                      |
| ------------------ | -------------------------- |
| Characters         | 500 (100 major, 400 minor) |
| Locations          | 100                        |
| Organizations      | 30                         |
| Items              | 100                        |
| Events             | 200                        |
| Stories            | 50                         |
| Lore               | 50                         |
| PCs                | 3                          |
| **Total Entities** | **~1,000**                 |

### Edge Count

| Edge Type             | Estimate           |
| --------------------- | ------------------ |
| NPC ↔ NPC (symmetric) | 15,000             |
| NPC → Location        | 1,500              |
| NPC → Organization    | 400                |
| Character → Event     | 2,000              |
| Character → Story     | 300                |
| Location hierarchy    | 200                |
| PC → everything       | 500                |
| **Total Edges**       | **~20,000-25,000** |

### Storage Requirements

| Component         | Size          |
| ----------------- | ------------- |
| Entities table    | ~5 MB         |
| Edges table       | ~12 MB        |
| FTS5 index        | ~3 MB         |
| Vector embeddings | ~10 MB        |
| **Total**         | **~30-50 MB** |

### Query Performance

| Query Type               | Time    |
| ------------------------ | ------- |
| Single entity lookup     | < 1ms   |
| Fuzzy name search        | < 5ms   |
| Semantic search (top 10) | 10-50ms |
| Direct edge lookup       | < 1ms   |
| 3-hop path finding       | 10-50ms |

**Verdict:** SQLite handles 10× this scale without issue.

---

## 12. AIRP System Rules Reference

### Stats (Scale: 1-10, Average: 2)

| Category | Stats         |
| -------- | ------------- |
| Physical | Str, Dex, Tgh |
| Social   | Chr, Wts, Cmp |
| Mental   | Knw, Itn, Det |

### Measures (Damage Tracks)

- **Health** = Tgh + 1 → Physical conflict
- **Standing** = Cmp + 1 → Social conflict
- **Resolve** = Det + 1 → Mental conflict
- At 0: Character is _taken out_

### Action Resolution

1. Determine **Stat** and **Difficulty** (0-10; 2 = Standard)
2. Tally **ADV** and **HIN** from traits (cancel 1:1)
3. Roll:
   - Base: 1d6
   - Net ADV: +1d6 per ADV, keep highest
   - Net HIN: +1d6 per HIN, keep lowest
4. **Total = Die + Stat - Difficulty**
5. Results:
   - ≥ 4: Success
   - ≤ 3: Failure + minor complication
   - Natural 6 + Success: Critical Success
   - Natural 1 + Failure: Critical Failure

### Minor NPCs

- **Level** (0-5) + **Category** (Physical/Social/Mental)
- In-category stats = Level
- Out-of-category stats = ⌈Level ÷ 2⌉
- Max traits = ⌊Level ÷ 2⌋

---

## 13. Open Questions

### Embedding Generation

- **When?** Batch at sync time (recommended) vs. lazy on first search
- **Where?** Local ONNX model vs. API call
- **What if offline?** Queue for later embedding, still persist entity

### Scene Compaction Threshold

- Token estimate threshold before forcing compaction?
- Automatic vs. manual trigger?

### Multi-PC Campaigns

- Separate knowledge blocks per PC?
- Shared party knowledge edge?

### Retcon Protocol

When player contradicts established fact:

1. Surface contradiction explicitly
2. If confirmed, update entity with `retconned: true` flag
3. Keep old version in history for reference

### Campaign Portability

- Export format for sharing campaigns?
- Import/merge from other campaigns?

---

## File Structure (Proposed)

```
campaign/
├── scene.json              # Active scene state
├── character.json          # PC quick-reference (derived from MCP)
├── session_log.md          # Running narrative log
└── airp.db                 # SQLite database (MCP storage)

scripts/
├── sync-to-mcp.ts          # Git hook script
├── load-scene.ts           # Scene initialization
└── embed-entities.ts       # Batch embedding

mcp-server/
├── src/
│   ├── tools/              # MCP tool implementations
│   ├── db/                 # SQLite + sqlite-vec setup
│   ├── search/             # FTS5 + semantic search
│   └── graph/              # Edge traversal
├── package.json
└── tsconfig.json
```

---

_Last updated: January 2025_
_Status: Design complete, ready for implementation_
