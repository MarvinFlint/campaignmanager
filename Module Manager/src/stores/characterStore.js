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
                const response = await fetch(`http://localhost:3000/characters/${id}`);
                const data = await response.json();
                this.currentCharacter = data;
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
    },
});