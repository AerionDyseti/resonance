# Resonance Domain Layer

The Resonance domain layer represents the core business logic and entities of the world-building system. It follows **Domain-Driven Design (DDD)** principles with a hexagonal (ports & adapters) architecture, keeping domain logic completely isolated from infrastructure concerns.

## Architecture Overview

The domain is organized into three primary areas:

1. **Metadata Domain** (`meta/`): Defines the schema and structure for worlds
2. **World Domain** (`world/`): Contains runtime instances and data
3. **Intelligence Domain** (`intelligence/`): AI-powered querying capabilities

## Core Concepts

### Bounded Context: The World

A **World** is the top-level aggregate root representing a single worldbuilding project (e.g., a D&D campaign, novel setting, or game world). Each world:

- Belongs to exactly one **owner** (User)
- Defines its own custom schema through **EntityDefinitions**
- Contains concrete instances of those schemas as **Entities**
- Maintains relationships between entities through **Relationships**
- Stores freeform **markdown content** alongside structured **properties**

```typescript
// A world might be: "The Forgotten Realms Campaign"
const world = World.create({
  ownerId: userId('user-123'),
  name: 'The Forgotten Realms Campaign',
  description: 'Our D&D campaign set in the Forgotten Realms',
});
```

### Schema Definition Layer (Metadata)

Before creating content in a world, you define what **types** of things can exist. This schema is stored in metadata domain entities.

#### EntityDefinition

Defines a category of entities that can exist in a world (e.g., "Character", "Location", "Faction").

```typescript
const characterDef = EntityDefinition.create({
  worldId: world.id,
  name: 'Character',
  description: 'A player character or NPC',
  propertyDefinitionIds: [nameProp.id, ageProp.id, classProp.id],
  icon: '🧙',
});
```

**Key features:**

- Each world can define unlimited entity types
- Direct assignment of property definitions (no template indirection)
- Icon support for UI presentation
- Immutable identity (id cannot change)

#### PropertyDefinition

Defines a reusable field that can appear on entities or relationships.

```typescript
const ageProp = PropertyDefinition.create({
  worldId: world.id,
  name: 'Age',
  type: PropertyType.Number,
  description: 'Character age in years',
  required: false,
  defaultValue: null,
  constraints: {
    minValue: 0,
    maxValue: 150,
  },
});
```

**Supported property types:**

- `Text`: Single-line strings (with maxLength constraint)
- `LongText`: Multi-line markdown content
- `Number`: Numeric values (with min/max constraints)
- `Boolean`: True/false flags
- `Date`: ISO 8601 dates
- `Select`: Single choice from options
- `MultiSelect`: Multiple choices from options
- `Reference`: Link to another entity (with target EntityDefinition constraint)
- `CreatedTime`: Immutable creation timestamp (system-managed)
- `UpdatedTime`: Last modification timestamp (system-managed)

**Constraints** are type-specific validation rules:

- Numbers: `minValue`, `maxValue`
- Text: `minLength`, `maxLength`, `pattern` (regex)
- Select/MultiSelect: `options` array
- Reference: `referencedEntityDefinitionId`

#### RelationshipDefinition

Defines a type of connection between entities.

```typescript
const memberOfDef = RelationshipDefinition.create({
  worldId: world.id,
  name: 'member of',
  inverseName: 'has members',
  description: 'A character is a member of a faction',
  isSymmetric: false,
  sourceEntityDefinitionId: characterDef.id,
  targetEntityDefinitionId: factionDef.id,
  propertyDefinitionIds: [roleInFactionProp.id, joinDateProp.id],
});
```

**Key features:**

- **Direction**: Relationships are directed (source → target)
- **Inverse names**: Specify how to refer to the relationship in both directions
- **Symmetric**: Set to true if the relationship goes both ways automatically
- **Properties on edges**: Relationships can have their own properties (e.g., "joined date" on a membership)
- **Optional constraints**: Can restrict source/target to specific entity types, or allow any

### Runtime Instance Layer (World Entities)

Once the schema is defined, you create actual content instances.

#### Entity

