<template>
    <CharacterDetails />
</template>

<script setup>
import { onBeforeMount } from 'vue';
import CharacterDetails from '@/components/CharacterDetails.vue';
import { useRoute } from 'vue-router';
import { useCharacterStore } from '@/stores/characterStore';

const route = useRoute();
const characterStore = useCharacterStore();

onBeforeMount(async () => {
    await characterStore.fetchCharacter(route.params.id);
});

</script>