import { createRouter, createWebHistory } from 'vue-router'
import CampaignView from '@/views/CampaignView.vue'
import Overview from '../views/Overview.vue'
import CampaignList from '@/views/CampaignList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        redirect: '/overview',
    },
    {
        path: '/overview',
        name: 'overview',
        component: Overview,
    },
    {
        path: '/campaigns',
        name: 'campaigns',
        component: CampaignList,
    },
    {
        path: '/campaign/:id',
        name: 'campaign',
        component: CampaignView
    }
  ],
})

export default router