An instance of an EntityDefinition representing a concrete thing in the world.

```typescript
// An actual character instance following the "Character" schema
const aragorn = Entity.create({
  worldId: world.id,
  definitionId: characterDef.id,
  name: 'Aragorn',
  slug: 'aragorn', // URL-friendly identifier
  aliases: ['Strider', 'King of Gondor'],
  summary: 'Ranger and rightful king',
  body: '# Aragorn\n\nA skilled ranger from the North...', // Markdown content
  imageUrl: 'https://example.com/aragorn.jpg',
  tagIds: [heroTagId, leaderTagId],
});
```

**Structure:**

- **Properties**: Instance values for each PropertyDefinition from the schema
- **Body**: Freeform markdown content for narrative or notes
- **Summary**: Short description for UI display
- **Tags**: Categorical labels for filtering and organization
- **Slug**: Unique, human-readable identifier (like URLs)
- **Aliases**: Alternative names for the entity

#### Property

An instance of a PropertyDefinition with a specific value.

```typescript
// Properties are owned by entities and relationships
const ageProperty = Property.create({
  definitionId: ageProp.id,
  value: 87,
});

const classProperty = Property.create({
  definitionId: classProp.id,
  value: 'Ranger',
});

// Create entity with properties
const aragorn = Entity.create({
  // ...
  properties: [ageProperty, classProperty],
});
```

**Value types:**

- Scalars: `string`, `number`, `boolean`, `null`
- Arrays: `string[]` (for MultiSelect)
- Timestamps: `Date` objects (for date properties)

#### Relationship

An instance of a RelationshipDefinition connecting two entities.

```typescript
// "Aragorn is a member of the Fellowship"
const fellowship = Relationship.create({
  worldId: world.id,
  definitionId: memberOfDef.id,
  sourceEntityId: aragorn.id,
  targetEntityId: fellowship.id,
  properties: [
    Property.create({
      definitionId: roleInFactionProp.id,
      value: 'Leader',
    }),
    Property.create({
      definitionId: joinDateProp.id,
      value: 'Year 3018',
    }),
  ],
});
```

## Aggregate Design

The domain uses two main aggregates:

### World Aggregate

**Root**: `World`
**Members**: All entities and their properties within the world

Invariants:

- Owner must exist
- Name must be non-empty and ≤ 255 characters
- Description is optional but trimmed
- Timestamps are immutable after creation
- Owner cannot be changed

### Entity Aggregate

**Root**: `Entity`
**Members**: Properties, tags

Invariants:

- Name must be non-empty
- Slug must be non-empty and unique within the world
- Slug must follow URL conventions (lowercase, hyphens, no spaces)
- Aliases are normalized
- Body is markdown
- Only one DefinitionId (an entity has exactly one type)

## Domain Entity Pattern

All domain entities follow a consistent pattern:

```typescript
// 1. Public interface for data contracts
export interface IWorld {
  readonly id: WorldId;
  readonly ownerId: UserId;
  readonly name: string;
  readonly description: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// 2. Domain class with private state and public getters
export class World implements IWorld {
  private constructor(
    public readonly id: WorldId,
    public readonly ownerId: UserId,
    private _name: string,
    private _description: string | null,
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  // 3. Factory method for creating new instances
  static create(params: { ownerId: UserId; name: string; description?: string }): World {
    const now = new Date();
    return new World(
      createWorldId(),
      params.ownerId,
      World.validateName(params.name),
      params.description?.trim() || null,
      now,
      now
    );
  }

  // 4. Factory method for reconstituting from storage
  static existing(data: IWorld): World {
    return new World(
      data.id,
      data.ownerId,
      World.validateName(data.name),
      data.description?.trim() ?? null,
      data.createdAt,
      data.updatedAt
    );
  }

  // 5. Public interface (getters only)
  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // 6. Business methods
  updateName(name: string): void {
    World.validateName(name);
    this._name = name;
    this._updatedAt = new Date();
  }
}
```

**Key principles:**

