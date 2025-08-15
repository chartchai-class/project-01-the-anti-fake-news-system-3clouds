<template>
  <div class="bg-gray-100 min-h-screen font-sans antialiased text-gray-800">
    <Navbar />
    <RouterView />
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from './components/TheNavbar.vue';
import ToastNotification from './components/ToastNotification.vue';
</script>