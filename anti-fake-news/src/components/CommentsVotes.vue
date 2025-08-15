<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Tab Headers -->
    <div class="flex mb-6">
      <button
        @click="activeTab = 'comments'"
        :class="{
          'bg-gray-100 text-gray-700 border-gray-300': activeTab === 'comments',
          'bg-white text-gray-500 border-gray-200': activeTab !== 'comments'
        }"
        class="px-4 py-2 text-sm font-medium rounded-l-md border transition-colors"
      >
        View Comments & Votes
      </button>
      <button
        @click="activeTab = 'votes'"
        :class="{
          'bg-gray-100 text-gray-700 border-gray-300': activeTab === 'votes',
          'bg-white text-gray-500 border-gray-200': activeTab !== 'votes'
        }"
        class="px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b transition-colors"
      >
        Votes
      </button>
    </div>

    <!-- Comments Tab Content -->
    <div v-if="activeTab === 'comments'">
      <h2 class="text-xl font-semibold mb-4">All Comments & Votes</h2>
      
      <!-- Vote Summary -->
      <div class="mb-6">
        <div class="flex items-center mb-2">
          <span class="text-sm font-medium mr-2">Vote Summary:</span>
          <span 
            :class="{
              'bg-red-100 text-red-800': news.status === 'fake',
              'bg-green-100 text-green-800': news.status === 'not fake',
              'bg-gray-100 text-gray-800': news.status === 'equal'
            }"
            class="px-2 py-1 rounded text-xs font-medium uppercase"
          >
            {{ 
              news.status === 'fake' ? 'FAKE' : 
              news.status === 'not fake' ? 'REAL' : 'EQUAL' 
            }}
          </span>
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center">
            <span class="text-sm text-gray-600 w-12">Fake</span>
            <div class="flex-1 mx-3">
              <div class="w-full bg-gray-200 rounded-full h-6 relative">
                <div 
                  :style="{ width: `${fakePercentage}%` }"
                  class="bg-red-400 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                >
                  <span v-if="news.voteSummary.fake > 0">
                    {{ news.voteSummary.fake }} votes
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center">
            <span class="text-sm text-gray-600 w-12">Real</span>
            <div class="flex-1 mx-3">
              <div class="w-full bg-gray-200 rounded-full h-6 relative">
                <div 
                  :style="{ width: `${realPercentage}%` }"
                  class="bg-green-400 h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                >
                  <span v-if="news.voteSummary.real > 0">
                    {{ news.voteSummary.real }} votes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-2 text-right">
          <span class="text-sm text-gray-600">
            Total: {{ totalVotes }} Votes
          </span>
        </div>
      </div>

      <!-- Comments List -->
      <div>
        <h3 class="text-lg font-medium mb-4">Comments ({{ news.comments.length }}):</h3>
        <div class="space-y-4">
          <div v-if="paginatedComments.length > 0">
            <div
              v-for="comment in paginatedComments"
              :key="comment.id"
              class="bg-gray-50 rounded-lg p-4"
            >
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-sm font-medium text-gray-900">{{ comment.user }}</span>
                    <div class="text-xs text-gray-500">
                      <span class="mr-4">{{ formatDate(comment.time) }}</span>
                      <span>{{ formatTime(comment.time) }}</span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700 mb-2">{{ comment.text }}</p>
                  <img
                    v-if="comment.image"
                    :src="comment.image"
                    alt="Comment Image"
                    class="mt-2 w-full h-auto rounded-lg max-h-64 object-cover"
                  />
                  <div class="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                    <span 
                      :class="{
                        'text-green-600': comment.vote === 'real',
                        'text-red-600': comment.vote === 'fake'
                      }"
                      class="font-medium"
                    >
                      Vote: {{ comment.vote === 'real' ? 'Real' : 'Fake' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
            <div class="flex items-center justify-center space-x-2 mt-6">
              <button
                @click="currentPage > 1 && setCurrentPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-2 py-1 text-sm text-gray-600 disabled:text-gray-300"
              >
                ‹ prev
              </button>
              
              <button
                v-for="pageNum in totalPages"
                :key="pageNum"
                @click="setCurrentPage(pageNum)"
                :class="{
                  'bg-blue-500 text-white': currentPage === pageNum,
                  'bg-white text-gray-600 border': currentPage !== pageNum
                }"
                class="w-8 h-8 text-sm rounded"
              >
                {{ pageNum }}
              </button>
              
              <button
                @click="currentPage < totalPages && setCurrentPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-2 py-1 text-sm text-gray-600 disabled:text-gray-300"
              >
                next ›
              </button>
            </div>
          </div>
          <p v-else class="text-gray-500 italic text-center py-8">No comments yet.</p>
        </div>
      </div>
    </div>

    <!-- Votes Tab Content - Vote Form -->
    <div v-if="activeTab === 'votes'" class="py-6">
      <h2 class="text-xl font-semibold mb-6">Cast Your Vote</h2>
      
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            v-model="userName"
            type="text"
            placeholder="enter your name"
            :class="{'border-red-500': showValidation && !userName}"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div class="relative">
            <select 
              v-model="vote"
              :class="{'border-red-500': showValidation && !vote}"
              class="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">vote</option>
              <option value="real">Real</option>
              <option value="fake">Fake</option>
            </select>
            <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <textarea
          v-model="commentText"
          placeholder="write an comment..."
          rows="4"
          :class="{'border-red-500': showValidation && !commentText}"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          v-model="imageUrl"
          type="url"
          placeholder="enter an image url"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <!-- Validation error message -->
        <div v-if="showValidation && (!vote || !userName || !commentText)" class="text-red-600 text-sm">
          <span class="font-medium">กรุณากรอกข้อมูลให้ครบถ้วน:</span>
          <span v-if="!vote"> เลือกการโหวต</span>
          <span v-if="!userName">, ใส่ชื่อผู้ใช้</span>
          <span v-if="!commentText">, เขียนความคิดเห็น</span>
        </div>
        
        <button
          @click="submitComment"
          :disabled="isSubmitting"
          class="bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">กำลังส่ง...</span>
          <span v-else>Submit</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'
import { useNewsStore } from '../stores/news'
import type { News } from '../stores/news'

// Props
const props = defineProps<{
  news: News
  newsId: number
}>()

const store = useNewsStore()

// Tab state
const activeTab = ref<'comments' | 'votes'>('comments')

// Vote form state
const userName = ref<string>('')
const vote = ref<'real' | 'fake' | ''>('')
const commentText = ref<string>('')
const imageUrl = ref<string>('')
const showValidation = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)

