<template>
  <RouterLink
    :to="`/area/${area.id}`"
    class="area-tile tile"
    :aria-label="`${area.name}${area.description ? ': ' + area.description : ''}`"
  >
    <h3>
      {{ area.name }}
    </h3>
    <p aria-hidden="true">
      {{ truncatedDescription }}
    </p>
    <span class="sr-only">{{ area.description || '' }}</span>
  </RouterLink>
</template>

<script setup>
import { computed, toRef } from 'vue';

const props = defineProps({
  area: {
    type: Object,
    required: true,
  },
});

const area = toRef(props, 'area');

const MAX_DESC_LENGTH = 15;
const truncatedDescription = computed(() => {
  const d = area.value.description || '';
  if (d.length <= MAX_DESC_LENGTH) return d;
  return d.slice(0, MAX_DESC_LENGTH).trimEnd() + '...';
});

import { useAreaStore } from '../stores/areaStore';

const areaStore = useAreaStore();

function handleClick() {
  areaStore.setCurrentArea(area.value);
}
</script>