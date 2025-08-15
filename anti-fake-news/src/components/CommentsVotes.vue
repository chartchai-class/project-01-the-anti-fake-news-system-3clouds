<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Community Discussion</h2>
      <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
        {{ comments.length }} Comments
      </span>
    </div>
    
    <!-- Comments List -->
    <div class="space-y-6">
      <div v-if="paginatedComments.length > 0">
        <div
          v-for="comment in paginatedComments"
          :key="comment.id"
          class="bg-gray-50 rounded-lg p-5 border border-gray-100"
        >
          <div class="flex items-start space-x-4">
            <!-- User Avatar -->
            <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white font-medium text-sm">
                {{ comment.user.charAt(0).toUpperCase() }}
              </span>
            </div>
            
            <div class="flex-1 min-w-0">
              <!-- Comment Header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-semibold text-gray-900">{{ comment.user }}</span>
                  <span 
                    :class="{
                      'bg-green-100 text-green-800': comment.vote === 'real',
                      'bg-red-100 text-red-800': comment.vote === 'fake'
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ comment.vote === 'real' ? '✓ REAL' : '✗ FAKE' }}
                  </span>
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatDate(comment.time) }} at {{ formatTime(comment.time) }}
                </div>
              </div>
              
              <!-- Comment Content -->
              <p class="text-sm text-gray-700 mb-3 leading-relaxed">{{ comment.text }}</p>
              
              <!-- Comment Image -->
              <img
                v-if="comment.image"
                :src="comment.image"
                alt="Supporting evidence"
                class="mt-3 w-full max-w-md h-auto rounded-lg border border-gray-200"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="flex items-center justify-center space-x-2 mt-8" v-if="totalPages > 1">
          <button
            @click="currentPage > 1 && setCurrentPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          <div class="flex space-x-1">
            <button
              v-for="pageNum in displayedPages"
              :key="pageNum"
              @click="setCurrentPage(pageNum)"
              :class="{
                'bg-blue-500 text-white': currentPage === pageNum,
                'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50': currentPage !== pageNum
              }"
              class="w-8 h-8 text-sm rounded transition-colors"
            >
              {{ pageNum }}
            </button>
          </div>
          
          <button
            @click="currentPage < totalPages && setCurrentPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
      </div>
    </div>

    <!-- Filter and Sort Options -->
    <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200" v-if="comments.length > 0">
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium text-gray-700">Filter by vote:</label>
        <select 
          v-model="voteFilter"
          @change="resetPagination"
          class="text-sm border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="">All</option>
          <option value="real">Real votes only</option>
          <option value="fake">Fake votes only</option>
        </select>
      </div>
      
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium text-gray-700">Sort by:</label>
        <select 
          v-model="sortOrder"
          @change="resetPagination"
          class="text-sm border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'
import type { News } from '../stores/news'

// Props
const props = defineProps<{
  comments: News['comments']
}>()

// State
const currentPage = ref<number>(1)
const commentsPerPage = 5
const voteFilter = ref<string>('')
const sortOrder = ref<string>('newest')

// Computed properties
const filteredComments = computed(() => {
  let filtered = [...props.comments]
  
  // Apply vote filter
  if (voteFilter.value) {
    filtered = filtered.filter(comment => comment.vote === voteFilter.value)
  }
  
  // Apply sort
  filtered.sort((a, b) => {
    const dateA = new Date(a.time).getTime()
    const dateB = new Date(b.time).getTime()
    
    if (sortOrder.value === 'newest') {
      return dateB - dateA
    } else {
      return dateA - dateB
    }
  })
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredComments.value.length / commentsPerPage))

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * commentsPerPage
  const end = start + commentsPerPage
  return filteredComments.value.slice(start, end)
})

// Show max 5 page numbers at a time
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 5
  
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(total, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Methods
const setCurrentPage = (page: number) => {
  currentPage.value = page
}

const resetPagination = () => {
  currentPage.value = 1
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>