<template>
  <RouterLink
    :to="`/character/${character.id}`"
    class="character-tile tile"
      :aria-label="`${character.first_name} ${character.last_name} - ${[character.race_name, classNamesForTile, character.alignment_name].filter(Boolean).join(' - ')}`"
  >
    <div class="tile-content">
      <h3>{{ character.first_name }} {{ character.last_name }}</h3>
      <p aria-hidden="true">{{ truncatedDescription }}</p>
      <span class="sr-only">{{ [character.race_name, classNamesForTile, character.alignment_name].filter(Boolean).join(' — ') }}</span>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed, toRef, onMounted } from 'vue';
import { useLookupStore } from '@/stores/lookupStore';
import { useCharacterStore } from '@/stores/characterStore';

const props = defineProps({
  character: {
    type: Object,
    required: true,
  },
});

const character = toRef(props, 'character');

const MAX_DESC_LENGTH = 15;
const lookupStore = useLookupStore();
const characterStore = useCharacterStore();

// Ensure lookup data is loaded (races/classes/alignments)
onMounted(() => {
  if (!lookupStore.races.length) lookupStore.fetchRaces();
  if (!lookupStore.classes.length) lookupStore.fetchClasses();
  if (!lookupStore.alignments.length) lookupStore.fetchAlignments();
});

const classNamesForTile = computed(() => {
  // character may include a single class summary via character.class_name (not guaranteed)
  // prefer class list attached to character (if present), otherwise check characterStore cache
  const classes = character.value.classes || characterStore.classesByCharacter?.[character.value.id] || [];
  if (!classes || classes.length === 0) return '';
  // join names, include levels if present
  return classes.map(c => c.name + (c.level ? ` ${c.level}` : '')).join(', ');
});

const truncatedDescription = computed(() => {
  const parts = [character.value.race_name || '', classNamesForTile.value || '', character.value.alignment_name || ''].filter(Boolean);
  const combined = parts.join(' — ');
  if (combined.length <= MAX_DESC_LENGTH) return combined;
  return combined.slice(0, MAX_DESC_LENGTH).trimEnd() + '...';
});

// Preload classes for this character into the character store if missing
onMounted(async () => {
  if (character.value && character.value.id) {
    if ((!character.value.classes || character.value.classes.length === 0) && !characterStore.classesByCharacter[character.value.id]) {
      await characterStore.fetchCharacterClasses(character.value.id);
    }
  }
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
