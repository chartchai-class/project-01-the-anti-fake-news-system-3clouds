<template>
  <div class="container mx-auto p-4">

    <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
      <h1 class="text-4xl font-bold mb-6 text-gray-800">3Clouds News</h1>
      <div class="flex space-x-2">
        <button @click="filterStatus = 'all'" :class="[
          'px-4 py-2 rounded-lg font-medium border transition-colors duration-200',
          {
            'bg-blue-600 text-white': filterStatus === 'all',
            'bg-white text-gray-800 hover:bg-blue-500 hover:text-white': filterStatus !== 'all'
          }
        ]">
          All
        </button>
        <button @click="filterStatus = 'not fake'" :class="[
          'px-4 py-2 rounded-lg font-medium border transition-colors duration-200',
          {
            'bg-green-600 text-white': filterStatus === 'not fake',
            'bg-white text-gray-800 hover:bg-green-500 hover:text-white': filterStatus !== 'not fake'
          }
        ]">
          Real
        </button>
        <button @click="filterStatus = 'fake'" :class="[
          'px-4 py-2 rounded-lg font-medium border transition-colors duration-200',
          {
            'bg-red-600 text-white': filterStatus === 'fake',
            'bg-white text-gray-800 hover:bg-red-500 hover:text-white': filterStatus !== 'fake'
          }
        ]">
          Fake
        </button>
        <button @click="filterStatus = 'equal'" :class="[
          'px-4 py-2 rounded-lg font-medium border transition-colors duration-200',
          {
            'bg-gray-600 text-white': filterStatus === 'equal',
            'bg-white text-gray-800 hover:bg-gray-500 hover:text-white': filterStatus !== 'equal'
          }
        ]">
          Equal
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

    <Pagination
      :total-items="filteredNews.length"
      :items-per-page="newsPerPage"
      :current-page="currentPage"
      @page-changed="onPageChanged"
      class="mt-8"
    />

    <RouterLink
      to="/add-news"
      class="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router'; // Import RouterLink
import { useNewsStore } from '../stores/news';
import NewsCard from '@/components/NewsCard.vue';
import Pagination from '@/components/BasePagination.vue';
import type { News } from '../stores/news';

const store = useNewsStore();
const filterStatus = ref<'all' | 'fake' | 'not fake' | 'equal'>('all');
const currentPage = ref<number>(1);
const newsPerPage = ref<number>(5);

onMounted(() => {
  store.fetchNews();
});

watch(filterStatus, () => {
  currentPage.value = 1;
});

watch(newsPerPage, () => {
  currentPage.value = 1;
});

const onPageChanged = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const filteredNews = computed<News[]>(() => {
  return store.getNewsWithStatus(filterStatus.value);
});

const paginatedNews = computed<News[]>(() => {
  const start = (currentPage.value - 1) * newsPerPage.value;
  const end = start + newsPerPage.value;
  return filteredNews.value.slice(start, end);
});
</script>