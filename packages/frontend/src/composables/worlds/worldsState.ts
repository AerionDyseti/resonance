import { ref, computed } from 'vue';
import type { WorldId } from '@resonance/shared';

export interface WorldState {
  id: WorldId;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  isNew: boolean;
}

export function createWorldsState() {
  const worlds = ref<WorldState[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);

  const currentPage = ref(1);
  const pageSize = ref(10);

  const hasWorlds = computed(() => worlds.value.length > 0);
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

  return {
    // state
    worlds,
    loading,
    error,
    total,
    currentPage,
    pageSize,

    // computed
    hasWorlds,
    totalPages,
  };
}
