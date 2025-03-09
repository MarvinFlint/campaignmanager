<template>
    <div class="campaign-areas-wrapper">
        <ul>
            <li v-for="area in areaStore.areas" :key="area.id">
                <h2>{{ area.name }}</h2>
                <p>{{ area.description }}</p>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useAreaStore } from '@/stores/areaStore';
import { onBeforeMount, watchEffect, toRefs } from 'vue';

const props = defineProps({
    campaign: Object
});

const areaStore = useAreaStore();

watchEffect(() => {
    if (props.campaign?.id) {
        areaStore.fetchAreas(props.campaign.id);
    }
});
</script>