// Pagination state
const currentPage = ref<number>(1)
const commentsPerPage = 3

// Computed properties
const totalVotes = computed(() => props.news.voteSummary.real + props.news.voteSummary.fake)
const fakePercentage = computed(() => 
  totalVotes.value > 0 ? (props.news.voteSummary.fake / totalVotes.value) * 100 : 0
)
const realPercentage = computed(() => 
  totalVotes.value > 0 ? (props.news.voteSummary.real / totalVotes.value) * 100 : 0
)

const totalPages = computed(() => Math.ceil(props.news.comments.length / commentsPerPage))
const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * commentsPerPage
  const end = start + commentsPerPage
  return props.news.comments.slice(start, end)
})

// Methods
const setCurrentPage = (page: number) => {
  currentPage.value = page
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('th-TH')
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const submitComment = async () => {
  showValidation.value = true
  
  if (!vote.value || !userName.value || !commentText.value) {
    return
  }
  
  try {
    isSubmitting.value = true
    
    // Add comment to store
    store.addCommentToNews(
      props.newsId,
      userName.value,
      commentText.value,
      imageUrl.value || null,
      vote.value
    )
    
    // Reset form
    userName.value = ''
    vote.value = ''
    commentText.value = ''
    imageUrl.value = ''
    showValidation.value = false
    
    // Switch back to comments tab to show the new comment
    activeTab.value = 'comments'
    
    // Go to last page to show the new comment
    currentPage.value = Math.ceil((props.news.comments.length + 1) / commentsPerPage)
    
    alert('ส่งความคิดเห็นเรียบร้อยแล้ว!')
    
  } catch (error) {
    console.error('Error submitting comment:', error)
    alert('เกิดข้อผิดพลาดในการส่งความคิดเห็น กรุณาลองใหม่อีกครั้ง')
  } finally {
    isSubmitting.value = false
  }
}
</script>