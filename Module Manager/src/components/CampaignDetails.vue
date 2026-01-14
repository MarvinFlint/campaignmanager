<template>
    <div class="campaign-details-wrapper">
        <p v-if="!editDesc">{{ description }}</p>
        <div v-else>
            <label for="desc-textarea">Description</label>
            <textarea 
                id="desc-textarea" 
                v-model="description"
            ></textarea>
        </div>
        <div class="textarea-buttons">
            <button class="edit-button icon-button" v-if="!editDesc" @click="editDesc = true"><img class="edit-icon button-icon" alt="Edit Icon" src="/edit_icon.png" /></button>
            <button class="save-button icon-button" v-if="editDesc" @click="saveDescription"><img class="confirm-icon button-icon" alt="Confirm changes" src="/checkmark.svg"></button>
            <button class="discard-button icon-button" v-if="editDesc" @click="editDesc = false"><img class="discard-icon button-icon" alt="Discard changes" src="/cross.jpg"></button>
        </div>
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
