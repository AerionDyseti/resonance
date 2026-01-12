# AIRP System Guide

**AI-assisted Interactive Roleplaying Protocol**

You are connected to the Resonance AIRP memory system. This guide explains how to use the MCP tools to manage game state during AI-assisted solo roleplaying sessions.

---

## Overview

AIRP uses a **file-first** architecture:

- During play: Work with `scene.json` (your working memory)
- At session boundaries: Persist to the database via MCP tools

This keeps gameplay fast while ensuring nothing is lost.

---

## Core Concepts

### Chronicle

A **Chronicle** is a campaign or setting. All entities belong to exactly one chronicle via their `chronicleId`. Always scope queries by `chronicleId` when possible.

### Entity

Everything in the world is an **Entity** with this structure:

```
{
  id: string,           // UUID
  chronicleId: string,  // Which chronicle this belongs to
  type: string,         // Entity type (see below)
  subtype?: string,     // Optional refinement
  name: string,         // Display name
  summary?: string,     // Brief description (for search results)
  body?: string,        // Full description/content
  properties: {...},    // Type-specific data (see Entity Types)
  createdAt: string,    // ISO timestamp
  updatedAt: string     // ISO timestamp
}
```

### Connection

**Connections** are directed relationships between entities:

```
{
  id: string,
  sourceId: string,     // From entity
  targetId: string,     // To entity
  description: string,  // Semantic summary (used for search)
  facets: {             // Keyed by ConnectionTypeId
    [typeId]: {
      description?: string,
      degree?: number,  // -5 to +5 intensity
      establishedAt?: string,
      lastUpdated?: string
    }
  }
}
```

Connections are **directional**. For reciprocal relationships, create two connections pointing opposite ways.

---

## Entity Types

### chronicle

The container for a campaign/setting. Its own `chronicleId` references itself.

| Property   | Type                                               | Description                    |
| ---------- | -------------------------------------------------- | ------------------------------ |
| status     | `active` \| `completed` \| `abandoned` \| `paused` | Chronicle state                |
| setting    | string                                             | Brief world description        |
| pcIds      | CharacterId[]                                      | Player character IDs           |
| sessionIds | SessionId[]                                        | All sessions in this chronicle |
| storyIds   | StoryId[]                                          | Active story threads           |

---

### character

PCs, NPCs, creatures, and beings with stats.

| Property   | Type                | Description                                                         |
| ---------- | ------------------- | ------------------------------------------------------------------- |
| categoryId | CharacterCategoryId | References lookup table (pc, major_npc, villain, etc.)              |
| level      | number              | Power tier (default 2 = average person). Gates max stats and traits |
| isMinion   | boolean             | If true: all measures = 1, max 1 permanent trait                    |
| stats      | CharacterStats      | str, dex, tgh, chr, wts, cmp, knw, itn, det (scale 1-10)            |
| measures   | CharacterMeasures   | health, standing, resolve (derived from stats)                      |
| traits     | Trait[]             | Advantages, disadvantages, conditions                               |
| ancestryId | AncestryId          | Biological heritage                                                 |
| cultureId  | CultureId           | Social background                                                   |
| locationId | LocationId          | Current location                                                    |
| goals      | string[]            | What they want                                                      |
| secrets    | string[]            | Hidden information                                                  |
| fears      | string[]            | What they're afraid of                                              |

**Stats (1-10 scale, 2 = average human):**

- Physical: str (Strength), dex (Dexterity), tgh (Toughness)
- Social: chr (Charisma), wts (Wits), cmp (Composure)
- Mental: knw (Knowledge), itn (Intuition), det (Determination)

**Measures (damage tracks):**

- health = tgh + 1 (physical)
- standing = cmp + 1 (social)
- resolve = det + 1 (mental)

**Traits:**

```
{ name: string, temporary: boolean, context?: string }
```

- Temporary traits clear at scene end
- Permanent traits persist until narratively removed
- Max permanent traits = floor(level / 2) + 1
- Minions: max 1 permanent trait regardless of level

---

### location

Places with spatial hierarchy.

| Property         | Type          | Description               |
| ---------------- | ------------- | ------------------------- |
| scale            | LocationScale | Size category (see below) |
| parentLocationId | LocationId    | Container location        |
| atmosphere       | string        | Mood/feeling              |
| notableFeatures  | string[]      | Key details               |
| inhabitants      | CharacterId[] | Who lives here            |
| currentOccupants | CharacterId[] | Who's here now            |
| secrets          | string[]      | Hidden information        |

