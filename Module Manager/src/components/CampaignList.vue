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

const campaignStore = useCampaignStore();
let showCreateForm = ref(false);

onBeforeMount(() => {
    campaignStore.fetchCampaigns();
});

function setCreateFormVisibility() {
    console.log('setCreateFormVisibility');
    showCreateForm = !showCreateForm;    
    console.log(showCreateForm);
}
</script>
  
<style scoped>

</style>
