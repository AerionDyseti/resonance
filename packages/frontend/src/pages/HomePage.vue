<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4">Welcome to Resonance</h2>
      <p class="text-gray-600 mb-4">
        A flexible, AI-powered world building and tracking system for authors, dungeon masters, and
        creative worldbuilders.
      </p>
      <div class="bg-blue-50 border border-blue-200 rounded p-4">
        <p class="text-sm text-blue-800">Phase 0 (Project Setup) is in progress.</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-3">API Health Check</h3>
      <div v-if="isLoading" class="text-gray-500">Checking API status...</div>
      <div v-else-if="error" class="text-red-600">
        Failed to connect to API: {{ error.message }}
      </div>
      <div v-else-if="data" class="text-green-600">
        API Status: {{ data.status }} ({{ data.timestamp }})
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <router-link
        to="/worlds"
        class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-semibold mb-2">My Worlds</h3>
        <p class="text-gray-600 text-sm">Create and manage your worldbuilding projects</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { trpc } from '@/lib/trpc';

const { data, isLoading, error } = useQuery({
  queryKey: ['health'],
  queryFn: () => trpc.health.query(),
});
</script>
