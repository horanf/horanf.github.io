import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomePage.vue'),
      },
      {
        path: 'post/:slug',
        name: 'post',
        component: () => import('@/views/PostPage.vue'),
        props: true,
      },
      {
        path: 'tags',
        name: 'tags',
        component: () => import('@/views/TagsPage.vue'),
      },
      {
        path: 'tags/:tag',
        name: 'tag',
        component: () => import('@/views/TagPage.vue'),
        props: true,
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/AboutPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
