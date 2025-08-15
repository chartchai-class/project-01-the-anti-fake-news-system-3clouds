<template>
    <div ref="commentsSection">
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
        <div v-if="paginatedComments.length > 0">
            <div 
                v-for="comment in paginatedComments" 
                :key="comment.id" 
                class="bg-gray-50 p-4 rounded-lg mb-4 border"
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
                    >
                </div>
            </div>
            <Pagination
                :total-items="commentsWithContent.length"
                :items-per-page="commentsPerPage"
                :current-page="commentPage"
                @page-changed="commentPage = $event"
                class="mt-6"
            />
        </div>
        <p v-else class="text-gray-500 italic">No comments yet.</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, watch } from 'vue'; // เพิ่ม watch เข้ามา
import Pagination from './BasePagination.vue';
import type { Comment, VoteSummary } from '../stores/news';

const props = defineProps<{
    comments: Comment[];
    voteSummary: VoteSummary;
}>();

const commentsSection = ref<HTMLElement | null>(null);
const commentPage = ref<number>(1);
const commentsPerPage = ref<number>(3);

// Watcher ที่จะตรวจสอบการเปลี่ยนแปลงของ commentPage
watch(commentPage, () => {
    // ใช้ setTimeout เพื่อรอให้ DOM อัปเดตก่อนทำการเลื่อน
    setTimeout(() => {
        if (commentsSection.value) {
            commentsSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
});

const commentsWithContent = computed(() => 
    props.comments.filter(c => 
        (c.text && c.text.trim().length > 0) || (c.image && c.image.trim().length > 0)
    )
);

const paginatedComments = computed<Comment[]>(() => {
    const start = (commentPage.value - 1) * commentsPerPage.value;
    const end = start + commentsPerPage.value;
    return commentsWithContent.value.slice(start, end);
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