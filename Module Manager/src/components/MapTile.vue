<template>
  <RouterLink
    :to="`/map/${map.id}`"
    class="map-tile tile"
    :aria-label="`${map.title}${map.notes ? ': ' + map.notes : ''}`"
  >
    <div class="tile-bg" aria-hidden="true" :style="bgStyle" :class="{ 'no-image': !hasImage }"></div>
    <div class="tile-content">
      <h3>
        {{ map.title }}
      </h3>
      <p aria-hidden="true">
        {{ truncatedNotes }}
      </p>
      <span class="sr-only">{{ map.notes || '' }}</span>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed, toRef } from 'vue';

const props = defineProps({
  map: {
    type: Object,
    required: true,
  },
});

const map = toRef(props, 'map');

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const imageUrl = computed(() => `${apiBase.replace(/\/$/, '')}/maps/${map.value.id}/image`);
const hasImage = computed(() => !!map.value.image);

const bgStyle = computed(() => ({
  backgroundImage: hasImage.value ? `url("${imageUrl.value}")` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const MAX_NOTES_LENGTH = 15;
const truncatedNotes = computed(() => {
  const n = map.value.notes || '';
  if (n.length <= MAX_NOTES_LENGTH) return n;
  return n.slice(0, MAX_NOTES_LENGTH).trimEnd() + '...';
});
</script>

<style scoped>
.map-tile {
  position: relative;
  overflow: hidden;
}
.map-tile .tile-bg {
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: blur(8px) brightness(0.6);
  transform: scale(1.05);
  pointer-events: none;
}
.map-tile .tile-content {
  position: relative;
  z-index: 1;
  color: #fff;
  padding: 1rem;
}
.map-tile:focus-visible {
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