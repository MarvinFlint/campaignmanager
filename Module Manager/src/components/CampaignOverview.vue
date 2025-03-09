<template>
    <div class="campaign-wrapper" v-if="campaignStore.currentCampaign">
        <h1>{{ campaignStore.currentCampaign.name }}</h1>
        <div class="tabs">
            <div class="tab" v-for="tab in tabs" :key="tab.name"
                :class="{ active: activeTab === tab.name }"
                @click="activeTab = tab.name">
                {{ tab.label }}
        </div>
        </div>
        <div class="tab-content">
            <component :is="activeTabComponent" :campaign="campaignStore.currentCampaign"/>
        </div>
    </div>

    <div v-else>
        <p>Loading campaign details...</p>
    </div>
</template>

<script setup>
import { onBeforeMount, watch, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCampaignStore } from '../stores/campaignStore';  

import CampaignAreas from './CampaignAreas.vue';
import CampaignCharacters from './CampaignCharacters.vue';
import CampaignDetails from './CampaignDetails.vue';

const campaignStore = useCampaignStore();
const route = useRoute();
const activeTab = ref('details');

const activeTabComponent = computed(() => {
    const tab = tabs.find((tab) => tab.name === activeTab.value);
    return tab ? tab.component : null;
});

const tabs = [
    { name: 'details', label: 'Details', component: CampaignDetails },
    { name: 'areas', label: 'Areas', component: CampaignAreas },
    { name: 'characters', label: 'Characters', component: CampaignCharacters }
];

onBeforeMount(() => {
    campaignStore.fetchCampaign(route.params.id);
});

watch(() => route.params.id, (newId) => {
    campaignStore.fetchCampaign(newId);
});
</script>