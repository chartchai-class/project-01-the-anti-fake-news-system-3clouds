<template>
  <div v-if="news" class="container mx-auto p-4 max-w-4xl">
    <router-link
      to="/"
      class="group inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:-translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span class="font-medium">Back to Home</span>
    </router-link>

    <div class="bg-white shadow-lg rounded-xl overflow-hidden">
      <div class="p-6">
        <h1 class="text-4xl font-extrabold mb-4 text-gray-900">{{ news.topic }}</h1>

        <div class="flex items-center mb-6 space-x-4 text-sm text-gray-600">
          <span
            :class="{
              'bg-red-600': news.status === 'fake',
              'bg-green-600': news.status === 'not fake',
              'bg-gray-500': news.status === 'equal',
            }"
            class="text-white font-bold px-3 py-1 rounded-full uppercase"
          >
            {{
              news.status === 'fake'
                ? 'Fake News'
                : news.status === 'not fake'
                  ? 'Real'
                  : 'Equal'
            }}
          </span>
          <p>Reporter: <span class="font-semibold">{{ news.reporter }}</span></p>
          <p>Date: <span class="font-semibold">{{ new Date(news.dateTime).toLocaleDateString() }}</span></p>
        </div>

        <img
          v-if="news.image && (news.image.startsWith('http') || news.image.startsWith('https'))"
          :src="news.image"
          :alt="news.topic"
          class="w-full h-auto rounded-lg mb-8"
        >
      
        <p class="text-lg text-gray-800 leading-relaxed mb-10 whitespace-pre-line">{{ news.fullDetail }}</p>
        
        <div class="mb-6">
          <div class="flex space-x-8 border-b border-gray-200">
            <button
              @click="activeTab = 'comments'"
              :class="{
                'text-black border-black': activeTab === 'comments',
                'text-gray-600 border-transparent hover:text-gray-800': activeTab !== 'comments'
              }"
              class="pb-3 px-1 border-b-2 font-medium transition-colors duration-200"
            >
              All Comments
            </button>
            <button
              @click="activeTab = 'vote'"
              :class="{
                'text-black border-black': activeTab === 'vote',
                'text-gray-600 border-transparent hover:text-gray-800': activeTab !== 'vote'
              }"
              class="pb-3 px-1 border-b-2 font-medium transition-colors duration-200"
            >
              Vote
            </button>
          </div>
        </div>

        <CommentsSection
            v-if="activeTab === 'comments'"
            :comments="news.comments"
            :vote-summary="news.voteSummary"
        />

        <VoteSection
            v-if="activeTab === 'vote'"
            :news="news"
            @submit-vote="handleVoteSubmission"
        />
        
        </div>
    </div>
  </div>
  <div v-else class="container mx-auto p-4 text-center py-20">
    <h1 class="text-2xl font-bold text-gray-500">News not found</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'; // เพิ่ม onMounted
import { useRoute } from 'vue-router';
import { useNewsStore } from '../stores/news';
import { useNotificationStore } from '../stores/notification';

import CommentsSection from '../components/CommentsVotes.vue';
import VoteSection from '../components/VoteSection.vue';
import type { Vote } from '../stores/news';

const route = useRoute();
const newsStore = useNewsStore();
const notificationStore = useNotificationStore();

const newsId = parseInt(route.params.id as string);
const news = computed(() => newsStore.getNewsById(newsId));

const activeTab = ref<'comments' | 'vote'>('comments');

// เพิ่ม onMounted hook เพื่อโหลดข้อมูลเมื่อ component ถูก mount
onMounted(() => {
  if (!news.value) {
    newsStore.fetchNews();
  }
});

const handleVoteSubmission = (data: {
  userName: string;
  vote: Vote;
  commentText: string;
  imageUrl: string | null;
}) => {
  newsStore.addCommentToNews(
    newsId,
    data.userName || 'Anonymous',
    data.commentText || '',
    data.imageUrl,
    data.vote
  );
  
  notificationStore.addNotification('Vote submitted successfully.', 'success');

  activeTab.value = 'comments';
};
</script>