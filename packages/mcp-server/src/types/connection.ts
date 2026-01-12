/**
 * Connection Model for AIRP
 *
 * Represents a directed connection between two entities. All connections are
 * directional; reciprocal relationships use two connections in opposite directions.
 *
 * A single Connection captures the full relationship from source → target,
 * with multiple facets describing different aspects of that relationship.
 */

import {
  ConnectionId,
  type ConnectionTypeId,
  type EntityId,
  type SessionId,
  type EventId,
} from './ids.js';

/**
 * A single facet of a connection - one way the entities are related
 *
 * The key in the facets record is the ConnectionTypeId.
 */
export interface ConnectionFacet {
  description?: string; // Context for this specific facet
  degree?: number; // Intensity: -5 (negative) to +5 (strong)
  establishedAt?: SessionId | EventId; // When this facet was formed
  lastUpdated?: SessionId | EventId; // Most recent change to this facet
}

/**
 * Connection between two entities
 *
 * One record per ordered entity pair (source → target).
 * The `description` field is the semantic summary for embedding/search.
 * The `facets` record contains all the typed aspects of the relationship.
 */
export interface Connection {
  id: ConnectionId;
  sourceId: EntityId;
  targetId: EntityId;

  // Overall summary of the connection (used for semantic embedding)
  description: string;

  // All facets of this connection, keyed by ConnectionTypeId
  // e.g., { [ConnectionTypeId('trusts')]: { degree: 5 }, [ConnectionTypeId('serves')]: { degree: 2 } }
  facets: Record<ConnectionTypeId, ConnectionFacet>;

  createdAt: string;
  updatedAt: string;
}

/** Create a new connection with generated ID and timestamps */
export function createConnection(
  sourceId: EntityId,
  targetId: EntityId,
  description: string,
  facets: Record<ConnectionTypeId, ConnectionFacet> = {}
): Connection {
  const now = new Date().toISOString();
  return {
    id: ConnectionId.random(),
    sourceId,
    targetId,
    description,
    facets,
    createdAt: now,
    updatedAt: now,
  };
}

/** Update a connection's timestamp */
export function touchConnection(connection: Connection): Connection {
  return {
    ...connection,
    updatedAt: new Date().toISOString(),
  };
}

/** Check if a connection has a specific facet type */
export function hasFacet(connection: Connection, typeId: ConnectionTypeId): boolean {
  return typeId in connection.facets;
}

/** Get a specific facet from a connection (O(1) lookup) */
export function getFacet(
  connection: Connection,
  typeId: ConnectionTypeId
): ConnectionFacet | undefined {
  return connection.facets[typeId];
}

/** Add or update a facet on a connection */
export function setFacet(
  connection: Connection,
  typeId: ConnectionTypeId,
  facet: ConnectionFacet
): Connection {
  return {
    ...connection,
    facets: {
      ...connection.facets,
      [typeId]: facet,
    },
    updatedAt: new Date().toISOString(),
  };
}

/** Remove a facet from a connection */
export function removeFacet(connection: Connection, typeId: ConnectionTypeId): Connection {
  const { [typeId]: _, ...remainingFacets } = connection.facets;
  return {
    ...connection,
    facets: remainingFacets,
    updatedAt: new Date().toISOString(),
  };
}

/** Get all facet type IDs on a connection */
export function getFacetTypes(connection: Connection): ConnectionTypeId[] {
  return Object.keys(connection.facets) as ConnectionTypeId[];
}
