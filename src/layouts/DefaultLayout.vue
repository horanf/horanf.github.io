<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-300">
    <NavBar />
    <main class="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
      <RouterView />
    </main>
    <FooterBar />
  </div>
</template>
