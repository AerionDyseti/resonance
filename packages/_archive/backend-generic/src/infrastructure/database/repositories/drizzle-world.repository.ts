import { eq, ilike, sql } from 'drizzle-orm';
import type { Database } from '../connection';
import { worlds, type WorldRow } from '../schema';
import { World } from '../../../domain/world/world';
import type { IWorldRepository } from '../../../domain/world/world.repository';
import { worldId, userId, type WorldId } from '../../../domain/shared/ids';

/**
 * Drizzle ORM implementation of IWorldRepository
 */
export class DrizzleWorldRepository implements IWorldRepository {
  constructor(private readonly db: Database) {}

  async findById(id: WorldId): Promise<World | null> {
    const rows = await this.db.select().from(worlds).where(eq(worlds.id, id)).limit(1);

    if (rows.length === 0) {
      return null;
    }

    return this.toDomain(rows[0]);
  }

  async findAll(params?: { limit?: number; offset?: number }): Promise<World[]> {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.db.select().from(worlds).limit(limit).offset(offset);

    return rows.map((row) => this.toDomain(row));
  }

  async count(): Promise<number> {
    const result = await this.db.select({ count: sql<number>`count(*)` }).from(worlds);
    return Number(result[0]?.count ?? 0);
  }

  async existsByName(name: string, excludeId?: WorldId): Promise<boolean> {
    let query = this.db
      .select({ id: worlds.id })
      .from(worlds)
      .where(eq(worlds.name, name))
      .limit(1);

    if (excludeId) {
      query = this.db
        .select({ id: worlds.id })
        .from(worlds)
        .where(sql`${worlds.name} = ${name} AND ${worlds.id} != ${excludeId}`)
        .limit(1);
    }

    const rows = await query;
    return rows.length > 0;
  }

  async save(world: World): Promise<void> {
    const row = this.toRow(world);

    await this.db
      .insert(worlds)
      .values(row)
      .onConflictDoUpdate({
        target: worlds.id,
        set: {
          name: row.name,
          description: row.description,
          updatedAt: row.updatedAt,
        },
      });
  }

  async delete(id: WorldId): Promise<boolean> {
    const result = await this.db
      .delete(worlds)
      .where(eq(worlds.id, id))
      .returning({ id: worlds.id });
    return result.length > 0;
  }

  async searchByName(
    searchTerm: string,
    params?: { limit?: number; offset?: number }
  ): Promise<World[]> {
    const limit = params?.limit ?? 20;
    const offset = params?.offset ?? 0;

    const rows = await this.db
      .select()
      .from(worlds)
      .where(ilike(worlds.name, `%${searchTerm}%`))
      .limit(limit)
      .offset(offset);

    return rows.map((row) => this.toDomain(row));
  }

  /**
   * Convert a database row to a domain entity
   */
  private toDomain(row: WorldRow): World {
    return World.existing({
      id: worldId(row.id),
      ownerId: userId(row.ownerId),
      name: row.name,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  /**
   * Convert a domain entity to a database row
   */
  private toRow(world: World): typeof worlds.$inferInsert {
    return {
      id: world.id,
      ownerId: world.ownerId,
      name: world.name,
      description: world.description,
      createdAt: world.createdAt,
      updatedAt: world.updatedAt,
    };
  }
}
