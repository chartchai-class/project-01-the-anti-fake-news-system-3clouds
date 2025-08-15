<template>
  <router-link
    :to="`/news/${news.id}`"
    class="block bg-white shadow-lg rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 border-b-4 border-gray-200"
    :class="{
      'border-green-600': news.status === 'not fake',
      'border-red-600': news.status === 'fake'
    }"
  >
    <div class="p-6">
      <h2 class="text-xl font-bold mb-2 text-gray-900">{{ news.topic }}</h2>
      <p class="text-gray-600 mb-4 line-clamp-3">{{ news.shortDetail }}</p>
      <div class="flex justify-between items-center text-sm text-gray-500">
        <p>Reporter: {{ news.reporter }}</p>
        <p>Date: {{ new Date(news.dateTime).toLocaleDateString() }}</p>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { News } from '../stores/news';

defineProps<{
  news: News;
}>();
</script>