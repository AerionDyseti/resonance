<template>
  <div class="world-form bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">
      {{ isEditing ? 'Edit World' : 'Create New World' }}
    </h2>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Name Field -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
          Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          maxlength="255"
          placeholder="Enter world name..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">
          {{ errors.name }}
        </p>
        <p class="mt-1 text-xs text-gray-500">{{ formData.name.length }}/255 characters</p>
      </div>

      <!-- Description Field -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="4"
          placeholder="Enter world description (optional)..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p class="mt-1 text-xs text-gray-500">Optional description for your world</p>
      </div>

      <!-- Error Message -->
      <div
        v-if="submitError"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
      >
        <p class="font-bold">Error</p>
        <p>{{ submitError }}</p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          :disabled="submitting"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="submitting || !isValid"
        >
          {{ submitting ? 'Saving...' : isEditing ? 'Update World' : 'Create World' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { WorldId } from '@resonance/shared';

interface World {
  id: WorldId;
  name: string;
  description: string | null;
}

interface Props {
  world?: World | null;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  world: null,
  submitting: false,
});

const emit = defineEmits<{
  submit: [data: { name: string; description?: string; id?: WorldId }];
  cancel: [];
}>();

// Form state
const formData = ref({
  name: '',
  description: '',
});

const errors = ref({
  name: '',
});

const submitError = ref<string | null>(null);

// Computed
const isEditing = computed(() => !!props.world);

const isValid = computed(() => {
  return formData.value.name.trim().length > 0 && formData.value.name.length <= 255;
});

// Watch for prop changes (when editing)
watch(
  () => props.world,
  (newWorld) => {
    if (newWorld) {
      formData.value.name = newWorld.name;
      formData.value.description = newWorld.description || '';
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function validate(): boolean {
  errors.value.name = '';
  submitError.value = null;

  const trimmedName = formData.value.name.trim();

  if (!trimmedName) {
    errors.value.name = 'Name is required';
    return false;
  }

  if (trimmedName.length > 255) {
    errors.value.name = 'Name cannot exceed 255 characters';
    return false;
  }

  return true;
}

function handleSubmit() {
  if (!validate()) {
    return;
  }

  const data: { name: string; description?: string; id?: WorldId } = {
    name: formData.value.name.trim(),
    description: formData.value.description.trim() || undefined,
  };

  if (isEditing.value && props.world) {
    data.id = props.world.id;
  }

  emit('submit', data);
}

function resetForm() {
  formData.value.name = '';
  formData.value.description = '';
  errors.value.name = '';
  submitError.value = null;
}

// Expose reset method
defineExpose({ resetForm });
</script>
