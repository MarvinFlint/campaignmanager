import { defineStore } from "pinia";

export const useCharacterStore = defineStore("character", {
    state: () => ({
        characters: [],
        currentCharacter: null,
    }),
    actions: {
        async fetchCharacters() {
            try {
                const response = await fetch("http://localhost:3000/characters");
                const data = await response.json();
                this.characters = data;
            }
            catch (error) {
                console.error("Error fetching characters:", error);
            }
        },
        async fetchCampaignCharacters(id) {
            try {
                const response = await fetch(`http://localhost:3000/characters/${id}`);
                console.log("Response status:", response.status);
                const data = await response.json();
                console.log("Fetched characters:", data);
                this.characters = data;
                return data;
            } catch (error) {
                console.error("Error fetching characters:", error);
            }
        },
        async fetchCharacter(id) {
            try {
                if (!id) return;
                const response = await fetch(`http://localhost:3000/characters/character/${id}`);
                if (!response.ok) {
                    console.error('Failed to fetch character, status:', response.status);
                    this.currentCharacter = null;
                    return null;
                }
                const data = await response.json();
                this.currentCharacter = data;
                console.log("Fetched character:", this.currentCharacter);
            } catch (error) {
                console.error("Error fetching character:", error);
            }
        },
        async createCharacter(character) {
            console.log(character);
            try {
                const response = await fetch("http://localhost:3000/characters", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(character),
                });
                const data = await response.json();
                console.log("Created character:", data);
                this.characters.push(data);
            } catch (error) {
                console.error("Error creating character:", error);
            }
        },
        async updateCharacter(payload) {
            try {
                const response = await fetch(`http://localhost:3000/characters/${payload.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    console.error('Failed to update character, status:', response.status);
                    return null;
                }
                const updated = await response.json();
                // If currently viewing this character, update local state
                if (this.currentCharacter && this.currentCharacter.id === updated.id) {
                    this.currentCharacter = updated;
                }
                // Also update the list cache if present
                const idx = this.characters.findIndex(c => c.id === updated.id);
                if (idx !== -1) this.characters.splice(idx, 1, updated);
                return updated;
            } catch (error) {
                console.error('Error updating character:', error);
            }
        }
    },
});