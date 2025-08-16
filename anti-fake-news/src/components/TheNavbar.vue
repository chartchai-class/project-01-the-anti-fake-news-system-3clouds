<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4 relative">

        <router-link to="/" class="flex items-center space-x-3" @click="refreshPage">
          <img src="/logo.png" alt="3Clouds News Logo" class="h-12 w-auto">
        </router-link>

        <router-link to="/" class="absolute left-1/2 -translate-x-1/2" @click="refreshPage">
          <span class="text-4xl font-extrabold text-my-blue hover:text-blue-400 transition-colors duration-200">
            3Clouds News
          </span>
        </router-link>

        <div class="w-8 h-8"></div>

      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const refreshPage = () => {
  if (router.currentRoute.value.path === '/') {
    window.location.reload();
  } else {
    router.push('/');
  }
};
</script>