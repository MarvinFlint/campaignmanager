<template>
    <div v-if="campaignStore.currentCampaign">
        <h1>{{ campaignStore.currentCampaign.name }}</h1>
        <p>{{ campaignStore.currentCampaign.description }}</p>
        <p><strong>Created At:</strong> {{ campaignStore.currentCampaign.created_at }}</p>
    </div>
    <div v-else>
        <p>Loading campaign details...</p>
    </div>
</template>

<script setup>
import { onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCampaignStore } from '../stores/campaignStore';  

const campaignStore = useCampaignStore();
const route = useRoute();

onBeforeMount(() => {
    campaignStore.fetchCampaign(route.params.id);
});

// Optional: Watch for route changes and refetch data
watch(() => route.params.id, (newId) => {
    campaignStore.fetchCampaign(newId);
});
</script>