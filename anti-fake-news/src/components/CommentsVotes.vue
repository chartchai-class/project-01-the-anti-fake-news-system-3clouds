<template>
  <div>
    <div class="bg-gray-100 p-6 rounded-xl mb-8">
      <div class="mb-4">
        <h3 class="text-lg font-bold text-gray-800 mb-2">
          Vote Summary :
          <span
            :class="{
              'bg-red-600': voteSummary.fake > voteSummary.real,
              'bg-green-600': voteSummary.real > voteSummary.fake,
              'bg-gray-500': voteSummary.real === voteSummary.fake,
            }"
            class="text-white font-bold px-3 py-1 rounded text-sm uppercase ml-2"
          >
            {{ fakeVotes > realVotes ? 'FAKE' : realVotes > fakeVotes ? 'REAL' : 'EQUAL' }}
          </span>
        </h3>
      </div>

      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Real</span>
          <span class="text-sm text-gray-600">{{ realPercentage }}% ({{ realVotes }} votes)</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div
            class="bg-green-500 h-4 rounded-full transition-all duration-300"
            :style="{ width: `${realPercentage}%` }"
          ></div>
        </div>
      </div>

      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Fake</span>
          <span class="text-sm text-gray-600">{{ fakePercentage }}% ({{ fakeVotes }} votes)</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div
            class="bg-red-500 h-4 rounded-full transition-all duration-300"
            :style="{ width: `${fakePercentage}%` }"
          ></div>
        </div>
      </div>

      <div class="text-right border-t pt-3 mt-4">
        <span class="text-sm font-semibold text-gray-800">Total: {{ totalVotes }} Votes</span>
      </div>
    </div>

    <h3 class="text-2xl font-bold mb-4 text-gray-800">Comment :</h3>

    <div class="flex flex-col sm:flex-row items-center justify-end gap-4 mb-4">
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <label for="filter-select" class="text-gray-700 font-medium whitespace-nowrap">Filter by:</label>
        <div class="relative w-full">
          <select
            id="filter-select"
            v-model="filterOption"
            class="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Comments</option>
            <option value="real">Real</option>
            <option value="fake">Fake</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <label for="sort-select" class="text-gray-700 font-medium whitespace-nowrap">Sort by:</label>
        <div class="relative w-full">
          <select
            id="sort-select"
            v-model="sortOption"
            class="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredAndSortedComments.length > 0">
      <div
        v-for="comment in paginatedComments"
        :key="comment.id"
        class="bg-gray-50 p-4 rounded-lg mb-4 border"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center mr-3 border border-gray-300 shadow-sm"
              :style="{ 'background-color': getProfileColor(comment.user) }"
            >
              <span class="text-sm font-bold text-gray-800">{{ comment.user.charAt(0).toUpperCase() }}</span>
            </div>
            <p class="font-bold text-gray-800">{{ comment.user }}</p>
          </div>
          <div class="text-sm text-gray-500">
            <span>{{ new Date(comment.time).toLocaleDateString() }}</span>
            <span class="mx-2">|</span>
            <span>{{ new Date(comment.time).toLocaleTimeString() }}</span>
          </div>
        </div>
        <div class="ml-11">
          <p v-if="comment.text" class="text-gray-700 mb-2">{{ comment.text }}</p>

          <div class="flex items-center text-sm mb-1">
            <span class="text-gray-600">Vote : </span>
            <span
              :class="{
                'text-green-600': comment.vote === 'real',
                'text-red-600': comment.vote === 'fake'
              }"
              class="font-semibold ml-1"
            >
              {{ comment.vote === 'real' ? 'Real' : 'Fake' }}
            </span>
          </div>

          <div v-if="comment.image" class="flex items-center text-sm mb-2">
            <span class="text-gray-600">Evidence :</span>
          </div>

          <img
            v-if="comment.image"
            :src="comment.image"
            alt="Comment Image"
            class="mt-4 w-full h-auto rounded-lg max-h-64 object-cover"
          />
        </div>
      </div>
      <Pagination
        :total-items="filteredAndSortedComments.length"
        :items-per-page="commentsPerPage"
        :current-page="commentPage"
        @page-changed="commentPage = $event"
        class="mt-6"
      />
    </div>
    <p v-else class="text-gray-500 italic">No comments match the filter.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps } from 'vue';
import Pagination from './BasePagination.vue';
import type { Comment, VoteSummary } from '../stores/news';

const props = defineProps<{
  comments: Comment[];
  voteSummary: VoteSummary;
}>();

const commentPage = ref<number>(1);
const commentsPerPage = ref<number>(3);
const filterOption = ref<'all' | 'real' | 'fake'>('all');
const sortOption = ref<'newest' | 'oldest'>('newest');

// ฟังก์ชันสำหรับสร้างสีพาสเทลที่สดใสจากชื่อผู้ใช้
const getProfileColor = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  const saturation = 70;
  const lightness = 85;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const commentsWithContent = computed(() =>
  props.comments.filter(
    (c) => (c.text && c.text.trim().length > 0) || (c.image && c.image.trim().length > 0)
  )
);

const filteredAndSortedComments = computed<Comment[]>(() => {
  let filteredComments = commentsWithContent.value;

  if (filterOption.value !== 'all') {
    filteredComments = filteredComments.filter((c) => c.vote === filterOption.value);
  }

  const sortedComments = [...filteredComments].sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    if (sortOption.value === 'newest') {
      return timeB - timeA;
    } else {
      return timeA - timeB;
    }
  });

  return sortedComments;
});

const paginatedComments = computed<Comment[]>(() => {
  const start = (commentPage.value - 1) * commentsPerPage.value;
  const end = start + commentsPerPage.value;
  return filteredAndSortedComments.value.slice(start, end);
});

watch([filterOption, sortOption], () => {
  commentPage.value = 1;
});

const fakeVotes = computed(() => props.voteSummary.fake || 0);
const realVotes = computed(() => props.voteSummary.real || 0);
const totalVotes = computed(() => fakeVotes.value + realVotes.value);

const realPercentage = computed(() => {
  const total = totalVotes.value;
  if (total === 0) return 0;
  return Math.round((realVotes.value / total) * 100);
});

const fakePercentage = computed(() => {
  const total = totalVotes.value;
  if (total === 0) return 0;
  return Math.round((fakeVotes.value / total) * 100);
});
</script>