<script setup lang="ts">
import BegoniaArt from './BegoniaArt.vue'
import ThreeBackground from './ThreeBackground.vue'

defineProps<{
  isDark: boolean
}>()
</script>

<template>
  <ThreeBackground :is-dark="isDark" />
  <BegoniaArt :is-dark="isDark" />
</template>
