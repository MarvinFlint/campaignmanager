<template>
    <div class="campaign-characters-wrapper">
        <ul class="item-list">
            <template v-if="loading">
                <li class="loading">
                    <div class="spinner" role="status" aria-hidden="true"></div>
                    <span class="sr-only">Loading characters...</span>
                </li>
            </template>
            <template v-else>
                <li class="create-character">
                    <button
                        class="create-no-focus"                        
                        @click="showForm = true"
                        type="button"
                    >
                        <span>Click to add new character</span>
                        <span>+</span>
                    </button>
                </li>
                <li v-for="character in characterStore.characters" :key="character.id">
                    <CharacterTile :character="character" />
                </li>
            </template>
        </ul>
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
                    <div v-if="campaignStore.currentCampaign">
                        <p>Creating character in campaign: <strong>{{ campaignStore.currentCampaign.name }}</strong></p>
                    </div>
                    <label>Race
                        <select v-model="form.race_id">
                            <option :value="null">-- none --</option>
                            <option v-for="r in lookupStore.races" :key="r.id" :value="r.id">{{ r.name }}</option>
                        </select>
                    </label>
                    <label>Alignment
                        <select v-model="form.alignment_id">
                            <option :value="null">-- none --</option>
                            <option v-for="a in lookupStore.alignments" :key="a.id" :value="a.id">{{ a.name }}</option>
                        </select>
                    </label>
                    <label>Class
                        <select v-model="form.class_id">
                            <option :value="null">-- none --</option>
                            <option v-for="cl in lookupStore.classes" :key="cl.id" :value="cl.id">{{ cl.name }}</option>
                        </select>
                    </label>
                    <label>Class level
                        <input type="number" min="1" v-model.number="form.class_level" />
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
import { onBeforeMount, reactive, ref, watchEffect } from 'vue';
import { useCharacterStore } from '../stores/characterStore';
import { useCampaignStore } from '../stores/campaignStore';
import { useLookupStore } from '../stores/lookupStore';
import CharacterTile from './CharacterTile.vue';

const characterStore = useCharacterStore();
const campaignStore = useCampaignStore();
const lookupStore = useLookupStore();

const showForm = ref(false);
const loading = ref(false);

const form = reactive({
    campaign_id: '',
    first_name: '',
    last_name: '',
    race_id: null,
    alignment_id: null,
    class_id: null,
    class_level: 1,
    hit_points_total: null,
    hit_points_current: null,
    hit_points_temporary: null,
    armor_class: null,
    isNPC: false,
});

onBeforeMount(async () => {
    loading.value = true;
    try {
        // fetch characters for the current campaign if available
        if (campaignStore.currentCampaign?.id) {
            await characterStore.fetchCampaignCharacters(campaignStore.currentCampaign.id);
        } else {
            await characterStore.fetchCharacters();
        }

        // fetch lookups
        await lookupStore.fetchRaces();
        await lookupStore.fetchAlignments();
        await lookupStore.fetchClasses();
    } finally {
        loading.value = false;
    }
});

watchEffect(() => {
    if (campaignStore.currentCampaign?.id) {
        form.campaign_id = campaignStore.currentCampaign.id;
        characterStore.fetchCampaignCharacters(campaignStore.currentCampaign.id);
    }
});

async function submit() {
    // ensure campaign_id is present from campaign store
    if (!form.campaign_id && campaignStore.currentCampaign?.id) {
        form.campaign_id = campaignStore.currentCampaign.id;
    }

    await characterStore.createCharacter({ ...form });

    // reset and close
    form.first_name = '';
    form.last_name = '';
    form.race_id = null;
    form.alignment_id = null;
    form.class_id = null;
    form.class_level = 1;
    form.hit_points_total = null;
    form.hit_points_current = null;
    form.hit_points_temporary = null;
    form.armor_class = null;
    form.isNPC = false;
    showForm.value = false;
}
</script>