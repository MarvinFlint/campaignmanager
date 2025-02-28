<template>
    <div>
      <h1>Campaigns</h1>
      <ul>
        <li v-for="campaign in campaigns" :key="campaign.id">
          {{ campaign.name }}
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
    })
    const campaigns = campaignStore.campaigns;
     
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>