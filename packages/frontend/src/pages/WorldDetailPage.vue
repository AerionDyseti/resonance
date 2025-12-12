<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <router-link to="/worlds" class="text-gray-500 hover:text-gray-700">
        &larr; Back to Worlds
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">World Details</h2>
      <p class="text-gray-500">World ID: {{ worldId }}</p>
      <p class="text-gray-400 text-sm mt-4">
        World details and entity management will be available in Phase 1.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const worldId = computed(() => route.params.worldId as string);
</script>
