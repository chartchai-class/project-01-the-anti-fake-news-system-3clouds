<template>
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4 text-gray-800">Cast Your Vote</h2>
    
    <!-- Vote Summary Display -->
    <div class="mb-6">
      <div class="flex items-center mb-3">
        <span class="text-sm font-medium mr-3">Current Status:</span>
        <span 
          :class="{
            'bg-red-100 text-red-800': news.status === 'fake',
            'bg-green-100 text-green-800': news.status === 'not fake',
            'bg-gray-100 text-gray-800': news.status === 'equal'
          }"
          class="px-3 py-1 rounded-full text-sm font-medium uppercase"
        >
          {{ 
            news.status === 'fake' ? 'FAKE NEWS' : 
            news.status === 'not fake' ? 'REAL NEWS' : 'UNDECIDED' 
          }}
        </span>
      </div>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-red-600">{{ news.voteSummary.fake }}</div>
          <div class="text-sm text-gray-600">Fake Votes</div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              :style="{ width: `${fakePercentage}%` }"
              class="bg-red-400 h-2 rounded-full"
            ></div>
          </div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ news.voteSummary.real }}</div>
          <div class="text-sm text-gray-600">Real Votes</div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              :style="{ width: `${realPercentage}%` }"
              class="bg-green-400 h-2 rounded-full"
            ></div>
          </div>
        </div>
      </div>
      
      <div class="text-center text-sm text-gray-600">
        Total: {{ totalVotes }} Votes
      </div>
    </div>

    <!-- Vote Form -->
    <div class="bg-white rounded-lg p-4 border border-gray-200">
      <h3 class="text-lg font-medium mb-4 text-gray-800">Add Your Vote & Comment</h3>
      
      <div class="space-y-4">
        <!-- User Info Row -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            v-model="userName"
            type="text"
            placeholder="Enter your name"
            :class="{'border-red-500': showValidation && !userName}"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Vote Selection -->
        <div class="flex space-x-4">
          <button
            @click="vote = 'real'"
            :class="{
              'bg-green-500 text-white border-green-500': vote === 'real',
              'bg-white text-green-600 border-green-300 hover:bg-green-50': vote !== 'real'
            }"
            class="flex-1 py-3 px-4 border-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>REAL</span>
          </button>
          <button
            @click="vote = 'fake'"
            :class="{
              'bg-red-500 text-white border-red-500': vote === 'fake',
              'bg-white text-red-600 border-red-300 hover:bg-red-50': vote !== 'fake'
            }"
            class="flex-1 py-3 px-4 border-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            <span>FAKE</span>
          </button>
        </div>

        <!-- Comment Text -->
        <textarea
          v-model="commentText"
          placeholder="Write your comment and explain your reasoning..."
          rows="4"
          :class="{'border-red-500': showValidation && !commentText}"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <!-- Optional Image URL -->
        <input
          v-model="imageUrl"
          type="url"
          placeholder="Optional: Add an image URL to support your argument"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <!-- Validation Error -->
        <div v-if="showValidation && (!vote || !userName || !commentText)" class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          <span class="font-medium">Please complete all required fields:</span>
          <ul class="mt-1 list-disc list-inside">
            <li v-if="!vote">Select your vote (Real or Fake)</li>
            <li v-if="!userName">Enter your name</li>
            <li v-if="!commentText">Write a comment</li>
          </ul>
        </div>
        
        <!-- Submit Button -->
        <button
          @click="submitComment"
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit Vote & Comment</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import type { News } from '../stores/news'

// Props
const props = defineProps<{
  news: News
}>()

// Emits
const emit = defineEmits<{
  submitVote: [data: {
    userName: string
    vote: 'real' | 'fake'
    commentText: string
    imageUrl: string | null
  }]
}>()

// Vote form state
const userName = ref<string>('')
const vote = ref<'real' | 'fake' | ''>('')
const commentText = ref<string>('')
const imageUrl = ref<string>('')
const showValidation = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)

// Computed properties
const totalVotes = computed(() => props.news.voteSummary.real + props.news.voteSummary.fake)
const fakePercentage = computed(() => 
  totalVotes.value > 0 ? (props.news.voteSummary.fake / totalVotes.value) * 100 : 0
)
const realPercentage = computed(() => 
  totalVotes.value > 0 ? (props.news.voteSummary.real / totalVotes.value) * 100 : 0
)

// Methods
const submitComment = async () => {
  showValidation.value = true
  
  if (!vote.value || !userName.value || !commentText.value) {
    return
  }
  
  try {
    isSubmitting.value = true
    
    // Emit the vote data to parent component
    emit('submitVote', {
      userName: userName.value,
      vote: vote.value,
      commentText: commentText.value,
      imageUrl: imageUrl.value || null
    })
    
    // Reset form
    userName.value = ''
    vote.value = ''
    commentText.value = ''
    imageUrl.value = ''
    showValidation.value = false
    
    alert('Your vote and comment have been submitted successfully!')
    
  } catch (error) {
    console.error('Error submitting comment:', error)
    alert('An error occurred while submitting your comment. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>