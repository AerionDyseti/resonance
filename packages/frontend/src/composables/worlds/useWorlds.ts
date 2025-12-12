import type { WorldId } from '@resonance/shared';

import { createWorldsState } from './worldsState';
import {
  listWorlds,
  createWorldApi,
  updateWorldApi,
  deleteWorldApi,
  searchWorldsApi,
} from './worldsApi';

/**
 * Composable for World CRUD operations.
 *
 * This module stays small; implementation details live in sibling modules.
 */
export function useWorlds() {
  const state = createWorldsState();

  async function fetchWorlds() {
    state.loading.value = true;
    state.error.value = null;

    try {
      const offset = (state.currentPage.value - 1) * state.pageSize.value;
      const result = await listWorlds({
        limit: state.pageSize.value,
        offset,
      });

      state.worlds.value = result.worlds;
      state.total.value = result.total;
    } catch (err) {
      state.error.value = err instanceof Error ? err.message : 'Failed to fetch worlds';
    } finally {
      state.loading.value = false;
    }
  }

  async function createWorld(data: { name: string; description?: string }) {
    state.loading.value = true;
    state.error.value = null;

    try {
      const newWorld = await createWorldApi(data);
      await fetchWorlds();
      return newWorld;
    } catch (err) {
      state.error.value = err instanceof Error ? err.message : 'Failed to create world';
      throw err;
    } finally {
      state.loading.value = false;
    }
  }

  async function updateWorld(data: { id: WorldId; name?: string; description?: string | null }) {
    state.loading.value = true;
    state.error.value = null;

    try {
      const updatedWorld = await updateWorldApi(data);

      const index = state.worlds.value.findIndex((w) => w.id === data.id);
      if (index !== -1) {
        state.worlds.value[index] = updatedWorld;
      }

      return updatedWorld;
    } catch (err) {
      state.error.value = err instanceof Error ? err.message : 'Failed to update world';
      throw err;
    } finally {
      state.loading.value = false;
    }
  }

  async function deleteWorld(id: WorldId) {
    state.loading.value = true;
    state.error.value = null;

    try {
      await deleteWorldApi(id);

      state.worlds.value = state.worlds.value.filter((w) => w.id !== id);
      state.total.value--;

      if (state.worlds.value.length === 0 && state.currentPage.value > 1) {
        state.currentPage.value--;
        await fetchWorlds();
      }
    } catch (err) {
      state.error.value = err instanceof Error ? err.message : 'Failed to delete world';
      throw err;
    } finally {
      state.loading.value = false;
    }
  }

  async function searchWorlds(searchTerm: string) {
    if (!searchTerm.trim()) {
      await fetchWorlds();
      return;
    }

    state.loading.value = true;
    state.error.value = null;

    try {
      const result = await searchWorldsApi({
        searchTerm,
        limit: state.pageSize.value,
        offset: 0,
      });

      state.worlds.value = result.worlds;
      state.total.value = result.total;
      state.currentPage.value = 1;
    } catch (err) {
      state.error.value = err instanceof Error ? err.message : 'Failed to search worlds';
    } finally {
      state.loading.value = false;
    }
  }

  async function goToPage(page: number) {
    if (page < 1 || page > state.totalPages.value) return;
    state.currentPage.value = page;
    await fetchWorlds();
  }

  async function nextPage() {
    if (state.currentPage.value < state.totalPages.value) {
      await goToPage(state.currentPage.value + 1);
    }
  }

  async function previousPage() {
    if (state.currentPage.value > 1) {
      await goToPage(state.currentPage.value - 1);
    }
  }

  return {
    ...state,
    fetchWorlds,
    createWorld,
    updateWorld,
    deleteWorld,
    searchWorlds,
    goToPage,
    nextPage,
    previousPage,
  };
}
