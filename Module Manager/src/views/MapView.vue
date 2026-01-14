<template>
    <MapDetails />
</template>

<script setup>
import { onBeforeMount, watch } from 'vue';
import MapDetails from '@/components/MapDetails.vue';
import { useRoute } from 'vue-router';
import { useMapStore } from '@/stores/mapStore';

const route = useRoute();
const mapStore = useMapStore();

async function loadMap(id) {
    // Clear currentMap immediately so UI/reactive watchers know there's no image
    mapStore.currentMap = null;
    await mapStore.fetchMap(id);
}

onBeforeMount(async () => {
    await loadMap(route.params.id);
});

// Watch for route changes to clear and fetch the new map
watch(() => route.params.id, (newId) => {
    if (newId) loadMap(newId);
});

</script>