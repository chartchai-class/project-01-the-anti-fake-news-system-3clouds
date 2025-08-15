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
              'bg-green-600': news.status === 'not fake'
            }"
            class="text-white font-bold px-3 py-1 rounded-full uppercase"
          >
            {{ news.status === 'fake' ? 'Fake News' : 'Not Fake' }}
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
        
        <div class="bg-gray-100 p-6 rounded-xl mb-8">
          <h3 class="text-2xl font-bold mb-4 text-gray-800">Vote & Comment</h3>
          <div class="flex items-center mb-4 space-x-2">
            <p class="font-medium text-gray-700">Vote:</p>
            <button
              @click="voteStatus = 'real'"
              :class="{'bg-green-600 text-white': voteStatus === 'real'}"
              class="px-4 py-2 rounded-lg font-medium border-2 transition-colors duration-200"
            >
              Not Fake
            </button>
            <button
              @click="voteStatus = 'fake'"
              :class="{'bg-red-600 text-white': voteStatus === 'fake'}"
              class="px-4 py-2 rounded-lg font-medium border-2 transition-colors duration-200"
            >
              Fake
            </button>
          </div>
          <input v-model="userName" placeholder="Username" class="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <textarea v-model="commentText" placeholder="Write your comment here..." class="w-full p-3 border rounded-lg mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          <input v-model="imageLink" placeholder="Image URL (optional)" class="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <button @click="submitComment" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
            Submit
          </button>
        </div>
        
        <h3 class="text-2xl font-bold mb-4 text-gray-800">Comments ({{ news.comments.length }})</h3>
        <div v-if="paginatedComments.length > 0">
          <div v-for="comment in paginatedComments" :key="comment.id" class="bg-gray-50 p-4 rounded-lg mb-4 border">
            <div class="flex justify-between items-center mb-2">
              <p class="font-bold text-gray-800">{{ comment.user }}</p>
              <span
                :class="{
                  'text-green-600': comment.vote === 'real',
                  'text-red-600': comment.vote === 'fake'
                }"
                class="font-semibold"
              >
                Vote: {{ comment.vote === 'real' ? 'Not Fake' : 'Fake' }}
              </span>
            </div>
            <p class="text-gray-700">{{ comment.text }}</p>
            <img v-if="comment.image" :src="comment.image" alt="Comment Image" class="mt-4 w-full h-auto rounded-lg max-h-64 object-cover">
          </div>
          <Pagination
            :total-items="news.comments.length"
            :items-per-page="commentsPerPage"
            :current-page="commentPage"
            @page-changed="commentPage = $event"
            class="mt-6"
          />
        </div>
        <p v-else class="text-gray-500 italic">No comments yet.</p>
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
import Pagination from '../components/BasePagination.vue';
import type { Comment } from '../stores/news';

const route = useRoute();
const store = useNewsStore();

const newsId = parseInt(route.params.id as string);
const news = computed(() => store.getNewsById(newsId));

const userName = ref<string>('');
const voteStatus = ref<'real' | 'fake' | null>(null);
const commentText = ref<string>('');
const imageLink = ref<string | null>(null);

const commentPage = ref<number>(1);
const commentsPerPage = ref<number>(5);
const paginatedComments = computed<Comment[]>(() => {
  if (!news.value) return [];
  const start = (commentPage.value - 1) * commentsPerPage.value;
  const end = start + commentsPerPage.value;
  return news.value.comments.slice(start, end);
});

const submitComment = () => {
  if (voteStatus.value && userName.value && commentText.value) {
    store.addCommentToNews(
      newsId,
      userName.value,
      commentText.value,
      imageLink.value,
      voteStatus.value
    );
    userName.value = '';
    voteStatus.value = null;
    commentText.value = '';
    imageLink.value = null;
    alert('Thank you for your submission!');
  } else {
    alert('Please select a vote, enter your name, and write a comment.');
  }
};
</script>