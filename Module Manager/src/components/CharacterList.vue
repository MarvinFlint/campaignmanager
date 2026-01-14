<template>
    <div>
        <div class="list-header">
            <h1>Character List</h1>
            <button @click="showForm = true">Add Character</button>
        </div>

        <div v-if="characterStore.characters.length === 0">No characters yet.</div>

        <div class="tiles">
            <CharacterTile v-for="c in characterStore.characters" :key="c.id" :character="c" />
        </div>

        <div v-if="showForm" class="modal">
            <div class="modal-content">
                <h2>Add Character</h2>
                <form @submit.prevent="submit">
                    <label>First name
                        <input v-model="form.first_name" required />
                    </label>
                    <label>Last name
                        <input v-model="form.last_name" />
                    </label>
                    <label>Campaign ID
                        <input v-model="form.campaign_id" required />
                    </label>
                    <label>Race ID
                        <input v-model="form.race_id" />
                    </label>
                    <label>Alignment ID
                        <input v-model="form.alignment_id" />
                    </label>
                    <label>HP Total
                        <input type="number" v-model.number="form.hit_points_total" />
                    </label>
                    <label>HP Current
                        <input type="number" v-model.number="form.hit_points_current" />
                    </label>
                    <label>HP Temp
                        <input type="number" v-model.number="form.hit_points_temporary" />
                    </label>
                    <label>Armor Class
                        <input type="number" v-model.number="form.armor_class" />
                    </label>
                    <label>
                        <input type="checkbox" v-model="form.isNPC" /> NPC
                    </label>

                    <div class="modal-actions">
                        <button type="submit">Create</button>
                        <button type="button" @click="showForm = false">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useCharacterStore } from '../stores/characterStore';
import CharacterTile from './CharacterTile.vue';

const characterStore = useCharacterStore();

const showForm = ref(false);

const form = reactive({
    campaign_id: '',
    first_name: '',
    last_name: '',
    race_id: null,
    alignment_id: null,
    hit_points_total: null,
    hit_points_current: null,
    hit_points_temporary: null,
    armor_class: null,
    isNPC: false,
});

onBeforeMount(() => {
    characterStore.fetchCharacters();
});

async function submit() {
    await characterStore.createCharacter({ ...form });
    form.first_name = '';
    form.last_name = '';
    form.campaign_id = '';
    form.race_id = null;
    form.alignment_id = null;
    form.hit_points_total = null;
    form.hit_points_current = null;
    form.hit_points_temporary = null;
    form.armor_class = null;
    form.isNPC = false;
    showForm.value = false;
}
</script>