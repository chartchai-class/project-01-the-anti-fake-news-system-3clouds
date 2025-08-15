<template>
  <div class="container mx-auto p-4">

    <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
      <h1 class="text-4xl font-bold mb-6 text-gray-800">3Clouds News</h1>
      <div class="flex space-x-2">
        <button @click="filterStatus = 'all'" :class="{ 'bg-blue-600 text-white': filterStatus === 'all' }"
          class="px-4 py-2 rounded-lg font-medium border transition-colors duration-200 hover:bg-blue-500 hover:text-white">
          All
        </button>
        <button @click="filterStatus = 'not fake'" :class="{ 'bg-green-600 text-white': filterStatus === 'not fake' }"
          class="px-4 py-2 rounded-lg font-medium border transition-colors duration-200 hover:bg-green-500 hover:text-white">
          Real
        </button>
        <button @click="filterStatus = 'fake'" :class="{ 'bg-red-600 text-white': filterStatus === 'fake' }"
          class="px-4 py-2 rounded-lg font-medium border transition-colors duration-200  hover:bg-red-500 hover:text-white">
          Fake
        </button>
      </div>

      <div class="flex items-center space-x-2">
        <span class="text-gray-600">News per page:</span>
        <select v-model="newsPerPage" class="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>5</option>
          <option>10</option>
          <option>20</option>
        </select>
      </div>
    </div>

    <div v-if="paginatedNews.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NewsCard v-for="news in paginatedNews" :key="news.id" :news="news" />
    </div>
    <div v-else class="text-center text-gray-500 text-xl py-10">
      No news found
    </div>

    <Pagination :total-items="filteredNews.length" :items-per-page="newsPerPage" :current-page="currentPage"
      @page-changed="currentPage = $event" class="mt-8" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useNewsStore } from '../stores/news';
import NewsCard from '@/components/NewsCard.vue';
import Pagination from '@/components/BasePagination.vue';
import type { News } from '../stores/news';

const store = useNewsStore();
const filterStatus = ref<'all' | 'fake' | 'not fake'>('all');
const currentPage = ref<number>(1);
const newsPerPage = ref<number>(5);

onMounted(() => {
  store.fetchNews();
});

// A watcher to reset the current page to 1 whenever the filter status changes
watch(filterStatus, () => {
  currentPage.value = 1;
});

const filteredNews = computed<News[]>(() => {
  return store.getNewsWithStatus(filterStatus.value);
});

const paginatedNews = computed<News[]>(() => {
  const start = (currentPage.value - 1) * newsPerPage.value;
  const end = start + newsPerPage.value;
  return filteredNews.value.slice(start, end);
});
</script>