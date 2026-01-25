<template>
    <div class="campaign-list-container list-container">
        <ul class="campaign-list item-list" aria-label="Campaigns">
            <li class="create-campaign">
                <button
                    class="create-no-focus create-button"
                    v-if="!showCreateForm"
                    @click="showCreateForm = true"
                    type="button"
                >
                    <span>Click to add new campaign</span>
                    <span>+</span>
                </button>
                <div class="create-focus" v-if="showCreateForm">
                    <div>
                        <label for="name">Name:</label>
                        <input id="name" type="text" v-model="newCampaignName" @keyup.enter="handleEnter" />
                    </div>
                    <div>
                        <label for="description">Description:</label>
                        <input id="description" type="text" v-model="newCampaignDescription" @keyup.enter="handleEnter" />
                    </div>
                    <button class="default-button" aria-label="Create campaign" @click="createCampaign" :disabled="!newCampaignName.trim()">Create</button>
                </div>
            </li>
            <li v-for="campaign in campaignStore.campaigns" :key="campaign.id">
                <CampaignTile :campaign="campaign" />
            </li>            
        </ul>
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
