<template>
    <div class="campaign-wrapper" v-if="campaignStore.currentCampaign">
        <h1>{{ campaignStore.currentCampaign.name }}</h1>

        <!-- Tabs Navigation -->
        <div class="tabs">
            <button v-for="tab in tabs" :key="tab.name"
                :class="{ active: activeTab === tab.name }"
                @click="activeTab = tab.name">
                {{ tab.label }}
            </button>
        </div>

        <!-- Tabs Content -->
        <div class="tab-content">
            <component :is="activeTabComponent" />
        </div>
    </div>

    <div v-else>
        <p>Loading campaign details...</p>
    </div>
</template>

<script setup>
import { onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCampaignStore } from '../stores/campaignStore';  

import CampaignAreas from './CampaignAreas.vue';
import CampaignCharacters from './CampaignCharacters.vue';
import CampaignDetails from './CampaignDetails.vue';

const campaignStore = useCampaignStore();
const route = useRoute();
const activeTab = ref('details');

const tabs = [
    { name: 'overview', label: 'Overview', component: CampaignDetails },
    { name: 'areas', label: 'Areas', component: CampaignAreas },
    { name: 'characters', label: 'Characters', component: CampaignCharacters }
];

onBeforeMount(() => {
    campaignStore.fetchCampaign(route.params.id);
});

// Optional: Watch for route changes and refetch data
watch(() => route.params.id, (newId) => {
    campaignStore.fetchCampaign(newId);
});
</script>