<template>
    <div>
        <h1>Character List</h1>
        <ul>
            <li v-for="character in characterStore.characters" :key="character.id">
                <router-link :to="{ name: 'Character', params: { id: character.id } }">
                    {{ character.name }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useCharacterStore } from '../stores/characterStore';

const characterStore = useCharacterStore();

onBeforeMount(() => {
    characterStore.fetchCharacters();
});
</script>