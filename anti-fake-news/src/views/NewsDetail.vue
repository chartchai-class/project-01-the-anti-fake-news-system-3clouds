<template>
  <div v-if="news" class="container mx-auto p-4 max-w-4xl">
    <router-link to="/" class="text-blue-600 hover:underline mb-4 inline-block font-medium"
      >&lt; Back to Home</router-link
    >

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
          <p>
            Reporter: <span class="font-semibold">{{ news.reporter }}</span>
          </p>
          <p>
            Date:
            <span class="font-semibold">{{ new Date(news.dateTime).toLocaleDateString() }}</span>
          </p>
        </div>

        <img
          v-if="news.image && (news.image.startsWith('http') || news.image.startsWith('https'))"
          :src="news.image"
          :alt="news.topic"
          class="w-full h-auto rounded-lg mb-8"
        />

        <!-- Buttons Row -->
        <div class="flex justify-end space-x-3 mb-6">
          <button
            @click="scrollToComments"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-5 rounded-lg shadow"
          >
            View Comments & Votes
          </button>
          <button
            @click="goToVotePage"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-5 rounded-lg shadow"
          >
            Vote
          </button>
        </div>

        <p class="font-bold text-black-700">Full Detail :</p>
        <p class="text-lg text-gray-800 leading-relaxed mb-10 whitespace-pre-line">
          {{ news.fullDetail }}
        </p>
        <h3 class="text-2xl font-bold mb-4 text-gray-800">All Comments & Votes</h3>
        <div class="bg-gray-100 p-6 rounded-xl mb-8">
          <h3 class="font-bold mb-4 text-gray-800">
            Vote Summary : {{ news.status === 'fake' ? 'Fake News' : 'Not Fake' }}
          </h3>
          <div class="flex items-center mb-4 space-x-2">
            <p class="font-medium text-gray-700">Vote:</p>
          </div>
        </div>

        <h3 class="text-2xl font-bold mb-4 text-gray-800">Comments ({{ news.comments.length }})</h3>
        <div v-if="paginatedComments.length > 0">
          <div
            v-for="comment in paginatedComments"
            :key="comment.id"
            class="bg-gray-50 p-4 rounded-lg mb-4 border"
          >
            <div class="flex justify-between items-center mb-2">
              <p class="font-bold text-gray-800">{{ comment.user }}</p>
              <span
                :class="{
                  'text-green-600': comment.vote === 'real',
                  'text-red-600': comment.vote === 'fake',
                }"
                class="font-semibold"
              >
                Vote: {{ comment.vote === 'real' ? 'Not Fake' : 'Fake' }}
              </span>
            </div>
            <p class="text-gray-700">{{ comment.text }}</p>
            <img
              v-if="comment.image"
              :src="comment.image"
              alt="Comment Image"
              class="mt-4 w-full h-auto rounded-lg max-h-64 object-cover"
            />
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '../stores/news'
import Pagination from '../components/BasePagination.vue'
import type { Comment } from '../stores/news'
const route = useRoute()
const store = useNewsStore()
const router = useRouter()

const goToVotePage = () => {
  router.push({ name: 'VotePage', params: { id: newsId } })
}

const newsId = parseInt(route.params.id as string)
const news = computed(() => store.getNewsById(newsId))

const commentPage = ref<number>(1)
const commentsPerPage = ref<number>(5)
const paginatedComments = computed<Comment[]>(() => {
  if (!news.value) return []
  const start = (commentPage.value - 1) * commentsPerPage.value
  const end = start + commentsPerPage.value
  return news.value.comments.slice(start, end)
})

const voteSection = ref<HTMLElement | null>(null)

const scrollToComments = () => {
  voteSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>
