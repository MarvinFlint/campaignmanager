import { defineStore } from 'pinia';

export const useAreaStore = defineStore('area', {
    state: () => ({
        areas: [],
        areaTypes: [],
        currentArea: null
    }),
    actions: {
        async fetchAreas(id) {
            try {
                const response = await fetch(`http://localhost:3000/areas/${id}`);
                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Fetched areas:', data);
                this.areas = data;
                return data;
            }
            catch (error) {
                console.error('Error fetching areas:', error);
            }
        },
        async fetchArea(id) {
            try {
                const response = await fetch(`http://localhost:3000/areas/area/${id}`);
                const data = await response.json();
                this.currentArea = data;
            } catch (error) {
                console.error('Error fetching area:', error);
            }
        },
        setCurrentArea(area) {
            this.currentArea = area;
        },
        async createArea(area) {
            console.log(area);
            try {
                const response = await fetch('http://localhost:3000/areas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(area),
                });
                const data = await response.json();
                console.log('Created area:', data);
                this.areas.push(data);
            } catch (error) {
                console.error('Error creating area:', error);
            }
        },
        async fetchAreaTypes() {
            try {
                const response = await fetch('http://localhost:3000/areas/types');
                const data = await response.json();
                this.areaTypes = data;
                console.log('Fetched area types:', data);
            } catch (error) {
                console.error('Error fetching area types:', error);
            }
        }
    }
});