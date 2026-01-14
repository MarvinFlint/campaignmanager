import { defineStore } from 'pinia';

export const useLookupStore = defineStore('lookup', {
    state: () => ({
        races: [],
        classes: [],
        alignments: [],
    }),
    actions: {
        async fetchRaces() {
            try {
                const response = await fetch('http://localhost:3000/lookups/races');
                const data = await response.json();
                this.races = data;
            } catch (error) {
                console.error('Error fetching races:', error);
            }
        },
        async fetchClasses() {
            try {
                const response = await fetch('http://localhost:3000/lookups/classes');
                const data = await response.json();
                this.classes = data;
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        },
        async fetchAlignments() {
            try {
                const response = await fetch('http://localhost:3000/lookups/alignments');
                const data = await response.json();
                this.alignments = data;
            } catch (error) {
                console.error('Error fetching alignments:', error);
            }
        },
    },
});
