<template>
  <RouterLink
    :to="`/campaign/${campaign.id}`"
    class="campaign-tile tile"
    :aria-label="`${campaign.name}${campaign.description ? ': ' + campaign.description : ''}`"
  >
    <h3>
      {{ campaign.name }}
    </h3>
    <p aria-hidden="true">
        {{ truncatedDescription }}
    </p>
    <span class="sr-only">{{ campaign.description || '' }}</span>
  </RouterLink>
</template>

<script setup>
  import { computed, toRef } from 'vue';

  const props = defineProps({
    campaign: {
      type: Object,
      required: true,
    },
  });

  const campaign = toRef(props, 'campaign');

  const MAX_DESC_LENGTH = 15;
  const truncatedDescription = computed(() => {
    const d = campaign.value.description || '';
    if (d.length <= MAX_DESC_LENGTH) return d;
    return d.slice(0, MAX_DESC_LENGTH).trimEnd() + '...';
  });
</script>
