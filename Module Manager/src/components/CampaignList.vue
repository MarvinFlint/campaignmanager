<template>
    <div class="campaign-list-container">
        <ul class="campaign-list">
            <li v-for="campaign in campaignStore.campaigns" :key="campaign.id">
                <CampaignTile :campaign="campaign" />
            </li>
        </ul>
        <div class="create-campaign" @click="showCreateForm = true">
            +
        </div>
    </div>

    <div v-if="showCreateForm" class="create-campaign-wrapper">
        <div class="create-campaign-form">
            <div class="close" @click="showCreateForm = false">
                X
            </div>
            <h2>Create Campaign</h2>
            <label for="name">Name:</label>
            <input type="text" v-model="newCampaignName" />
            <label for="description">Description:</label>
            <input type="text" v-model="newCampaignDescription" />
            <button @click="createCampaign()">Create</button>
        </div>
    </div>
</template>
  
<script setup>
import { onBeforeMount, ref } from 'vue';
import { useCampaignStore } from '../stores/campaignStore';  
import CampaignTile from './CampaignTile.vue';

const campaignStore = useCampaignStore();
let showCreateForm = ref(false);

const newCampaignName = ref('');
const newCampaignDescription = ref('');
const createCampaign = () => {
    campaignStore.createCampaign({
        name: newCampaignName.value,
        description: newCampaignDescription.value,
    });
    showCreateForm.value = false;
};

onBeforeMount(() => {
    campaignStore.fetchCampaigns();
});
</script>
  
<style scoped>

</style>
