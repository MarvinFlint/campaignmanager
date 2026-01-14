<template>
    <MapList />
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { useAreaStore } from '@/stores/areaStore';
import { useCampaignStore } from '@/stores/campaignStore';
import MapList from '@/components/MapList.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const areaStore = useAreaStore();
const campaignStore = useCampaignStore();

onBeforeMount(async () => {
    await areaStore.fetchArea(route.params.id);
    if (areaStore.currentArea && areaStore.currentArea.campaign_id) {
        await campaignStore.fetchCampaign(areaStore.currentArea.campaign_id);
    }
});


</script>