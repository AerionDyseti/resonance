import { eq, ilike, count, and, ne } from 'drizzle-orm';
import type { WorldId } from '@resonance/shared';
import type { IWorldRepository } from '@resonance/core';
import { World } from '@resonance/core';
import type { Database } from '../client';
import { worlds } from '../schema';

/**
 * Drizzle World Repository Implementation (Adapter)
 *
 * Implements the IWorldRepository interface using Drizzle ORM and PostgreSQL.
 * This is an infrastructure concern - the domain layer doesn't know about Drizzle.
 */
export class DrizzleWorldRepository implements IWorldRepository {
  constructor(private readonly db: Database) {}

  async findById(id: WorldId): Promise<World | null> {
    const result = await this.db.query.worlds.findFirst({
      where: eq(worlds.id, id),
    });

    return result ? World.fromPersistence(result) : null;
  }

  async findAll(params?: { limit?: number; offset?: number }): Promise<World[]> {
    const query = this.db.query.worlds.findMany({
      limit: params?.limit,
      offset: params?.offset,
      orderBy: (worlds, { desc }) => [desc(worlds.createdAt)],
    });

    const results = await query;
    return results.map((record) => World.fromPersistence(record));
  }

  async count(): Promise<number> {
    const result = await this.db.select({ count: count() }).from(worlds).execute();

    return result[0]?.count ?? 0;
  }

  async existsByName(name: string, excludeId?: WorldId): Promise<boolean> {
    const conditions = [eq(worlds.name, name)];

    if (excludeId) {
      conditions.push(ne(worlds.id, excludeId));
    }

    const result = await this.db.query.worlds.findFirst({
      where: and(...conditions),
      columns: { id: true },
    });

    return result !== undefined;
  }

  async save(world: World): Promise<void> {
    const record = world.toPersistence();

    await this.db
      .insert(worlds)
      .values(record)
      .onConflictDoUpdate({
        target: worlds.id,
        set: {
          name: record.name,
          description: record.description,
          updatedAt: record.updatedAt,
        },
      })
      .execute();
  }

  async delete(id: WorldId): Promise<boolean> {
    const result = await this.db.delete(worlds).where(eq(worlds.id, id)).execute();

    return result.rowCount !== null && result.rowCount > 0;
  }

  async searchByName(
    searchTerm: string,
    params?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<World[]> {
    const results = await this.db.query.worlds.findMany({
      where: ilike(worlds.name, `%${searchTerm}%`),
      limit: params?.limit,
      offset: params?.offset,
      orderBy: (worlds, { desc }) => [desc(worlds.createdAt)],
    });

    return results.map((record) => World.fromPersistence(record));
  }
}
