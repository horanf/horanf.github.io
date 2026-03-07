<script setup lang="ts">
import { computed } from 'vue'
import { getPosts } from '@/utils/posts'
import PostCard from '@/components/PostCard.vue'

const posts = computed(() => getPosts())
</script>

<template>
  <div>
    <section class="mb-12">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Blog</h1>
      <p class="text-neutral-500 dark:text-neutral-500">Thoughts, ideas, and stories.</p>
    </section>

    <div class="divide-y divide-neutral-100 dark:divide-neutral-800/50">
      <PostCard v-for="post in posts" :key="post.slug" :post="post" />
    </div>

    <div v-if="posts.length === 0" class="text-center py-20 text-neutral-400">
      <p>No posts yet.</p>
    </div>
  </div>
</template>
