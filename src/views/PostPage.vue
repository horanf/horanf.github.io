<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { getPostBySlug } from '@/utils/posts'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{ slug: string }>()

const post = getPostBySlug(props.slug)
const renderedContent = ref('')

watchEffect(async () => {
  if (post) {
    renderedContent.value = await renderMarkdown(post.content)
  }
})

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div v-if="post">
    <header class="mb-10">
      <div class="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500 mb-4">
        <RouterLink to="/" class="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
          ← Back
        </RouterLink>
        <span>&middot;</span>
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      </div>
      <h1 class="text-3xl font-bold tracking-tight mb-3">{{ post.title }}</h1>
      <p class="text-neutral-500 dark:text-neutral-500">{{ post.description }}</p>
      <div class="flex gap-2 mt-4">
        <RouterLink
          v-for="tag in post.tags"
          :key="tag"
          :to="`/tags/${tag}`"
          class="text-xs px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          {{ tag }}
        </RouterLink>
      </div>
    </header>

    <article class="prose dark:prose-invert max-w-none" v-html="renderedContent" />
  </div>

  <div v-else class="text-center py-20">
    <h1 class="text-2xl font-bold mb-2">Post not found</h1>
    <p class="text-neutral-500 mb-6">The post you're looking for doesn't exist.</p>
    <RouterLink to="/" class="text-sm underline underline-offset-4 hover:text-neutral-600 dark:hover:text-neutral-400">
      ← Go back home
    </RouterLink>
  </div>
</template>
