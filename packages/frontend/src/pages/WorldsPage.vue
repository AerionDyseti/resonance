<template>
  <div class="worlds-page space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Worlds</h1>
        <p class="mt-1 text-sm text-gray-600">Manage your worldbuilding projects</p>
      </div>
      <button
        class="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        @click="showCreateForm"
      >
        + Create World
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="relative">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search worlds by name..."
          class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleSearch"
        />
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Create/Edit Form Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeForm"
    >
      <div class="max-w-2xl w-full" @click.stop>
        <WorldForm
          :world="editingWorld"
          :submitting="loading"
          @submit="handleSubmit"
          @cancel="closeForm"
        />
      </div>
    </div>

    <!-- World List -->
    <WorldList
      :worlds="worlds"
      :loading="loading"
      :error="error"
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-size="pageSize"
      :total="total"
      :has-worlds="hasWorlds"
      @edit="handleEdit"
      @delete="handleDelete"
      @previous-page="previousPage"
      @next-page="nextPage"
      @go-to-page="goToPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWorlds } from '../composables/useWorlds';
import WorldList from '../components/worlds/WorldList.vue';
import WorldForm from '../components/worlds/WorldForm.vue';
import type { WorldId } from '@resonance/shared';
import type { WorldState } from '../composables/worlds/worldsState';

// Composable
const {
  worlds,
  loading,
  error,
  total,
  currentPage,
  pageSize,
  hasWorlds,
  totalPages,
  fetchWorlds,
  createWorld,
  updateWorld,
  deleteWorld,
  searchWorlds,
  goToPage,
  nextPage,
  previousPage,
} = useWorlds();

// Local state
const showForm = ref(false);
const editingWorld = ref<WorldState | null>(null);
const searchTerm = ref('');
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Load worlds on mount
onMounted(async () => {
  await fetchWorlds();
});

function showCreateForm() {
  editingWorld.value = null;
  showForm.value = true;
}

function handleEdit(world: WorldState) {
  editingWorld.value = world;
  showForm.value = true;
}

async function handleSubmit(data: { name: string; description?: string; id?: WorldId }) {
  try {
    if (data.id) {
      // Update existing world
      await updateWorld({
        id: data.id,
        name: data.name,
        description: data.description,
      });
    } else {
      // Create new world
      await createWorld({
        name: data.name,
        description: data.description,
      });
    }

    closeForm();
  } catch {
    // Error is already handled in the composable
  }
}

async function handleDelete(id: WorldId) {
  try {
    await deleteWorld(id);
  } catch {
    // Error is already handled in the composable
  }
}

function handleSearch() {
  // Debounce search input
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(async () => {
    await searchWorlds(searchTerm.value);
  }, 300);
}

function closeForm() {
  showForm.value = false;
  editingWorld.value = null;
}
</script>
