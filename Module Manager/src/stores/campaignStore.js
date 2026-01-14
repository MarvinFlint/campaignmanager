// stores/campaignStore.js
import { defineStore } from 'pinia';

export const useCampaignStore = defineStore('campaign', {
    state: () => ({
        campaigns: [],
        currentCampaign: null
    }),
    actions: {
        async fetchCampaigns() {
            try {
                const response = await fetch('http://localhost:3000/campaigns');
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
        async fetchCampaign(id) {
            try {
                const response = await fetch(`http://localhost:3000/campaigns/${id}`);
                const data = await response.json();
                this.currentCampaign = data;
                console.log('Fetched campaign:', this.currentCampaign);
            } catch (error) {
                console.error('Error fetching campaign:', error);
            }
        },
        async createCampaign(campaign) {
            console.log(campaign);
            try {
                const response = await fetch('http://localhost:3000/campaigns', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(campaign),
                });
                const data = await response.json();
                console.log('Created campaign:', data);
                this.campaigns.push(data);
            } catch (error) {
                console.error('Error creating campaign:', error);
            }
        },
        async updateCampaign(campaign) {
            console.log(campaign);
            try {
                const response = await fetch(`http://localhost:3000/campaigns/${campaign.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(campaign),
                });
                const data = await response.json();
                console.log('Updated campaign:', data);
                const index = this.campaigns.findIndex(c => c.id === campaign.id);
                this.campaigns[index] = data;
            } catch (error) {
                console.error('Error updating campaign:', error);
            }
        }
    },
});
