export const areaStore = defineStore('area', {
    state: () => ({
        areas: [],
        currentArea: null
    }),
    actions: {
        async fetchAreas() {
            try {
                const response = await fetch('http://localhost:3000/areas');
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
                const response = await fetch(`http://localhost:3000/areas/${id}`);
                const data = await response.json();
                this.currentArea = data;
            } catch (error) {
                console.error('Error fetching area:', error);
            }
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
    },
});