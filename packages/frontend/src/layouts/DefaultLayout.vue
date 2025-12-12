<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div>
            <router-link to="/" class="text-3xl font-bold text-gray-900 hover:text-resonance-600">
              Resonance
            </router-link>
            <p class="text-gray-600 mt-1">World Building & Tracking System</p>
          </div>
          <nav class="flex gap-4">
            <router-link
              to="/"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              active-class="bg-gray-100 text-gray-900"
            >
              Home
            </router-link>
            <router-link
              to="/worlds"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              active-class="bg-gray-100 text-gray-900"
            >
              Worlds
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Default layout component
</script>
