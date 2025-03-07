<template>
    <RouterLink :to="`/campaign/${campaign.id}`">       
        <div class="campaign-tile" @click="goToCampaign">
        <h3>{{ campaign.name }}</h3>
        <p>{{ campaign.description }}</p>
        </div>
    </RouterLink>
</template>
  
<script setup>
  
const props = defineProps({
    campaign: Object,
});
</script>

  