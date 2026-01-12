// World domain - content instances and value objects

// Interfaces
export type { IWorld } from './world';
export type { IEntity } from './entity';
export type { IProperty, PropertyValue } from './property';
export type { IRelationship } from './relationship';

// Projections
export type { EntitySummary } from './entity-summary';
export type { RelationshipSummary } from './relationship-summary';

// Classes
export { World } from './world';
export { Entity } from './entity';
export { Property } from './property';
export { Relationship } from './relationship';

// Value Objects
export type { EntityReference } from './entity-reference';
export type { PropertyUsage } from './property-usage';
export type { BodySegment as EmbeddingChunk } from './body-segment';

// Ports
export type { IWorldRepository } from './world.repository';
