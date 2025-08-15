<template>
  <div class="bg-gray-100 min-h-screen font-sans antialiased text-gray-800">
    <Navbar />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from './components/TheNavbar.vue';
</script>