import { createRouter, createWebHistory } from 'vue-router'
import CampaignView from '@/views/CampaignView.vue'
import Overview from '../views/Overview.vue'
import CampaignList from '@/views/CampaignList.vue'
import AreaView from '@/views/AreaView.vue'
import MapView from '@/views/MapView.vue'
import CharacterView from '@/views/CharacterView.vue'
import Resources from '@/views/Resources.vue'
import Tabletop from '@/views/Tabletop.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        redirect: '/campaigns',
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
    },
    {
        path: '/area/:id',
        name: 'area',
        component: AreaView
    },
    {
        path: '/map/:id',
        name: 'map',
        component: MapView
    },
    {
        path: '/character/:id',
        name: 'character',
        component: CharacterView
    },
    {
        path: '/tabletop/:mapId',
        name: 'tabletop',
        component: Tabletop,
        props: true
    },
    {
        path: '/resources',
        name: 'resources',
        component: Resources
    }
  ],
})

export default router
