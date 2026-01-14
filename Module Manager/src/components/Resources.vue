<template>
    <div class="resource-list-container">
        <ul class="resource-list">
            <li v-for="resource in resourceStore.resources" :key="resource.id" class="resource-item">
                <h3>{{ resource.name }}</h3>
                <p>{{ resource.description }}</p>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { useResourceStore } from '../stores/resourceStore';

const resourceStore = useResourceStore();

onBeforeMount(() => {
    resourceStore.fetchResources();
});
</script>