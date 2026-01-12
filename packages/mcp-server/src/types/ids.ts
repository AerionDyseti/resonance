/**
 * Branded ID Types with Companion Objects
 *
 * Each ID type is both a type AND a callable constructor:
 *   - CharacterId('key')      → deterministic hash from key
 *   - CharacterId.random()    → random UUID
 *   - CharacterId.from(str)   → cast existing string to branded type
 */

import { createHash } from 'crypto';

/** Brand symbol for nominal typing */
declare const __brand: unique symbol;

/** Branded type helper */
type Brand<T, TBrand extends string> = T & { [__brand]: TBrand };

// =============================================================================
// Deterministic UUID Generation (UUID v5-like)
// =============================================================================

/** Namespace UUIDs for each entity type (deterministic seeds) */
const NAMESPACES = {
  character: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  location: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  organization: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  event: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
  story: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
  item: '6ba7b815-9dad-11d1-80b4-00c04fd430c8',
  lore: '6ba7b816-9dad-11d1-80b4-00c04fd430c8',
  session: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
  ancestry: '6ba7b818-9dad-11d1-80b4-00c04fd430c8',
  culture: '6ba7b819-9dad-11d1-80b4-00c04fd430c8',
  scene: '6ba7b81a-9dad-11d1-80b4-00c04fd430c8',
  connection: '6ba7b81b-9dad-11d1-80b4-00c04fd430c8',
  connectionType: '6ba7b81c-9dad-11d1-80b4-00c04fd430c8',
  campaign: '6ba7b81d-9dad-11d1-80b4-00c04fd430c8',
} as const;

/**
 * Generate a deterministic UUID from a namespace and name.
 * Same inputs always produce the same output (UUID v5-like).
 */
function hashUuid(namespace: string, name: string): string {
  const hash = createHash('sha1').update(namespace).update(name).digest('hex');

  // Format as UUID: 8-4-4-4-12 with version 5 and variant bits
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    '5' + hash.slice(13, 16),
    ((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') +
      hash.slice(18, 20),
    hash.slice(20, 32),
  ].join('-');
}

// =============================================================================
// ID Constructor Interface
// =============================================================================

/** Constructor interface for branded ID types */
interface IdConstructor<T> {
  /** Create deterministic ID from key (same key → same ID) */
  (key: string): T;
  /** Create random UUID */
  random(): T;
  /** Cast existing string to branded type */
  from(id: string): T;
}

/** Factory to create ID companion objects */
function createIdType<T>(namespace: string): IdConstructor<T> {
  const constructor = (key: string) => hashUuid(namespace, key) as T;

  return Object.assign(constructor, {
    random: () => crypto.randomUUID() as T,
    from: (id: string) => id as T,
  });
}

// =============================================================================
// Entity ID Types + Companion Objects
// =============================================================================

export type CharacterId = Brand<string, 'CharacterId'>;
export const CharacterId = createIdType<CharacterId>(NAMESPACES.character);

export type LocationId = Brand<string, 'LocationId'>;
export const LocationId = createIdType<LocationId>(NAMESPACES.location);

export type OrganizationId = Brand<string, 'OrganizationId'>;
export const OrganizationId = createIdType<OrganizationId>(NAMESPACES.organization);

export type EventId = Brand<string, 'EventId'>;
export const EventId = createIdType<EventId>(NAMESPACES.event);

export type StoryId = Brand<string, 'StoryId'>;
export const StoryId = createIdType<StoryId>(NAMESPACES.story);

export type ItemId = Brand<string, 'ItemId'>;
export const ItemId = createIdType<ItemId>(NAMESPACES.item);

export type LoreId = Brand<string, 'LoreId'>;
export const LoreId = createIdType<LoreId>(NAMESPACES.lore);

export type SessionId = Brand<string, 'SessionId'>;
export const SessionId = createIdType<SessionId>(NAMESPACES.session);

export type AncestryId = Brand<string, 'AncestryId'>;
export const AncestryId = createIdType<AncestryId>(NAMESPACES.ancestry);

export type CultureId = Brand<string, 'CultureId'>;
export const CultureId = createIdType<CultureId>(NAMESPACES.culture);

export type SceneId = Brand<string, 'SceneId'>;
export const SceneId = createIdType<SceneId>(NAMESPACES.scene);

// =============================================================================
// Other ID Types
// =============================================================================

export type ConnectionId = Brand<string, 'ConnectionId'>;
export const ConnectionId = createIdType<ConnectionId>(NAMESPACES.connection);

export type ConnectionTypeId = Brand<string, 'ConnectionTypeId'>;
export const ConnectionTypeId = createIdType<ConnectionTypeId>(NAMESPACES.connectionType);

export type CharacterCategoryId = Brand<string, 'CharacterCategoryId'>;
export const CharacterCategoryId = createIdType<CharacterCategoryId>(
  '6ba7b81e-9dad-11d1-80b4-00c04fd430c8'
);

export type OrganizationCategoryId = Brand<string, 'OrganizationCategoryId'>;
export const OrganizationCategoryId = createIdType<OrganizationCategoryId>(
  '6ba7b81f-9dad-11d1-80b4-00c04fd430c8'
);

export type MiscId = Brand<string, 'MiscId'>;
export const MiscId = createIdType<MiscId>('6ba7b820-9dad-11d1-80b4-00c04fd430c8');

export type ChronicleId = Brand<string, 'ChronicleId'>;
export const ChronicleId = createIdType<ChronicleId>(NAMESPACES.campaign); // Reusing namespace

// =============================================================================
// Union Types
// =============================================================================

/** Union of all entity ID types */
export type EntityId =
  | CharacterId
  | LocationId
  | OrganizationId
  | EventId
  | StoryId
  | ItemId
  | LoreId
  | SessionId
  | AncestryId
  | CultureId
  | SceneId
  | MiscId
  | ChronicleId;

// =============================================================================
// Validation
// =============================================================================

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_REGEX.test(value);
}
