import type { EmbeddingChunkId, EntityId, WorldId } from './ids';

/**
 * EmbeddingChunk - A segment of entity content with its vector embedding
 * Hierarchical structure allows returning "the part about X" within an entity
 */
export interface EmbeddingChunk {
  readonly id: EmbeddingChunkId;
  readonly worldId: WorldId;
  readonly entityId: EntityId;
  /** The text content of this chunk */
  readonly content: string;
  /** Vector embedding for semantic search */
  readonly embedding: number[];
  /** Position/order within the entity (0-indexed) */
  readonly chunkIndex: number;
  /** Optional section/heading this chunk belongs to */
  readonly section: string | null;
  /** Character offset in the original body where this chunk starts */
  readonly startOffset: number;
  /** Character offset in the original body where this chunk ends */
  readonly endOffset: number;
  readonly createdAt: Date;
}

export interface EmbeddingChunkPersistenceRecord {
  id: string;
  worldId: string;
  entityId: string;
  content: string;
  embedding: number[];
  chunkIndex: number;
  section: string | null;
  startOffset: number;
  endOffset: number;
  createdAt: Date;
}
