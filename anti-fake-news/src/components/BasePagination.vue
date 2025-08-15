<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2">
    <button
      @click="prevPage"
      :disabled="isFirstPage"
      class="px-4 py-2 rounded-lg border bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Previous
    </button>
    <span class="text-lg font-medium text-gray-700">
      Page {{ currentPage }} of {{ totalPages }}
    </span>
    <button
      @click="nextPage"
      :disabled="isLastPage"
      class="px-4 py-2 rounded-lg border bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
    >
      Next
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}>();

const emit = defineEmits(['page-changed']);

const totalPages = computed<number>(() => Math.ceil(props.totalItems / props.itemsPerPage));
const isFirstPage = computed<boolean>(() => props.currentPage === 1);
const isLastPage = computed<boolean>(() => props.currentPage === totalPages.value);

const prevPage = () => {
  if (!isFirstPage.value) {
    emit('page-changed', props.currentPage - 1);
  }
};

const nextPage = () => {
  if (!isLastPage.value) {
    emit('page-changed', props.currentPage + 1);
  }
};
</script>