**Location Scale (smallest to largest):**

1. `subsite` - Room or section
2. `site` - Building or point of interest
3. `area` - Locale with multiple sites
4. `district` - Subdivision of a city
5. `city` - Geographic settlement
6. `region` - Administrative area
7. `nation` - Political territory
8. `continent` - Major landmass
9. `plane` - Plane of existence
10. `stratum` - Fundamental cosmological layer

---

### organization

Factions, guilds, governments, and groups.

| Property         | Type                                               | Description                                                |
| ---------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| categoryId       | OrganizationCategoryId                             | References lookup table (faction, guild, government, etc.) |
| structure        | string                                             | How it's organized                                         |
| size             | `tiny` \| `small` \| `medium` \| `large` \| `vast` | Scale                                                      |
| influence        | number                                             | 1-5 power level                                            |
| headquarters     | LocationId                                         | Base of operations                                         |
| goals            | string[]                                           | What they want                                             |
| resources        | string[]                                           | What they control                                          |
| publicPerception | string                                             | How outsiders see them                                     |
| secrets          | string[]                                           | Hidden information                                         |
| foundedAt        | EventId                                            | Origin event                                               |

---

### event

Specific happenings, historical or during play.

| Property          | Type       | Description                     |
| ----------------- | ---------- | ------------------------------- |
| when              | string     | When it happened (can be vague) |
| locationId        | LocationId | Where it happened               |
| involvedEntityIds | EntityId[] | Who/what was involved           |
| outcome           | string     | What resulted                   |
| consequences      | string[]   | Ongoing effects                 |
| sessionId         | SessionId  | If it happened during play      |

---

### story

Plot threads, quests, and narrative arcs.

| Property             | Type                                  | Description                |
| -------------------- | ------------------------------------- | -------------------------- |
| status               | `active` \| `resolved` \| `abandoned` | Story state                |
| resolution           | string                                | How it ended               |
| stakes               | string                                | What's at risk             |
| threads              | string[]                              | Sub-plots or complications |
| involvedCharacterIds | CharacterId[]                         | Key participants           |
| keyLocationIds       | LocationId[]                          | Important places           |
| sessionIds           | SessionId[]                           | Sessions this appeared in  |

---

### item

Equipment, artifacts, and significant objects.

| Property        | Type        | Description                    |
| --------------- | ----------- | ------------------------------ |
| significance    | string      | Why it matters                 |
| currentHolderId | CharacterId | Who has it                     |
| locationId      | LocationId  | Where it is (if not held)      |
| origin          | string      | Where it came from             |
| history         | string[]    | Key events involving it        |
| powers          | string[]    | Special properties             |
| value           | string      | Worth (narrative, not numeric) |

---

### lore

Background truths about the world.

| Property         | Type          | Description                                                           |
| ---------------- | ------------- | --------------------------------------------------------------------- |
| description      | string        | The actual lore content                                               |
| category         | LoreCategory  | magic, history, geography, religion, culture, politics, nature, other |
| significance     | string        | Why it matters                                                        |
| isSecret         | boolean       | GM-only knowledge                                                     |
| knownByIds       | CharacterId[] | Who knows this (see below)                                            |
| relatedEntityIds | EntityId[]    | What this lore pertains to                                            |

**knownByIds semantics:**

- `undefined` = common knowledge (everyone knows)
- `[]` = lost/secret knowledge (no one knows)
- `[ids...]` = known by specific characters

---

### session

Session summaries and play logs.

| Property             | Type          | Description                   |
| -------------------- | ------------- | ----------------------------- |
| sessionNumber        | number        | Sequential session number     |
| date                 | string        | Real-world date               |
| pcId                 | CharacterId   | Which PC was played           |
| keyEvents            | string[]      | What happened                 |
| decisionsMade        | string[]      | Choices the player made       |
| cliffhanger          | string        | How the session ended         |
| storyIds             | StoryId[]     | Stories this session advanced |
| sceneIds             | SceneId[]     | Scenes played                 |
| charactersIntroduced | CharacterId[] | New characters                |
| charactersExpanded   | CharacterId[] | Characters developed further  |
| locationsVisited     | LocationId[]  | Places visited                |
| locationsIntroduced  | LocationId[]  | New places                    |
| eventsOccurred       | EventId[]     | Things that happened          |
| loreDiscovered       | LoreId[]      | Knowledge gained              |
| itemsAcquired        | ItemId[]      | Items gained                  |
| itemsLost            | ItemId[]      | Items lost                    |

