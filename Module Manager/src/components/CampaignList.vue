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
</template>
  
<script setup>
import { onBeforeMount } from 'vue';
import { useCampaignStore } from '../stores/campaignStore';  

const campaignStore = useCampaignStore();

onBeforeMount(() => {
    campaignStore.fetchCampaigns();
});
</script>
  
<style scoped>

</style>
