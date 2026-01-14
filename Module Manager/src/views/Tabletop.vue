<template>
    <VTTCanvas />
</template>
<script setup>
import VTTCanvas from '@/components/VTTCanvas.vue';
import { useMapStore } from '@/stores/mapStore';
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

const mapStore = useMapStore();
const route = useRoute();

onBeforeMount(async () => {
    const mapId = route.params.mapId || route.params.id;
    if (mapId) {
        await mapStore.fetchMap(mapId);
    }
});

</script>