# Resonance Use Cases

This document catalogs the core use cases for Resonance, organized by bounded context.

---

## I. World Context

**Aggregate Root:** `World`

The World is the top-level container for all worldbuilding content. Each user can own multiple Worlds.

| Use Case               | Description                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| `CreateWorld`          | Initialize a new world container with name and optional description |
| `UpdateWorld`          | Modify world metadata (name, description, settings)                 |
| `ArchiveWorld`         | Soft-delete a world, hiding it from active views                    |
| `RestoreWorld`         | Restore an archived world to active status                          |
| `DeleteWorld`          | Permanently delete a world and all its contents                     |
| `CreateWorldSnapshot`  | Create an immutable point-in-time backup of the entire world state  |
| `RestoreWorldSnapshot` | Revert a world to a previous snapshot state                         |
| `ExportWorld`          | Generate a portable export (JSON/Markdown) of world content         |
| `ImportWorld`          | Create a world from an exported archive                             |
| `ListWorlds`           | Retrieve all worlds for the current user                            |
| `GetWorld`             | Retrieve a single world by ID with summary statistics               |

---

## II. Schema Context (Meta)

**Aggregate Roots:** `EntityDefinition`, `RelationshipDefinition`, `PropertyDefinition`, `Template`

The schema layer defines the structure of content within a world—what types of entities exist, how they relate, and what properties they have.

### Entity Definitions

| Use Case                       | Description                                                        |
| ------------------------------ | ------------------------------------------------------------------ |
| `CreateEntityDefinition`       | Define a new entity type (e.g., "Character", "Location", "Event")  |
| `UpdateEntityDefinition`       | Modify an entity definition's name, icon, or description           |
| `DeleteEntityDefinition`       | Remove an entity definition (fails if entities of this type exist) |
| `ListEntityDefinitions`        | Retrieve all entity definitions for a world                        |
| `AttachPropertyToDefinition`   | Associate a property definition with an entity definition          |
| `DetachPropertyFromDefinition` | Remove a property association from an entity definition            |
| `ReorderDefinitionProperties`  | Change the display order of properties on a definition             |

### Property Definitions

| Use Case                   | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| `CreatePropertyDefinition` | Define a reusable property schema (e.g., "Age", "Population", "Alignment") |
| `UpdatePropertyDefinition` | Modify a property definition's name, type, or constraints                  |
| `DeletePropertyDefinition` | Remove a property definition (cascades to usages)                          |
| `ListPropertyDefinitions`  | Retrieve all property definitions for a world                              |

### Relationship Definitions

| Use Case                       | Description                                                               |
| ------------------------------ | ------------------------------------------------------------------------- |
| `CreateRelationshipDefinition` | Define a connection type (e.g., "allied_with", "parent_of", "located_in") |
| `UpdateRelationshipDefinition` | Modify a relationship definition's name or properties                     |
| `DeleteRelationshipDefinition` | Remove a relationship definition (cascades to instances)                  |
| `ListRelationshipDefinitions`  | Retrieve all relationship definitions for a world                         |

### Templates

| Use Case                     | Description                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `CreateTemplate`             | Create a reusable bundle of property definitions (e.g., "RPG Stats", "Contact Info") |
| `UpdateTemplate`             | Modify a template's name or description                                              |
| `DeleteTemplate`             | Remove a template                                                                    |
| `AddPropertyToTemplate`      | Include a property definition in a template                                          |
| `RemovePropertyFromTemplate` | Exclude a property from a template                                                   |
| `ApplyTemplateToDefinition`  | Attach all of a template's properties to an entity definition                        |
| `ListTemplates`              | Retrieve all templates for a world                                                   |

---

## III. Knowledge Graph Context (World)

**Aggregate Roots:** `Entity`, `Relationship`

The knowledge graph is the living content of a world—the actual characters, locations, events, and the connections between them.

### Entities

| Use Case                 | Description                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| `CreateEntity`           | Instantiate a new entity of a given definition                            |
| `UpdateEntityMetadata`   | Modify entity name, summary, or other metadata                            |
| `UpdateEntityBody`       | Edit the markdown content body of an entity                               |
| `UpdateEntityProperties` | Modify structured property values on an entity                            |
| `DeleteEntity`           | Remove an entity and its relationships                                    |
| `GetEntity`              | Retrieve a single entity with full details                                |
| `ListEntities`           | Retrieve entities with filtering and pagination                           |
| `MergeEntities`          | Combine two entities, consolidating content and redirecting relationships |
| `ConvertEntityType`      | Change an entity's definition (e.g., upgrade "Village" to "City")         |
| `DuplicateEntity`        | Create a copy of an entity with a new name                                |

