<template>
  <div class="bg-gray-100 min-h-screen font-sans antialiased text-gray-800">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
// We are using Vue's built-in <RouterView> component, 
// so no need to import it here.
import { RouterView } from 'vue-router';
</script>

<style scoped>
/* You can add global styles here, or leave it empty if using Tailwind. */
</style>