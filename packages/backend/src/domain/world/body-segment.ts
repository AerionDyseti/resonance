import type { BodySegmentId, EntityId, WorldId } from '../shared/ids';

/**
 * EmbeddingChunk - A segment of entity content with its vector embedding
 * Hierarchical structure allows returning "the part about X" within an entity
 */
export interface BodySegment {
  readonly id: BodySegmentId;
  readonly worldId: WorldId;
  readonly entityId: EntityId;
  readonly createdAt: Date;
  /** The text content of this chunk */
  readonly content: string;
  /** Position/order within the entity (0-indexed) */
  readonly chunkIndex: number;
  /** Optional title/heading of a section this chunk belongs to */
  readonly section: string | null;
  /** Character offset in the original body where this chunk starts */
  readonly startOffset: number;
  /** Character offset in the original body where this chunk ends */
  readonly endOffset: number;
}