### Relationships

| Use Case                  | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `CreateRelationship`      | Connect two entities with a defined relationship type |
| `UpdateRelationship`      | Modify properties or metadata on a relationship       |
| `DeleteRelationship`      | Remove a connection between entities                  |
| `ListEntityRelationships` | Retrieve all relationships for a given entity         |
| `GetRelationshipsBetween` | Find all connections between two specific entities    |

### Tags

| Use Case            | Description                                         |
| ------------------- | --------------------------------------------------- |
| `CreateTag`         | Create a new taxonomy label for organizing entities |
| `UpdateTag`         | Modify a tag's name or color                        |
| `DeleteTag`         | Remove a tag (detaches from all entities)           |
| `TagEntity`         | Apply a tag to an entity                            |
| `UntagEntity`       | Remove a tag from an entity                         |
| `ListTags`          | Retrieve all tags for a world                       |
| `ListEntitiesByTag` | Retrieve all entities with a specific tag           |

---

## IV. Intelligence Context

**Aggregate Roots:** `WorldQuery`, `QueryContext`

The intelligence layer provides AI-powered features for exploring, understanding, and generating content within a world.

### Querying & RAG

| Use Case             | Description                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| `AskQuestion`        | Submit a natural language question about the world (orchestrates RAG pipeline) |
| `ContinueQuery`      | Follow up on a previous query with additional context                          |
| `ExpandQueryContext` | Add more entities or content to the current query context                      |
| `GetQueryHistory`    | Retrieve past queries for a world                                              |

### Semantic Search

| Use Case              | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `SearchEntities`      | Find entities by semantic meaning (vector similarity)    |
| `SearchByContent`     | Full-text search across entity bodies                    |
| `FindSimilarEntities` | Retrieve entities semantically similar to a given entity |

### Content Generation

| Use Case                 | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| `DraftEntityContent`     | Generate suggested content for an entity based on context |
| `SuggestRelationships`   | Propose potential connections based on entity content     |
| `DetectUnlinkedMentions` | Scan text for entity names that could be linked           |
| `SummarizeEntity`        | Generate a concise summary of an entity's content         |

### Indexing (Background)

| Use Case         | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `IndexEntity`    | Generate embeddings and update search indexes for an entity |
| `ReindexWorld`   | Rebuild all search indexes for a world                      |
| `GetIndexStatus` | Check the indexing status of a world                        |

---

## V. Visualization & Analytics Context

**Read-Only Projections**

These use cases provide insights and visualizations over the knowledge graph without modifying data.

### Graph Visualization

| Use Case               | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `GetGraphNeighborhood` | Retrieve nodes and edges around a focal entity for graph rendering |
| `GetFullGraph`         | Retrieve the complete graph structure (for small worlds)           |
| `FindShortestPath`     | Calculate the relationship path between two entities               |
| `GetGraphClusters`     | Identify densely connected groups of entities                      |

### Analytics

| Use Case                    | Description                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| `GetWorldStatistics`        | Aggregate metrics (entity count, word count, relationship density) |
| `GetEntityTypeDistribution` | Breakdown of entities by definition type                           |
| `GetMostConnectedEntities`  | Ranked list of entities by relationship count                      |
| `GetRecentActivity`         | Timeline of recent edits and additions                             |
| `GetOrphanedEntities`       | Find entities with no relationships                                |

---

## VI. User & Access Context

**Aggregate Root:** `User`

User management and access control (future consideration for multi-user scenarios).

| Use Case            | Description                                       |
| ------------------- | ------------------------------------------------- |
| `RegisterUser`      | Create a new user account                         |
| `AuthenticateUser`  | Verify credentials and issue session              |
| `UpdateUserProfile` | Modify user settings and preferences              |
| `ShareWorld`        | Grant another user access to a world (future)     |
| `RevokeWorldAccess` | Remove a user's access to a shared world (future) |

---

## Cross-Cutting Concerns

These patterns apply across multiple contexts:

- **Validation**: All mutations validate input against Zod schemas
- **Authorization**: Operations verify user ownership/access before execution
- **Auditing**: Significant changes are logged for history/undo capability
- **Events**: Domain events enable reactive updates (e.g., reindex on entity change)
