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
            <input type="text" v-model="newCampaignName" @keyup.enter="handleEnter" />

            <label for="description">Description:</label>
            <input type="text" v-model="newCampaignDescription" @keyup.enter="handleEnter" />

            <button @click="createCampaign" :disabled="!newCampaignName.trim()">Create</button>
        </div>
    </div>
</template>
  
<script setup>
import { onBeforeMount, ref } from 'vue';
import { useCampaignStore } from '../stores/campaignStore';  
import CampaignTile from './CampaignTile.vue';

onBeforeMount(() => {
    campaignStore.fetchCampaigns();
});

const campaignStore = useCampaignStore();
let showCreateForm = ref(false);
const newCampaignName = ref('');
const newCampaignDescription = ref('');

const createCampaign = () => {
    if (!newCampaignName.value.trim()) return;

    campaignStore.createCampaign({
        name: newCampaignName.value.trim(),
        description: newCampaignDescription.value.trim()
    });

    newCampaignName.value = '';
    newCampaignDescription.value = '';
    showCreateForm.value = false;
};

const handleEnter = () => {
    if (newCampaignName.value.trim()) {
        createCampaign();
    }
};
</script>
  
<style scoped>

</style>