- **No public setters**: State is immutable except through specific business methods
- **Private constructor**: Prevents invalid instances
- **Factory methods**: `create()` for new, `existing()` for stored data
- **Validation on construction**: Invariants enforced at creation time
- **Immutable IDs**: Identifiers never change
- **Immutable timestamps**: `createdAt` is always the creation time

## Type-Safe IDs

The domain uses branded types for IDs to prevent mixing up different entity types at compile time:

```typescript
// Brand types prevent accidental type confusion
type WorldId = string & { readonly __brand: 'WorldId' };
type EntityId = string & { readonly __brand: 'EntityId' };
type UserId = string & { readonly __brand: 'UserId' };

// Create IDs with type safety
const wId: WorldId = worldId('12345');
const eId: EntityId = entityId('67890');

// Compile-time error: cannot assign EntityId to WorldId
const x: WorldId = eId; // ❌ TypeScript error
```

**Benefits:**

- Prevents accidental ID type confusion
- Better IDE autocomplete and refactoring
- Self-documenting code
- Zero runtime overhead

## Ports (Dependency Inversion)

The domain defines ports (interfaces) that infrastructure must implement. This keeps the domain independent.

### IWorldRepository

The domain requires a repository to persist and retrieve worlds, but doesn't care how it's implemented.

```typescript
export interface IWorldRepository {
  findById(id: WorldId): Promise<World | null>;
  findAll(params?: { limit?: number; offset?: number }): Promise<World[]>;
  count(): Promise<number>;
  existsByName(name: string, excludeId?: WorldId): Promise<boolean>;
  save(world: World): Promise<void>;
  delete(id: WorldId): Promise<boolean>;
  searchByName(searchTerm: string, params?: { limit?: number; offset?: number }): Promise<World[]>;
}
```

**Implementations** can be:

- PostgreSQL (via Drizzle ORM) - current
- In-memory (for testing)
- MongoDB, DynamoDB, or any other backend

### ISemanticSearchProvider

Enables AI-powered search over entity content.

```typescript
export interface ISemanticSearchProvider {
  indexEntity(entity: Entity): Promise<void>;
  searchByQuery(worldId: WorldId, query: string, limit?: number): Promise<SearchResult[]>;
  deleteEntityIndex(entityId: EntityId): Promise<void>;
}
```

### IWorldIntelligenceProvider

Orchestrates AI queries against a world's knowledge base.

```typescript
export interface IWorldIntelligenceProvider {
  executeQuery(
    worldId: WorldId,
    userId: UserId,
    queryText: string,
    options?: QueryExecutionOptions
  ): Promise<QueryExecutionResult>;

  buildInitialContext(
    worldId: WorldId,
    queryText: string,
    config: QueryConfig
  ): Promise<QueryContext>;

  queryLlm(
    query: WorldQuery,
    context: QueryContext,
    capabilities: InfoCapability[],
    forceAnswer?: boolean
  ): Promise<QueryResponse>;
}
```

## How to Use: Common Workflows

### 1. Creating a New World with Custom Schema

```typescript
// 1. Create the world
const world = World.create({
  ownerId: userId('user-123'),
  name: 'My Fantasy World',
  description: 'An epic fantasy campaign',
});

// 2. Define property types
const nameProp = PropertyDefinition.create({
  worldId: world.id,
  name: 'Name',
  type: PropertyType.Text,
  required: true,
  constraints: { maxLength: 100 },
});

const roleProperty = PropertyDefinition.create({
  worldId: world.id,
  name: 'Role',
  type: PropertyType.Select,
  constraints: {
    options: ['Hero', 'Villain', 'NPC', 'Beast'],
  },
});

// 3. Define entity types directly with properties
const characterDef = EntityDefinition.create({
  worldId: world.id,
  name: 'Character',
  propertyDefinitionIds: [nameProp.id, roleProperty.id],
  icon: '🧙',
});

// 4. Persist all (in application layer)
await worldRepository.save(world);
// ... save definitions (repositories not shown in domain)
```

### 2. Creating Entities and Relationships

