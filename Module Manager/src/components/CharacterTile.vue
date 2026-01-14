<template>
  <RouterLink
    :to="`/character/${character.id}`"
    class="character-tile tile"
    :aria-label="`${character.first_name} ${character.last_name}${character.race_name || character.alignment_name ? ': ' + [character.race_name, character.alignment_name].filter(Boolean).join(' — ') : ''}`"
  >
    <div class="tile-content">
      <h3>{{ character.first_name }} {{ character.last_name }}</h3>
      <p aria-hidden="true">{{ truncatedDescription }}</p>
      <span class="sr-only">{{ [character.race_name, character.alignment_name].filter(Boolean).join(' — ') }}</span>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed, toRef } from 'vue';

const props = defineProps({
  character: {
    type: Object,
    required: true,
  },
});

const character = toRef(props, 'character');

const MAX_DESC_LENGTH = 15;
const truncatedDescription = computed(() => {
  const parts = [character.value.race_name || '', character.value.alignment_name || ''].filter(Boolean);
  const combined = parts.join(' — ');
  if (combined.length <= MAX_DESC_LENGTH) return combined;
  return combined.slice(0, MAX_DESC_LENGTH).trimEnd() + '...';
});
</script>

<style scoped>
.character-tile {
  display: block;
  text-decoration: none;
}
.character-tile .tile-content {
  padding: 0.75rem;
}

.character-tile:focus-visible {
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
