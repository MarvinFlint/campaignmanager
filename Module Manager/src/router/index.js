import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CampaignView from '@/views/CampaignView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/campaign/:id',
      name: 'campaign',
      component: CampaignView
    }
  ],
})

export default router
