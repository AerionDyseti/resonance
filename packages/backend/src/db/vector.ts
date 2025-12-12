import { sql, type SQL } from 'drizzle-orm';
import type { AnyColumn, SQLWrapper } from 'drizzle-orm';

/**
 * Drizzle ORM has native pgvector support!
 * Use the `vector` type from 'drizzle-orm/pg-core' in schema definitions.
 *
 * This file provides helper functions for vector similarity searches.
 */

/**
 * Calculate L2 (Euclidean) distance between vectors
 * Lower values indicate higher similarity
 *
 * @example
 * ```ts
 * db.select()
 *   .from(entities)
 *   .orderBy(l2Distance(entities.embedding, queryVector))
 *   .limit(10);
 * ```
 */
export function l2Distance(column: SQLWrapper | AnyColumn, value: number[] | string): SQL {
  const vector = typeof value === 'string' ? value : JSON.stringify(value);
  return sql`${column} <-> ${vector}::vector`;
}

/**
 * Calculate cosine distance between vectors
 * Lower values indicate higher similarity (0 = identical, 2 = opposite)
 *
 * @example
 * ```ts
 * db.select()
 *   .from(entities)
 *   .orderBy(cosineDistance(entities.embedding, queryVector))
 *   .limit(10);
 * ```
 */
export function cosineDistance(column: SQLWrapper | AnyColumn, value: number[] | string): SQL {
  const vector = typeof value === 'string' ? value : JSON.stringify(value);
  return sql`${column} <=> ${vector}::vector`;
}

/**
 * Calculate inner product distance between vectors
 * Lower values indicate higher similarity
 *
 * @example
 * ```ts
 * db.select()
 *   .from(entities)
 *   .orderBy(innerProduct(entities.embedding, queryVector))
 *   .limit(10);
 * ```
 */
export function innerProduct(column: SQLWrapper | AnyColumn, value: number[] | string): SQL {
  const vector = typeof value === 'string' ? value : JSON.stringify(value);
  return sql`${column} <#> ${vector}::vector`;
}

/**
 * Type guard to validate vector dimensions
 */
export function isValidVector(value: unknown, dimensions: number): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === dimensions &&
    value.every((v) => typeof v === 'number' && !isNaN(v) && isFinite(v))
  );
}

/**
 * Normalize a vector to unit length (useful for cosine similarity)
 */
export function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude === 0 ? vector : vector.map((v) => v / magnitude);
}

/**
 * Format vector for SQL insertion
 */
export function formatVector(vector: number[]): string {
  return `[${vector.join(',')}]`;
}
