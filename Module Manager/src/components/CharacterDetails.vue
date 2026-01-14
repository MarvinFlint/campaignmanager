<template>
	<section class="character-details">
		<button class="tab back-tab" @click="goBack" aria-label="Back to campaign" title="Back" type="button">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
				<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
		<h1 tabindex="0">{{ characterStore.currentCharacter?.first_name }} {{ characterStore.currentCharacter?.last_name }}</h1>
		<div class="character-meta" v-if="characterStore.currentCharacter">
			<div class="meta-left">
				<p tabindex="0"><strong>Race:</strong> <span aria-label="Race">{{ characterStore.currentCharacter.race_name || '—' }}</span></p>
				<p tabindex="0"><strong>Alignment:</strong> <span aria-label="Alignment">{{ characterStore.currentCharacter.alignment_name || '—' }}</span></p>
			</div>
			<div class="meta-right">
				<div class="hp" tabindex="0" aria-label="Hit points"><strong>HP:</strong> {{ characterStore.currentCharacter?.hit_points_current || 0 }} / {{ characterStore.currentCharacter?.hit_points_total || 0 }}</div>
				<div v-if="characterStore.currentCharacter?.hit_points_temporary" class="hp" tabindex="0" aria-label="Temporary hit points"><strong>Temp HP:</strong> {{ characterStore.currentCharacter.hit_points_temporary }}</div>
			</div>
		</div>

		<div v-if="characterStore.currentCharacter" class="section-grid">
			<div class="main-panel">
				<div class="section">
					<div class="section-title" role="heading" aria-level="2" tabindex="-1">Description & Notes</div>
					<p v-if="characterStore.currentCharacter.notes" tabindex="0">{{ characterStore.currentCharacter.notes }}</p>
					<p v-else class="muted" tabindex="0">No notes provided.</p>
				</div>

				<div class="section">
					<div class="section-title" role="heading" aria-level="2" tabindex="-1">Classes</div>
					<ul class="class-list" aria-label="Character classes">
						<li v-for="cls in characterStore.currentCharacter.classes" :key="cls.id" tabindex="0">{{ cls.name }} (Level {{ cls.level }})</li>
						<li v-if="!characterStore.currentCharacter.classes || characterStore.currentCharacter.classes.length === 0" class="muted" tabindex="0">No classes assigned.</li>
					</ul>
				</div>

				<div class="section">
					<div class="section-title" role="heading" aria-level="2" tabindex="-1">Ability Scores</div>
					<div class="stats-list" aria-label="Ability scores">
						<div class="stat" v-for="(value, key) in characterStore.currentCharacter.ability_scores || {}" :key="key" tabindex="0">
							<div class="stat-name">{{ key }}</div>
							<div class="stat-value">{{ value }}</div>
						</div>
						<div v-if="!characterStore.currentCharacter.ability_scores" class="muted" tabindex="0">No ability scores recorded.</div>
					</div>
				</div>
			</div>

			<div class="side-panel">
				<div class="section">
					<div class="section-title" role="heading" aria-level="2" tabindex="-1">Saving Throws</div>
					<ul class="stats-list" aria-label="Saving throws">
						<li class="stat" v-for="(value, key) in characterStore.currentCharacter.saving_throws || {}" :key="key" tabindex="0">
							<div class="stat-name">{{ key }}</div>
							<div class="stat-value">{{ value }}</div>
						</li>
						<li v-if="!characterStore.currentCharacter.saving_throws" class="muted" tabindex="0">No saving throws recorded.</li>
					</ul>
				</div>

				<div class="section">
					<div class="section-title" role="heading" aria-level="2" tabindex="-1">Spells</div>
					<ul class="spell-list" aria-label="Known spells">
						<li v-for="spell in characterStore.currentCharacter.spells" :key="spell.id" tabindex="0">
							<strong>{{ spell.name }}</strong>
							<p class="muted" v-if="spell.description">{{ spell.description }}</p>
						</li>
						<li v-if="!characterStore.currentCharacter.spells || characterStore.currentCharacter.spells.length === 0" class="muted" tabindex="0">No spells known.</li>
					</ul>
				</div>

				<div class="section">
					<div class="section-title" role="heading" aria-level="2" tabindex="-1">Inventory</div>
					<ul class="inventory-list" aria-label="Inventory">
						<li v-for="item in characterStore.currentCharacter.inventory" :key="item.id" tabindex="0">
							{{ item.name }} <span class="muted">(AC: {{ item.ac || '—' }}, Weight: {{ item.weight || '—' }})</span>
						</li>
						<li v-if="!characterStore.currentCharacter.inventory || characterStore.currentCharacter.inventory.length === 0" class="muted" tabindex="0">No inventory.</li>
					</ul>
				</div>
			</div>
		</div>

		<div v-else-if="!characterStore.currentCharacter">
			<p>Loading character...</p>
		</div>
	</section>
</template>

<script setup>
import { onBeforeMount, watch } from 'vue';
import { useCharacterStore } from '@/stores/characterStore';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const characterStore = useCharacterStore();
onBeforeMount(() => {
	characterStore.fetchCharacter(route.params.id);
});

watch(() => route.params.id, (newId) => {
	characterStore.fetchCharacter(newId);
});

const goBack = () => {
	const c = characterStore.currentCharacter;
	const campaignId = c?.campaign_id || c?.campaignId;
	if (campaignId) {
		router.push({ name: 'campaign', params: { id: String(campaignId) } }).catch(() => router.back());
	} else {
		router.back();
	}
};
</script>
