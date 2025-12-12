<template>
  <div class="world-list">
    <!-- Loading State -->
    <div v-if="loading && !hasWorlds" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      <p class="font-bold">Error</p>
      <p>{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasWorlds" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No worlds</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new world.</p>
    </div>

    <!-- World List -->
    <div v-else class="space-y-4">
      <div
        v-for="world in worlds"
        :key="world.id"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ world.name }}
              </h3>
              <span
                v-if="world.isNew"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
              >
                New
              </span>
            </div>
            <p v-if="world.description" class="mt-1 text-sm text-gray-600">
              {{ world.description }}
            </p>
            <div class="mt-2 text-xs text-gray-500">
              Created {{ formatDate(world.createdAt) }}
              <span v-if="world.updatedAt !== world.createdAt">
                · Updated {{ formatDate(world.updatedAt) }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 ml-4">
            <button
              class="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
              @click="$emit('edit', world)"
            >
              Edit
            </button>
            <button
              class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
              :disabled="deleting"
              @click="handleDelete(world)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to
          {{ Math.min(currentPage * pageSize, total) }} of {{ total }} worlds
        </div>

        <div class="flex gap-2">
          <button
            :disabled="currentPage === 1"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="$emit('previous-page')"
          >
            Previous
          </button>

          <div class="flex gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md',
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
              ]"
              @click="$emit('go-to-page', page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="currentPage === totalPages"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="$emit('next-page')"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { WorldId } from '@resonance/shared';

interface World {
  id: WorldId;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  isNew: boolean;
}

interface Props {
  worlds: World[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  hasWorlds: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [world: World];
  delete: [id: WorldId];
  'previous-page': [];
  'next-page': [];
  'go-to-page': [page: number];
}>();

const deleting = ref(false);

// Compute visible page numbers (show max 5 pages)
const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(props.totalPages, start + maxVisible - 1);

  // Adjust start if we're near the end
  start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.round((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  );
}

function handleDelete(world: World) {
  if (!confirm(`Are you sure you want to delete "${world.name}"?`)) {
    return;
  }

  deleting.value = true;
  try {
    emit('delete', world.id);
  } finally {
    deleting.value = false;
  }
}
</script>
