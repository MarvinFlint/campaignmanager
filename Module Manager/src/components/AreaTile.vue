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

<style scoped>
.area-tile:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 3px;
}
.sr-only {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}
</style>