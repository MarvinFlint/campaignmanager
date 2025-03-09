<template>
    <div class="campaign-characters-wrapper">
        <ul>
            <li v-for="character in characterStore.characters" :key="character.id">
                <h2>{{ character.name }}</h2>
                <p>{{ character.description }}</p>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineProps, watchEffect } from 'vue';
import { useCharacterStore } from '@/stores/characterStore';

const props = defineProps({
    campaign: Object
})

const characterStore = useCharacterStore();

watchEffect(() => {
    if (props.campaign?.id) {
        characterStore.fetchCharacters(props.campaign.id);
    }
});

</script>