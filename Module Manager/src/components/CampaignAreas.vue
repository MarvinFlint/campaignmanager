<template>
    <div class="campaign-areas-wrapper">
        <div class="area-list-wrapper">
            <ul class="item-list">            
                <li class="create-area">
                    <button
                        class="create-no-focus"
                        v-if="!showCreateForm"
                        @click="showCreateForm = true"
                        type="button"
                    >
                        <span>Click to add new area</span>
                        <span>+</span>
                    </button>
                    <div class="create-focus" v-if="showCreateForm">
                        <div>
                            <label for="area-name">Name:</label>
                            <input id="area-name" name="area-name" type="text" v-model="newAreaName" @keyup.enter="handleEnter" />
                        </div>
                        <div>
                            <label for="area-description">Description:</label>
                            <input id="area-description" name="area-description" type="text" v-model="newAreaDescription" @keyup.enter="handleEnter" />
                        </div>
                        <div>
                            <label for="area-type">Type:</label>
                            <select id="area-type" name="area-type" v-model="newAreaType">
                                <option v-for="type in areaStore.areaTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                            </select>
                        </div>
                        <button @click="createArea" :disabled="!newAreaName.trim()">Create</button>
                    </div>
                </li>
                <li v-for="area in areaStore.areas" :key="area.id">
                    <AreaTile :area="area" />
                </li>
            </ul>
        </div>      
    </div>
</template>

<script setup>
import { useAreaStore } from '@/stores/areaStore';
import { onBeforeMount, watchEffect, toRefs, ref } from 'vue';
import AreaTile from './AreaTile.vue';

onBeforeMount(() => {
    areaStore.fetchAreaTypes();
    if (props.campaign?.id) {
        console.log('Fetching areas for campaign ID:', props.campaign.id);  
        areaStore.fetchAreas(props.campaign.id);
    }
});

const props = defineProps({
    campaign: Object
});

const areaStore = useAreaStore();
let showCreateForm = ref(false);
const newAreaName = ref('');
const newAreaDescription = ref('');
const newAreaType = ref('');

const createArea = () => {
    if (!newAreaName.value.trim()) return;

    areaStore.createArea({
        campaign_id: props.campaign.id,
        name: newAreaName.value.trim(),
        description: newAreaDescription.value.trim(),
        area_type_id: newAreaType.value
    });

    newAreaName.value = '';
    newAreaDescription.value = '';
    showCreateForm.value = false;
};

const handleEnter = () => {
    if (newAreaName.value.trim()) {
        createArea();
    }
};

watchEffect(() => {
    if (props.campaign?.id) {
        areaStore.fetchAreas(props.campaign.id);
    }
});
</script>