---

### scene

Active play container (usually in `scene.json`).

| Property            | Type                                                         | Description                                                        |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| locationId          | LocationId                                                   | Where the scene takes place                                        |
| status              | `active` \| `paused` \| `resolved` \| `abandoned`            | Scene state                                                        |
| presentCharacterIds | CharacterId[]                                                | Who's in the scene                                                 |
| hiddenCharacterIds  | CharacterId[]                                                | Characters present but not known                                   |
| pcId                | CharacterId                                                  | The player character                                               |
| centralTension      | string                                                       | Core dramatic question                                             |
| stakes              | { success, failure, stalemate? }                             | What's at risk                                                     |
| phase               | `setup` \| `rising` \| `climax` \| `falling` \| `resolution` | Dramatic arc                                                       |
| heat                | number                                                       | 1-5 tension level                                                  |
| timeOfDay           | TimeOfDay                                                    | dawn, morning, midday, afternoon, dusk, evening, night, late_night |
| weather             | string                                                       | Conditions                                                         |
| timeConstraint      | { deadline, consequence }                                    | Ticking clock                                                      |
| mood                | string                                                       | Atmosphere                                                         |
| sensoryDetails      | { sight?, sound?, smell?, touch?, taste? }                   | Immersion details                                                  |
| pressures           | ScenePressure[]                                              | NPCs pushing the scene                                             |
| escalationTriggers  | { condition, action }[]                                      | When/how to escalate                                               |
| exitConditions      | string[]                                                     | How the scene can end                                              |
| discoveries         | string[]                                                     | Things learned                                                     |
| openQuestions       | string[]                                                     | Unresolved mysteries                                               |
| foreshadowing       | string[]                                                     | Seeds planted                                                      |
| callbacks           | string[]                                                     | References to earlier events                                       |

---

### ancestry

Biological heritage (race/species). Purely physical—social aspects go in Culture.

| Property                | Type                                               | Description            |
| ----------------------- | -------------------------------------------------- | ---------------------- |
| physicalCharacteristics | string[]                                           | Appearance traits      |
| size                    | `tiny` \| `small` \| `medium` \| `large` \| `huge` | Body size              |
| lifespan                | string                                             | How long they live     |
| typicalTraits           | string[]                                           | Innate characteristics |
| rarity                  | `common` \| `uncommon` \| `rare` \| `legendary`    | How common             |
| homelandIds             | LocationId[]                                       | Where they're from     |
| typicalCultureIds       | CultureId[]                                        | Associated cultures    |
| loreIds                 | LoreId[]                                           | Deeper context         |

---

### culture

Society and upbringing. Social aspects including naming—not biology.

| Property           | Type                        | Description              |
| ------------------ | --------------------------- | ------------------------ |
| values             | string[]                    | What they believe in     |
| taboos             | string[]                    | What's forbidden         |
| customs            | string[]                    | Practices and traditions |
| greetings          | string                      | How they say hello       |
| socialStructure    | string                      | Hierarchy, classes       |
| language           | string                      | Primary language         |
| namingConventions  | string                      | How names work           |
| commonNames        | { given?, family?, other? } | Typical names            |
| typicalOccupations | string[]                    | Common jobs              |
| homelandIds        | LocationId[]                | Where they're from       |
| typicalAncestryIds | AncestryId[]                | Associated ancestries    |
| loreIds            | LoreId[]                    | Deeper context           |

---

### misc

Escape hatch for anything that doesn't fit existing types. If patterns emerge, promote to a proper type.

| Property    | Type   | Description  |
| ----------- | ------ | ------------ |
| description | string | What this is |

---

## Lookup Tables

Three lookup tables maintain naming consistency. Query them with `get_lookup_types` before creating new entries.

### connection_types

How entities relate: knows, trusts, loves, fears, parent_of, member_of, owns, etc.

### character_categories

Character categories: pc, major_npc, minor_npc, companion, villain, patron, deity, spirit, creature

### organization_categories

