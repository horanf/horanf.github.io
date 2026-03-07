<script setup lang="ts">
import type { PostMeta } from '@/types/post'

defineProps<{ post: PostMeta }>()

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <article class="group">
    <RouterLink :to="`/post/${post.slug}`" class="block py-6 -mx-4 px-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
      <div class="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500 mb-2">
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        <span v-if="post.tags.length">&middot;</span>
        <div class="flex gap-1.5">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      <h2 class="text-lg font-medium group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
        {{ post.title }}
      </h2>
      <p class="mt-1.5 text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
        {{ post.description }}
      </p>
    </RouterLink>
  </article>
</template>
