// stores/resourceStore.js
import { defineStore } from 'pinia';

export const useResourceStore = defineStore('resource', {
    state: () => ({
        resources: []
    }),
    actions: {
        async fetchResources() {
            try {
                const response = await fetch('http://localhost:3000/resources');
                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Fetched resources:', data);
                this.resources = data;
                return data;
            }
            catch (error) {
                console.error('Error fetching resources:', error);
            }
        }
    }
});