Organization categories: faction, guild, government, religion, family, company, military, secret_society, criminal, academic, cult, tribe

**Creating new entries:** If you need a category not in the lookup table, you can use it—the system accepts any string. But first check existing entries for consistency.

---

## The scene.json Workflow

During active play, maintain a `scene.json` file as your working memory. This keeps gameplay fast by avoiding constant database queries.

### Scene File Structure

```json
{
  "scene": {
    "id": "scene-001",
    "type": "scene",
    "name": "Confrontation at the Inn",
    "properties": {
      "locationId": "loc-prancing-pony",
      "status": "active",
      "presentCharacterIds": ["char-frodo", "char-strider", "char-butterbur"],
      "hiddenCharacterIds": ["char-nazgul-spy"],
      "pcId": "char-frodo",
      "centralTension": "Will Frodo's identity be discovered?",
      "stakes": {
        "success": "Frodo makes contact with Strider safely",
        "failure": "The Black Riders learn Frodo's location"
      },
      "phase": "rising",
      "heat": 3,
      "timeOfDay": "evening",
      "mood": "tense anticipation"
    }
  },
  "context": {
    "location": {
      /* Full location entity */
    },
    "characters": [
      /* All character entities in scene */
    ],
    "connections": [
      /* Relationships between present characters */
    ],
    "pcKnowledge": [
      /* What the PC knows about others */
    ],
    "activeStories": [
      /* Active story threads */
    ],
    "npcAgendas": [
      {
        "characterId": "char-strider",
        "name": "Strider",
        "goals": ["Protect the Ring-bearer", "Earn Frodo's trust"]
      },
      {
        "characterId": "char-butterbur",
        "name": "Barliman",
        "goals": ["Keep the peace", "Remember Gandalf's letter"]
      }
    ]
  },
  "working": {
    "newEntities": [],
    "modifiedEntities": [],
    "newConnections": [],
    "modifiedConnections": [],
    "events": []
  },
  "chronicleId": "chronicle-lotr",
  "sessionId": "session-005",
  "sceneNumber": 2,
  "lastSyncedAt": "2024-01-15T20:30:00Z"
}
```

### Loading Scene Context

Use `load_scene_context` at scene start to populate the `context` section:

```
load_scene_context({
  "sceneId": "scene-001",
  "chronicleId": "chronicle-lotr",
  "pcId": "char-frodo"  // Optional, defaults to scene's pcId
})
```

**Returns:**

- `scene` — The full scene entity
- `location` — Location entity where the scene takes place
- `characters` — All characters (present + hidden)
- `connections` — Relationships between present characters (how NPCs relate to each other)
- `pcKnowledge` — Connections where PC is source or target (what the PC knows)
- `activeStories` — Stories with status='active' in this chronicle
- `npcAgendas` — Goals and secrets extracted from each NPC's properties

**NPC Agendas** are automatically extracted from character properties:

```json
// If a character has:
{ "goals": ["Find the Ring", "Report to Sauron"], "secrets": ["Is a spy"] }

// The agenda becomes:
{ "characterId": "...", "name": "...", "goals": [...], "secrets": [...] }
```

### Workflow

1. **Scene Start**
   - Create or load a Scene entity
   - Call `load_scene_context` to get all relevant data
   - Populate scene.json

2. **During Play**
   - Reference context for NPC motivations, relationships, location details
   - Track changes in the `working` section:
     - `newEntities` — Entities created during play
     - `modifiedEntities` — Entities that changed
     - `newConnections` — New relationships formed
     - `modifiedConnections` — Relationships that evolved
     - `events` — Significant happenings to record

3. **Sync Points** (natural breakpoints)
   - Persist `working.newEntities` and `working.modifiedEntities` via `persist_entities`
   - Persist connections via `persist_connection`
   - Clear the working section
   - Update `lastSyncedAt`

4. **Scene End**
   - Clear temporary traits from all characters
   - Update scene status to `resolved` or `abandoned`
   - Persist final state

5. **Session End**
   - Create a Session entity summarizing what happened
   - Update any Stories that advanced
   - Final sync of all changes

---

## ID Generation

IDs are UUIDs. You can:

- Generate random: Use any UUID v4
- Generate deterministic: Same key always produces same ID (useful for canonical entities)

When creating entities, always generate an ID before persisting.

---

## Tool Reference

