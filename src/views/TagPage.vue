<script setup lang="ts">
import { computed } from 'vue'
import PostCard from '@/components/PostCard.vue'
import { getPostsByTag } from '@/utils/posts'

const props = defineProps<{ tag: string }>()

const posts = computed(() => getPostsByTag(props.tag))
</script>

<template>
  <div>
    <section class="mb-12">
      <div class="text-sm text-neutral-500 dark:text-neutral-500 mb-4">
        <RouterLink to="/tags" class="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
          ← All tags
        </RouterLink>
      </div>
      <h1 class="text-3xl font-bold tracking-tight mb-2">
        #{{ tag }}
      </h1>
      <p class="text-neutral-500 dark:text-neutral-500">
        {{ posts.length }} post{{ posts.length !== 1 ? 's' : '' }}
      </p>
    </section>

    <div class="divide-y divide-neutral-100 dark:divide-neutral-800/50">
      <PostCard v-for="post in posts" :key="post.slug" :post="post" />
    </div>
  </div>
</template>
