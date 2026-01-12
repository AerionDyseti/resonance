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

During active play, maintain a `scene.json` file:

```json
{
  "scene": { ... },           // Active scene entity
  "context": {                // Loaded from DB at scene start
    "location": { ... },
    "characters": [ ... ],
    "connections": [ ... ],
    "pcKnowledge": [ ... ],
    "activeStories": [ ... ],
    "npcAgendas": [ ... ]
  },
  "working": {                // Accumulate changes here
    "newEntities": [],
    "modifiedEntities": [],
    "newConnections": [],
    "modifiedConnections": [],
    "events": []
  },
  "chronicleId": "...",
  "sessionId": "...",
  "sceneNumber": 1,
  "lastSyncedAt": "..."
}
```

### Workflow:

1. **Load scene context** — Query DB for location, characters, connections
2. **Play** — Accumulate changes in `working` section
3. **Sync** — At natural breakpoints, persist `working` to DB
4. **End scene** — Clear temporary traits, resolve the scene
5. **End session** — Create Session entity summarizing what happened

---

## ID Generation

IDs are UUIDs. You can:

- Generate random: Use any UUID v4
- Generate deterministic: Same key always produces same ID (useful for canonical entities)

When creating entities, always generate an ID before persisting.

---

## Tool Usage Patterns

### Starting a session

1. Load the chronicle: `get_entity(chronicleId)`
2. Check active stories: `list_entities(chronicleId, type='story')`
3. Set up the scene with `scene.json`

### During play

1. Search for relevant entities: `search_entities(query)` or `find_by_name(name)`
2. Load full entities as needed: `get_entity(id)` or `get_entities(ids)`
3. Check relationships: `get_connections(entityId)`
4. Accumulate changes in `scene.json`'s working section

### Persisting changes

1. Batch persist: `persist_entities(entities)`
2. Persist connections separately (future tool)

### Ending a session

1. Persist all pending changes
2. Create a Session entity summarizing the session
3. Update any modified Stories

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