The MCP server provides **14 tools** across four groups.

### Entity Tools

| Tool               | Parameters                                                                         | Description                                                          |
| ------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `get_entity`       | `id`                                                                               | Get a single entity by ID. Returns full entity with all properties.  |
| `get_entities`     | `ids[]`                                                                            | Get multiple entities by IDs. Useful for batch loading.              |
| `list_entities`    | `chronicleId`, `type?`, `limit?`, `offset?`                                        | List entities in a chronicle. Returns summaries (not full entities). |
| `persist_entity`   | `id`, `chronicleId`, `type`, `name`, `subtype?`, `summary?`, `body?`, `properties` | Create or update a single entity. Uses upsert semantics.             |
| `persist_entities` | `entities[]`                                                                       | Batch create/update entities in a single transaction.                |
| `delete_entity`    | `id`                                                                               | Delete an entity by ID. Also removes from FTS index.                 |

### Connection Tools

| Tool                 | Parameters                                              | Description                                                                                                           |
| -------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `persist_connection` | `sourceId`, `targetId`, `description`, `id?`, `facets?` | Create or update a connection. Upserts on the source+target pair—same entity pair always updates the same connection. |
| `delete_connection`  | `id?`, `sourceId?`, `targetId?`                         | Delete a connection. Provide either `id` alone, or both `sourceId` and `targetId`.                                    |

### Scene Tools

| Tool                 | Parameters                        | Description                                                                                                                                                |
| -------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `load_scene_context` | `sceneId`, `chronicleId`, `pcId?` | Bulk load everything for active play. Returns scene, location, characters, connections, PC knowledge, active stories, and NPC agendas. Use at scene start. |

### Search Tools

| Tool                 | Parameters                                 | Description                                                                                           |
| -------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `search_entities`    | `query`, `chronicleId?`, `type?`, `limit?` | Full-text search across name, summary, and body using FTS5.                                           |
| `find_by_name`       | `name`, `chronicleId?`, `type?`, `limit?`  | Quick lookup by exact or partial name match.                                                          |
| `get_connections`    | `entityId`, `direction?`, `limit?`         | Get connections for an entity. Direction: `outgoing`, `incoming`, or `both` (default).                |
| `search_connections` | `query`, `chronicleId?`, `limit?`          | Search connections by description text.                                                               |
| `get_lookup_types`   | `table`                                    | Get values from lookup tables: `connection_types`, `character_categories`, `organization_categories`. |

---

## Tool Usage Patterns

### Starting a Session

```
1. get_entity(chronicleId)           → Load the chronicle
2. list_entities(chronicleId, 'story') → Check active stories
3. Create or load a Scene entity
4. load_scene_context(sceneId, chronicleId, pcId) → Bulk load context
5. Populate scene.json with the returned data
```

### During Play

```
1. search_entities(query) or find_by_name(name) → Find relevant entities
2. get_entity(id) or get_entities(ids)          → Load full details
3. get_connections(entityId)                     → Check relationships
4. Accumulate changes in scene.json's working section
```

### Persisting Changes

```
1. persist_entities(entities)        → Batch persist new/modified entities
2. persist_connection(...)           → Persist each new/modified connection
3. Update scene.json's lastSyncedAt
```

### Managing Connections

**Creating a relationship:**

```json
persist_connection({
  "sourceId": "character-frodo",
  "targetId": "character-gandalf",
  "description": "Frodo trusts Gandalf deeply as a mentor and guide",
  "facets": {
    "trusts": { "degree": 5, "description": "Complete faith" },
    "mentored_by": { "degree": 4 }
  }
})
```

**Updating an existing connection** (same sourceId + targetId):

```json
persist_connection({
  "sourceId": "character-frodo",
  "targetId": "character-gandalf",
  "description": "Frodo's trust in Gandalf has grown through trials",
  "facets": {
    "trusts": { "degree": 5, "description": "Forged through fire" },
    "mentored_by": { "degree": 4 },
    "owes_life_to": { "degree": 5, "establishedAt": "event-moria" }
  }
})
```

**Reciprocal relationships** — Create two connections:

