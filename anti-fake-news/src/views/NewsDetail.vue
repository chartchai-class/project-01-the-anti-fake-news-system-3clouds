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
      
        <p class="font-bold text-black-700">Full Detail :</p>
        <p class="text-lg text-gray-800 leading-relaxed mb-10 whitespace-pre-line">{{ news.fullDetail }}</p>
        
        <!-- Navigation Tabs -->
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

        <!-- Vote Section -->
        <div v-if="activeTab === 'vote'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Vote Form -->
          <div class="bg-gray-100 p-6 rounded-xl">
            <div class="mb-6">
              <label class="block text-lg font-semibold text-gray-800 mb-4">vote:</label>
              <div class="flex space-x-4">
                <button
                  @click="selectedVote = 'fake'"
                  :class="{
                    'bg-red-500 text-white': selectedVote === 'fake',
                    'bg-red-100 text-red-600 hover:bg-red-200': selectedVote !== 'fake'
                  }"
                  class="px-6 py-2 rounded-full font-bold transition-colors duration-200"
                >
                  FAKE ✕
                </button>
                <button
                  @click="selectedVote = 'real'"
                  :class="{
                    'bg-green-500 text-white': selectedVote === 'real',
                    'bg-green-100 text-green-600 hover:bg-green-200': selectedVote !== 'real'
                  }"
                  class="px-6 py-2 rounded-full font-bold transition-colors duration-200"
                >
                  REAL ✓
                </button>
              </div>
            </div>

            <div class="mb-4">
              <input
                v-model="voterName"
                type="text"
                placeholder="enter your name (optional)"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>

            <div class="mb-4">
              <textarea
                v-model="voterComment"
                placeholder="write an comment... (optional)"
                rows="4"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            <div class="mb-6">
              <input
                v-model="voterImage"
                type="text"
                placeholder="enter an image url (optional)"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>

            <button
              @click="submitVote"
              :disabled="!selectedVote"
              class="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Submit
            </button>
          </div>

          <!-- Vote Summary -->
          <div>
            <div class="bg-white p-6 rounded-xl border">
              <div class="mb-4">
                <h3 class="text-lg font-bold text-gray-800 mb-2">
                  Vote Summary : 
                  <span
                    :class="{
                      'bg-red-600': fakeVotes > realVotes,
                      'bg-green-600': realVotes > fakeVotes,
                      'bg-gray-500': realVotes === fakeVotes
                    }"
                    class="text-white font-bold px-3 py-1 rounded text-sm uppercase ml-2"
                  >
                    {{ fakeVotes > realVotes ? 'FAKE' : realVotes > fakeVotes ? 'REAL' : 'EQUAL' }}
                  </span>
                </h3>
              </div>

              <!-- Real Votes Progress Bar -->
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

              <!-- Fake Votes Progress Bar -->
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

              <!-- Total Votes -->
              <div class="text-right border-t pt-3 mt-4">
                <span class="text-sm font-semibold text-gray-800">Total: {{ totalVotes }} Votes</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div v-if="activeTab === 'comments'">
          <div class="bg-gray-100 p-6 rounded-xl mb-8">
            <div class="mb-4">
              <h3 class="text-lg font-bold text-gray-800 mb-2">
                Vote Summary : 
                <span
                  :class="{
                    'bg-red-600': fakeVotes > realVotes,
                    'bg-green-600': realVotes > fakeVotes,
                    'bg-gray-500': realVotes === fakeVotes
                  }"
                  class="text-white font-bold px-3 py-1 rounded text-sm uppercase ml-2"
                >
                  {{ fakeVotes > realVotes ? 'FAKE' : realVotes > fakeVotes ? 'REAL' : 'EQUAL' }}
                </span>
              </h3>
            </div>

            <!-- Real Votes Progress Bar -->
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

            <!-- Fake Votes Progress Bar -->
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

            <!-- Total Votes -->
            <div class="text-right border-t pt-3 mt-4">
              <span class="text-sm font-semibold text-gray-800">Total: {{ totalVotes }} Votes</span>
            </div>
          </div>

          <h3 class="text-2xl font-bold mb-4 text-gray-800">Comment :</h3>
                <div v-if="paginatedComments.length > 0">
        <div 
          v-for="comment in paginatedComments" 
          :key="comment.id" 
          class="bg-gray-50 p-4 rounded-lg mb-4 border"
          v-show="comment.text"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span class="text-sm font-bold text-gray-600">{{ comment.user.charAt(0).toUpperCase() }}</span>
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
            <p class="text-gray-700 mb-2">{{ comment.text }}</p>
            <div class="flex items-center text-sm">
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
              <span class="text-gray-600 ml-4">evidence?</span>
            </div>
            <img 
              v-if="comment.image" 
              :src="comment.image" 
              alt="Comment Image" 
              class="mt-4 w-full h-auto rounded-lg max-h-64 object-cover"
            >
          </div>
        </div>
        <Pagination
          :total-items="commentsWithText.length"
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
  </div>
  <div v-else class="container mx-auto p-4 text-center py-20">
    <h1 class="text-2xl font-bold text-gray-500">News not found</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute  } from 'vue-router';
import { useNewsStore } from '../stores/news';
import Pagination from '../components/BasePagination.vue';
import type { Comment } from '../stores/news';

const route = useRoute();
const store = useNewsStore();


const newsId = parseInt(route.params.id as string);
const news = computed(() => store.getNewsById(newsId));

const commentPage = ref<number>(1);
const commentsPerPage = ref<number>(5);
const paginatedComments = computed<Comment[]>(() => {
  if (!news.value) return [];
  const start = (commentPage.value - 1) * commentsPerPage.value;
  const end = start + commentsPerPage.value;
  return commentsWithText.value.slice(start, end);
});


const fakeVotes = computed(() => news.value?.voteSummary?.fake || 0);
const realVotes = computed(() => news.value?.voteSummary?.real || 0);
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


// Calculate percentages
const realPercentage = computed(() => {
  if (totalVotes.value === 0) return 0;
  return Math.round((realVotes.value / totalVotes.value) * 100);
});

const fakePercentage = computed(() => {
  if (totalVotes.value === 0) return 0;
  return Math.round((fakeVotes.value / totalVotes.value) * 100);
});

const activeTab = ref<'comments' | 'vote'>('comments');

// Vote form data
const selectedVote = ref<'fake' | 'real' | null>(null);
const voterName = ref<string>('');
const voterComment = ref<string>('');
const voterImage = ref<string>('');

const commentsWithText = computed(() => 
  news.value ? news.value.comments.filter(c => c.text && c.text.trim().length > 0) : []
);

const submitVote = () => {
  if (!selectedVote.value || !news.value) {
    alert('Please select your vote (Real or Fake)');
    return;
  }
  
  // Add the comment to the news using the correct store method
  store.addCommentToNews(
    newsId,
    voterName.value || 'Anonymous',
    voterComment.value || '',
    voterImage.value || null,
    selectedVote.value
  );
  
  // Reset form
  selectedVote.value = null;
  voterName.value = '';
  voterComment.value = '';
  voterImage.value = '';
  
  // Show success message and switch to comments tab
  alert('Thank you for your vote!');
  activeTab.value = 'comments';
};
</script>