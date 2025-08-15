<template>
  <router-link
    :to="`/news/${news.id}`"
    class="block bg-white shadow-lg rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 border-b-4"
    :class="{
      'border-green-600': news.status === 'not fake',
      'border-red-600': news.status === 'fake',
      'border-gray-500': news.voteSummary.real === news.voteSummary.fake // เพิ่มเงื่อนไขสำหรับ 'equal'
    }"
  >
    <div v-if="news.image && (news.image.startsWith('http') || news.image.startsWith('https'))" class="relative">
      <img :src="news.image" :alt="news.topic" class="w-full h-48 object-cover">
      <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
        <h3 class="text-white text-lg font-bold text-center drop-shadow-lg">{{ news.topic }}</h3>
      </div>
    </div>
    <div v-else class="relative bg-white-200 w-full h-48 flex items-center justify-center">
        <h3 class="text-gray-500 text-lg text-center font-bold px-4">No Image Available</h3>
    </div>

    <div class="p-4 flex justify-start space-x-2">
      <span
        class="px-3 py-1 rounded-full text-xs font-bold"
        :class="{
          'bg-green-100 text-green-700': news.voteSummary.real > news.voteSummary.fake,
          'bg-red-100 text-red-700': news.voteSummary.fake > news.voteSummary.real,
          'bg-gray-200 text-gray-700': news.voteSummary.real === news.voteSummary.fake,
        }"
      >
        {{ news.voteSummary.real > news.voteSummary.fake ? 'Real' : news.voteSummary.fake > news.voteSummary.real ? 'Fake' : 'Equal' }}
      </span>
    </div>

    <div class="p-6 pt-0">
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