```json
// Frodo → Sam
persist_connection({
  "sourceId": "character-frodo",
  "targetId": "character-sam",
  "description": "Frodo deeply values Sam's loyalty and friendship",
  "facets": { "trusts": { "degree": 5 }, "friend_of": { "degree": 5 } }
})

// Sam → Frodo
persist_connection({
  "sourceId": "character-sam",
  "targetId": "character-frodo",
  "description": "Sam is devoted to protecting and serving Frodo",
  "facets": { "serves": { "degree": 5 }, "friend_of": { "degree": 5 } }
})
```

### Ending a Session

```
1. Persist all pending changes from scene.json
2. persist_entity(...) → Create a Session entity summarizing what happened
3. Update any Stories that advanced (change status if resolved)
4. Clear temporary traits from characters
```

---

## The `extra` Escape Hatch

Every entity has an optional `extra: Record<string, string>` field. Use it for:

- Data that doesn't fit existing properties
- Experimental fields you're not sure about
- Temporary tracking

If you find yourself using the same `extra` key repeatedly, that's a signal it should become a proper property.

---

## Tips

1. **Scope by chronicleId** — Always filter queries by chronicle when possible
2. **Use summaries** — The `summary` field appears in search results; keep it useful
3. **Leverage FTS** — `search_entities` searches name, summary, AND body
4. **Check lookup tables** — Use `get_lookup_types` before inventing new categories
5. **Batch operations** — Use `persist_entities` for multiple changes
6. **Keep scene.json light** — Only load what's relevant to the current scene
7. **Connection descriptions** — Write semantic descriptions that will be useful in search
8. **Facet degree scale** — Use -5 to +5: negative for hostile relationships, 0 for neutral, positive for favorable

---

## Common Patterns

### Creating a New Character

```json
persist_entity({
  "id": "char-new-merchant",
  "chronicleId": "chronicle-main",
  "type": "character",
  "name": "Marcus the Merchant",
  "summary": "A traveling trader with connections to the thieves' guild",
  "body": "Marcus appears to be a simple merchant, but his network of contacts extends into the criminal underworld...",
  "properties": {
    "categoryId": "minor_npc",
    "level": 2,
    "stats": { "str": 2, "dex": 3, "tgh": 2, "chr": 4, "wts": 4, "cmp": 3, "knw": 3, "itn": 3, "det": 2 },
    "measures": { "health": 3, "standing": 4, "resolve": 3 },
    "traits": [
      { "name": "Silver Tongue", "temporary": false },
      { "name": "Guild Connections", "temporary": false }
    ],
    "goals": ["Make a profit", "Stay out of trouble"],
    "secrets": ["Smuggles contraband for the thieves' guild"]
  }
})
```

### Establishing Character Relationships

When introducing characters who know each other, create connections:

```json
// Merchant knows the tavern keeper
persist_connection({
  "sourceId": "char-new-merchant",
  "targetId": "char-innkeeper",
  "description": "Marcus and the innkeeper have a business arrangement",
  "facets": {
    "business_partner": { "degree": 3, "description": "Trades goods regularly" },
    "trusts": { "degree": 2, "description": "Professional trust, not personal" }
  }
})
```

### Recording a Discovery

When the PC learns something significant:

```json
// Add to scene.json working.events
{
  "timestamp": "2024-01-15T21:45:00Z",
  "description": "Frodo discovers that Strider is actually Aragorn, heir of Isildur",
  "involvedEntityIds": ["char-frodo", "char-strider"],
  "type": "discovery"
}

// Update the scene's discoveries array
scene.properties.discoveries.push("Strider's true identity as Aragorn")

// Create/update a connection representing this knowledge
persist_connection({
  "sourceId": "char-frodo",
  "targetId": "char-strider",
  "description": "Frodo now knows Strider is Aragorn and has chosen to trust him",
  "facets": {
    "knows_true_identity": { "degree": 5 },
    "trusts": { "degree": 3, "description": "Cautious but growing" }
  }
})
```

### Advancing a Story Thread

When a story progresses:

```json
// Update the story entity
persist_entity({
  "id": "story-ring-quest",
  "chronicleId": "chronicle-lotr",
  "type": "story",
  "name": "The Quest of the Ring",
  "summary": "Frodo's journey to destroy the One Ring",
  "properties": {
    "status": "active",
    "stakes": "The fate of Middle-earth",
    "threads": [
      "Reach Rivendell safely",
      "Evade the Nazgûl",
      "Find allies for the journey"
    ],
    "involvedCharacterIds": ["char-frodo", "char-sam", "char-strider"],
    "keyLocationIds": ["loc-shire", "loc-bree", "loc-rivendell"]
  }
})
```

