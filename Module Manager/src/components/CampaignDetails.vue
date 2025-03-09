<template>
    <div class="campaign-details-wrapper">
        <p>{{ campaign.description }}</p>
        <p>Created at: {{ campaign.created_at }}</p>
    </div>
</template>

<script setup>
defineProps({
    campaign: Object
})
</script>