import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import NewsDetail from '../views/NewsDetail.vue'
import VotePage from '@/views/VotePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: NewsDetail,
    },
    {
      path: '/vote/:id',
      name: 'VotePage',
      component: VotePage,
},
  ],
})

export default router