### Handling Temporary Traits

During play, characters may gain temporary conditions:

```json
// Character becomes frightened (temporary)
character.properties.traits.push({
  "name": "Shaken",
  "temporary": true,
  "context": "After seeing the Nazgûl"
})

// At scene end, clear temporary traits
character.properties.traits = character.properties.traits.filter(t => !t.temporary)
```

### Creating Lore During Play

When worldbuilding on the fly:

```json
persist_entity({
  "id": "lore-nazgul-weakness",
  "chronicleId": "chronicle-lotr",
  "type": "lore",
  "name": "The Nazgûl Fear Fire",
  "summary": "The Ringwraiths have an aversion to flame",
  "properties": {
    "category": "other",
    "description": "The Nazgûl, bound as they are to the shadow realm, fear fire above most things. A burning brand can hold them at bay when other weapons fail.",
    "isSecret": false,
    "knownByIds": ["char-strider", "char-gandalf"],
    "relatedEntityIds": ["char-nazgul-lord"]
  }
})
```

---

## Facet Degree Scale

The `degree` field in connection facets uses a -5 to +5 scale:

| Degree | Meaning              | Example                              |
| ------ | -------------------- | ------------------------------------ |
| +5     | Absolute/Extreme     | Unconditional love, sworn enemies    |
| +4     | Very Strong          | Deep trust, bitter rivalry           |
| +3     | Strong               | Close friendship, significant grudge |
| +2     | Moderate             | Good acquaintance, mild dislike      |
| +1     | Slight               | Casual familiarity, minor irritation |
| 0      | Neutral              | No particular feeling                |
| -1     | Slight Negative      | Mild distrust, slight unease         |
| -2     | Moderate Negative    | Suspicion, avoidance                 |
| -3     | Strong Negative      | Active dislike, fear                 |
| -4     | Very Strong Negative | Hatred, terror                       |
| -5     | Absolute Negative    | Mortal enmity, consuming dread       |

**Note:** The sign indicates polarity, not just intensity. A "trusts" facet with degree -3 means active _distrust_, not just low trust.

---

## Character Stats Reference

### The Nine Stats (1-10 scale, 2 = average human)

**Physical Domain:**

- **str (Strength)** — Raw physical power, lifting, breaking
- **dex (Dexterity)** — Agility, reflexes, fine motor control
- **tgh (Toughness)** — Endurance, constitution, pain tolerance

**Social Domain:**

- **chr (Charisma)** — Presence, persuasion, leadership
- **wts (Wits)** — Quick thinking, improvisation, cunning
- **cmp (Composure)** — Emotional control, poker face, grace under pressure

**Mental Domain:**

- **knw (Knowledge)** — Education, expertise, memory
- **itn (Intuition)** — Gut feelings, reading situations, empathy
- **det (Determination)** — Willpower, focus, mental resilience

### Measures (Damage Tracks)

| Measure  | Derived From | Represents                 |
| -------- | ------------ | -------------------------- |
| health   | tgh + 1      | Physical well-being        |
| standing | cmp + 1      | Social reputation/position |
| resolve  | det + 1      | Mental/emotional stability |

When a measure hits 0, the character is incapacitated in that domain.

### Level and Traits

- **Level** gates maximum stat values and permanent trait count
- **Max permanent traits** = floor(level / 2) + 1
- **Minions** (isMinion: true): All measures = 1, max 1 permanent trait

---

## Search Strategies

### Finding Entities

```
search_entities({ query: "thieves guild" })     // Full-text search
find_by_name({ name: "Marcus" })                 // Name lookup
list_entities({ chronicleId: "...", type: "character" })  // Browse by type
```

### Finding Relationships

```
get_connections({ entityId: "char-marcus", direction: "outgoing" })  // Who does Marcus relate to?
get_connections({ entityId: "char-marcus", direction: "incoming" })  // Who relates to Marcus?
search_connections({ query: "guild" })                                // Connections mentioning guilds
```

### Combining Searches

To find all characters connected to an organization:

1. `get_entity(organizationId)` — Get the organization
2. `get_connections({ entityId: organizationId, direction: "incoming" })` — Find member connections
3. `get_entities(connectionSourceIds)` — Load those characters
