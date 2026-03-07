<script setup lang="ts">
import { computed } from 'vue'
import { getAllTags, getPostsByTag } from '@/utils/posts'

const tags = computed(() =>
  getAllTags().map((tag) => ({
    name: tag,
    count: getPostsByTag(tag).length,
  }))
)
</script>

<template>
  <div>
    <section class="mb-12">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Tags</h1>
      <p class="text-neutral-500 dark:text-neutral-500">Browse posts by topic.</p>
    </section>

    <div class="flex flex-wrap gap-3">
      <RouterLink
        v-for="tag in tags"
        :key="tag.name"
        :to="`/tags/${tag.name}`"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
      >
        <span>{{ tag.name }}</span>
        <span class="text-xs text-neutral-400 dark:text-neutral-500">{{ tag.count }}</span>
      </RouterLink>
    </div>

    <div v-if="tags.length === 0" class="text-center py-20 text-neutral-400">
      <p>No tags yet.</p>
    </div>
  </div>
</template>