```typescript
// Create an entity instance
const gandalf = Entity.create({
  worldId: world.id,
  definitionId: characterDef.id,
  name: 'Gandalf',
  slug: 'gandalf',
  aliases: ['The Grey', 'Mithrandir'],
  summary: 'A powerful wizard',
  body: '# Gandalf\n\nWisdom and power incarnate...',
  properties: [
    Property.create({
      definitionId: nameProp.id,
      value: 'Gandalf',
    }),
    Property.create({
      definitionId: roleProperty.id,
      value: 'Hero',
    }),
  ],
});

// Define a relationship type
const knowsDef = RelationshipDefinition.create({
  worldId: world.id,
  name: 'knows',
  inverseName: 'is known by',
  isSymmetric: false,
});

// Create a relationship instance
const knows = Relationship.create({
  worldId: world.id,
  definitionId: knowsDef.id,
  sourceEntityId: gandalf.id,
  targetEntityId: frodo.id,
});
```

### 3. Querying with AI

```typescript
// Execute a natural language query
const result = await intelligenceProvider.executeQuery(
  world.id,
  userId('user-123'),
  'Who are the main heroes in this world and what are their quests?'
);

// Result contains:
// - query: The executed WorldQuery
// - answer: The LLM's response
// - context: The entities and relationships used
// - iterations: How many "needs more info" loops were needed
// - executionTimeMs: Total time taken
```

## Validation & Error Handling

Domain layer validation occurs at multiple points:

1. **Construction time**: Name/slug validation in entity constructors
2. **Business method time**: Rules enforcement in update methods
3. **Constraint time**: Property constraints checked at application layer before domain persistence

Exceptions thrown in domain layer indicate **invariant violations** (should never happen if application layer is correct):

```typescript
// These throw if violated:
World.create({ name: '' }); // Throws: name cannot be empty
Entity.create({ slug: 'not-url-safe!' }); // Throws: invalid slug
EntityDefinition.create({ name: '   ' }); // Throws: name cannot be empty
```

Application layer handles the results and translates to user-facing errors.

## Design Principles

### 1. Ubiquitous Language

Terms used in code match the domain language:

- "World" not "Project" or "Campaign"
- "Entity" not "Record" or "Document"
- "Properties" not "Fields" or "Attributes"

### 2. Aggregates Are Boundaries

- **World Aggregate**: All data belongs to exactly one world
- **Entity Aggregate**: Contains its properties
- **Relationship Aggregate**: Connects entities with properties on the edge

Changes respect aggregate boundaries - you never modify an entity from outside its aggregate.

### 3. Value Objects vs Entities

- **Value Objects**: Property, Tag (identified by value, not ID)
- **Entities**: World, Entity, Relationship (identified by ID, have lifecycle)

### 4. Immutability Where Possible

- IDs are immutable
- Creation timestamps are immutable
- Properties are only changed through explicit business methods
- Returned collections are `readonly`

### 5. Infrastructure Independence

- Domain doesn't import from infrastructure or application layers
- All I/O happens through ports (interfaces)
- Domain is 100% testable without databases or network calls

## Schema Composition Without Templates

The removed Template system simplified the schema design. Properties are now assigned directly to EntityDefinitions:

**Before (with Templates):**

```typescript
const heroTemplate = Template.create({ propertyDefinitionIds: [...] });
const characterDef = EntityDefinition.create({ templateIds: [heroTemplate.id] });
```

**After (direct assignment):**

```typescript
const characterDef = EntityDefinition.create({
  propertyDefinitionIds: [prop1.id, prop2.id, prop3.id],
});
```

**Benefits:**

- Simpler data model
- Fewer indirections
- Easier to understand schema at a glance
- Reduced database complexity

If property groups need to be shared across multiple entity definitions, that pattern can still be implemented at the **application layer** (use cases composing multiple properties together), rather than in the domain.

## Extending the Domain

To add new functionality:

1. **New domain entity type**: Create class with `create()` and `existing()` factories
2. **New property type**: Add to `PropertyType` enum
3. **New validation rule**: Add validation method and call in constructor
4. **New port**: Define interface in domain, implement in infrastructure

The domain layer is designed to be extended without modifying the core structure.
