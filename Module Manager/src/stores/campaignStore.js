// stores/campaignStore.js
import { defineStore } from 'pinia';

export const useCampaignStore = defineStore('campaign', {
    state: () => ({
        campaigns: [],
    }),
    actions: {
        async fetchCampaigns() {
            try {
                const response = await fetch('http://localhost:3000/campaigns');

                // Check the response status and log it
                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Fetched campaigns:', data);
                this.campaigns = data;
                return data;
            }
            catch (error) {
                console.error('Error fetching campaigns:', error);
            }
        },
    },
});
