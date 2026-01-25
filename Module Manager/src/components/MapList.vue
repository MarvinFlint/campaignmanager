<template>
    <div class="map-list-wrapper list-wrapper">
        <button class="tab back-tab" @click="goBack" aria-label="Back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
        <h1>{{ campaignStore.currentCampaign?.name }}</h1>
        <h2>{{ areaStore.currentArea?.name }}</h2>
        <ul class="item-list">
            <template v-if="loading">
                <li class="loading">
                    <div class="spinner" role="status" aria-hidden="true"></div>
                    <span class="sr-only">Loading maps...</span>
                </li>
            </template>
            <template v-else>
                <li class="create-map">
                    <button
                        class="create-no-focus"
                        v-if="!showCreateForm"
                        @click="showCreateForm = true"
                        type="button"
                    >
                        <span>Click to add new map</span>
                        <span>+</span>
                    </button>
                    <div class="create-focus" v-if="showCreateForm">
                        <div>
                            <label for="map-name">Name:</label>
                            <input id="map-name" name="map-name" type="text" v-model="newMapName" @keyup.enter="createMap" />
                        </div>
                        <div>
                            <label for="map-description">Description:</label>
                            <input id="map-description" name="map-description" type="text" v-model="newMapDescription" @keyup.enter="createMap" />
                        </div>
                        <div>
                            <label for="map-image">Image:</label>
                            <input id="map-image" name="map-image" type="file" accept="image/*" @change="onFileChange" />
                        </div>
                        <button  class="default-button" aria-label="Create map" @click="createMap" :disabled="!newMapName.trim()">Create</button>
                    </div>
                </li>
                <li v-for="map in mapStore.maps" :key="map.id">
                    <MapTile :map="map" />
                </li>
            </template>
        </ul>
    </div>
</template>
<script setup>

import { onBeforeMount, ref } from 'vue';
import { useMapStore } from '@/stores/mapStore';
import { useCampaignStore } from '@/stores/campaignStore';
import { useAreaStore } from '@/stores/areaStore';
import { useRoute, useRouter } from 'vue-router';
import MapTile from './MapTile.vue';

const route = useRoute();
const router = useRouter();
const mapStore = useMapStore();
const campaignStore = useCampaignStore();
const areaStore = useAreaStore();

const loading = ref(false);

onBeforeMount(async () => {
    loading.value = true;
    try {
        const areaId = route.params.id;
        await mapStore.fetchMaps(areaId);
        if (!areaStore.currentArea || areaStore.currentArea.id !== Number(areaId)) {
            await areaStore.fetchArea(areaId);
        }
        if (areaStore.currentArea && areaStore.currentArea.campaign_id) {
            await campaignStore.fetchCampaign(areaStore.currentArea.campaign_id);
        }
    } finally {
        loading.value = false;
    }
});

let showCreateForm = ref(false);
const newMapName = ref('');
const newMapDescription = ref('');
const newMapImage = ref(null);

const createMap = () => {
    if (!newMapName.value.trim()) return;

    if (newMapImage.value) {
        const fd = new FormData();
        fd.append('title', newMapName.value.trim());
        fd.append('notes', newMapDescription.value.trim());
        fd.append('area_id', route.params.id);
        fd.append('image', newMapImage.value);
        mapStore.createMap(fd);
    } else {
        mapStore.createMap({
            title: newMapName.value.trim(),
            notes: newMapDescription.value.trim(),
            area_id: route.params.id
        });
    }

    newMapName.value = '';
    newMapDescription.value = '';
    showCreateForm.value = false;
};

const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    newMapImage.value = file || null;
};

const goBack = () => {
    const campaignId = areaStore.currentArea?.campaign_id || areaStore.currentArea?.campaignId;
    if (campaignId) {
        router.push({ name: 'campaign', params: { id: String(campaignId) } }).catch(() => router.back());
    } else {
        router.back();
    }
};
</script>