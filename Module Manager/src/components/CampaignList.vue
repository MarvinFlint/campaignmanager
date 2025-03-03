<template>
    <div>
      <h1>Campaigns</h1>
      <ul>
        <li v-for="campaign in campaignStore.campaigns" :key="campaign.id">
            <router-link :to="`/campaign/${campaign.id}`">
                {{ campaign.name }}
            </router-link>
        </li>
      </ul>
    </div>
    <div v-if="showCreatePanel" class="create-panel">
      <h2>Create New Campaign</h2>
      <form @submit.prevent="createCampaign">
        <label>
          Name:
          <input v-model="newCampaign.name" required />
        </label>
        <label>
          Description:
          <textarea v-model="newCampaign.description"></textarea>
        </label>
        <button type="submit">Create</button>
        <button @click="showCreatePanel = false" type="button">Cancel</button>
      </form>
    </div>
</template>
  
<script setup>
import { onBeforeMount } from 'vue';
import { useCampaignStore } from '../stores/campaignStore';  

const campaignStore = useCampaignStore();

onBeforeMount(() => {
    campaignStore.fetchCampaigns();
});

const createCampaign = async () => {
  await campaignStore.createCampaign(newCampaign.value);
  showCreatePanel.value = false; // Close panel after creation
  newCampaign.value = { name: '', description: '' }; // Reset form
};
</script>
  
<style scoped>

</style>
