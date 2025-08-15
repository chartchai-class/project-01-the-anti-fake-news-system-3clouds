<template>
  <div v-if="news" class="container mx-auto p-4 max-w-4xl">
    <router-link to="/" class="text-blue-600 hover:underline mb-4 inline-block font-medium">&lt; Back to Home</router-link>

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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useNewsStore } from '../stores/news';
import CommentsSection from '../components/CommentsVotes.vue';
import VoteSection from '../components/VoteSection.vue';
import type { Vote } from '../stores/news';

const route = useRoute();
const store = useNewsStore();

const newsId = parseInt(route.params.id as string);
const news = computed(() => store.getNewsById(newsId));

const activeTab = ref<'comments' | 'vote'>('comments');

const handleVoteSubmission = (data: {
  userName: string;
  vote: Vote;
  commentText: string;
  imageUrl: string | null;
}) => {
  store.addCommentToNews(
    newsId,
    data.userName || 'Anonymous',
    data.commentText || '',
    data.imageUrl,
    data.vote
  );
  
  // Show success message and switch to comments tab
  alert('Thank you for your vote!');
  activeTab.value = 'comments';
};
</script>