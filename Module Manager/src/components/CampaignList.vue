<template>
    <div>
        <h1>Campaigns</h1>    
        <li v-for="campaign in campaignStore.campaigns" :key="campaign.id">
            <CampaignTile :campaign="campaign" />
        </li>
    </div>
    <div class="create-campaign" @click="showCreateForm = true">
        +
    </div>
    <div v-if="showCreateForm">
        <h2>Create Campaign</h2>
        <input type="text" v-model="newCampaignName" />
        <button @click="createCampaign()">Create</button>
    </div>
</template>
  
<script setup>
import { onBeforeMount, ref } from 'vue';
import { useCampaignStore } from '../stores/campaignStore';  
import CampaignTile from './CampaignTile.vue';

const campaignStore = useCampaignStore();
let showCreateForm = ref(false);

onBeforeMount(() => {
    campaignStore.fetchCampaigns();
});
</script>
  
<style scoped>

</style>
