import { trpc } from '../../lib/trpc';
import type { WorldId } from '@resonance/shared';

export async function listWorlds(params: { limit: number; offset: number }) {
  return await trpc.world.list.query(params);
}

export async function createWorldApi(data: { name: string; description?: string }) {
  return await trpc.world.create.mutate(data);
}

export async function updateWorldApi(data: {
  id: WorldId;
  name?: string;
  description?: string | null;
}) {
  return await trpc.world.update.mutate(data);
}

export async function deleteWorldApi(id: WorldId) {
  return await trpc.world.delete.mutate({ id });
}

export async function searchWorldsApi(params: {
  searchTerm: string;
  limit: number;
  offset: number;
}) {
  return await trpc.world.search.query(params);
}
