<template>
    <div class="campaign-details-wrapper">
        <!-- Display Mode -->
        <p v-if="!editDesc">{{ description }}</p>
        
        <!-- Edit Mode -->
        <textarea v-else v-model="description"></textarea>

        <!-- Buttons -->
        <button v-if="!editDesc" @click="editDesc = true">Edit</button>
        <button v-else @click="saveDescription">Save</button>

        <p>Created at: {{ campaign.created_at }}</p>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCampaignStore } from '../stores/campaignStore';

const props = defineProps({
    campaign: Object
});

const campaignStore = useCampaignStore();
const editDesc = ref(false);
const description = ref(props.campaign.description);

watch(() => props.campaign.description, (newVal) => {
    description.value = newVal;
});

const saveDescription = () => {
    editDesc.value = false;

    campaignStore.updateCampaign({
        id: props.campaign.id,
        name: props.campaign.name,
        description: description.value
    });
};
</script>
