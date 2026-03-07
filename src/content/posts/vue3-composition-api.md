---
title: "Getting Started with Vue 3 Composition API"
date: "2026-03-05"
tags: ["vue", "javascript", "frontend"]
description: "An introduction to Vue 3's Composition API and why it changes everything."
---

## The Composition API

Vue 3 introduced the Composition API as a new way to organize component logic. Combined with `<script setup>`, it provides a concise and powerful development experience.

### Reactive State

```typescript
import { computed, ref } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}
```

### Composables

The real power comes from **composables** — reusable logic extracted into functions:

```typescript
import { onMounted, onUnmounted, ref } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

### Why It Matters

- Better **TypeScript** support out of the box
- Logic can be **composed** and **reused** across components
- No more `this` confusion from the Options API
- Tree-shakeable — only import what you use

The Composition API doesn't replace the Options API. It's an additional tool that shines in complex components.
