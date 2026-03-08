<script setup lang="ts">
import { BegoniaTheme } from '@horanf/begonia-theme'
import '@horanf/begonia-theme/style.css'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import FooterBar from '@/components/FooterBar.vue'
import NavBar from '@/components/NavBar.vue'

const { isDark } = storeToRefs(useThemeStore())
</script>

<template>
  <BegoniaTheme :is-dark="isDark" />
  <div class="min-h-screen flex flex-col text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
    <NavBar />
    <main class="flex-1 w-full max-w-3xl mx-auto px-6 py-12 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-sm">
      <RouterView />
    </main>
    <FooterBar />
  </div>
</template>
