import { defineStore } from "pinia";

export const useMapStore = defineStore("map", {
    state: () => ({
        maps: [],
        currentMap: null,
    }),
    actions: {
        async fetchMaps(areaId) {
            try {
                const response = await fetch(`http://localhost:3000/maps/${areaId}`);
                console.log("Response status:", response.status);
                const data = await response.json();
                console.log("Fetched maps:", data);
                this.maps = data;
                return data;
            } catch (error) {
                console.error("Error fetching maps:", error);
            }
        },
        async fetchMap(id) {
            try {
                const response = await fetch(`http://localhost:3000/maps/map/${id}`);
                const data = await response.json();
                this.currentMap = data;
            } catch (error) {
                console.error("Error fetching map:", error);
            }
        },
        async createMap(map) {
            console.log(map);
            try {
                let options;
                if (map instanceof FormData) {
                    options = {
                        method: "POST",
                        body: map,
                    };
                } else {
                    options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(map),
                    };
                }
                const response = await fetch("http://localhost:3000/maps", options);
                const data = await response.json();
                console.log("Created map:", data);
                this.maps.push(data);
            } catch (error) {
                console.error("Error creating map:", error);
            }
        },
        async updateMap(map) {
            try {
                const options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(map),
                };
                const response = await fetch(`http://localhost:3000/maps/${map.id}`, options);
                if (!response.ok) throw new Error('Failed to update map');
                const data = await response.json();
                // keep currentMap in sync
                if (this.currentMap && this.currentMap.id === data.id) {
                    this.currentMap = data;
                }
                // update maps list if present
                const idx = this.maps.findIndex((m) => m.id === data.id);
                if (idx !== -1) this.maps.splice(idx, 1, data);
                return data;
            } catch (error) {
                console.error('Error updating map:', error);
                throw error;
            }
        }
        ,
        async uploadMapImage(file, id) {
            try {
                const fd = new FormData();
                fd.append('image', file);
                const response = await fetch(`http://localhost:3000/maps/${id}/image`, {
                    method: 'POST',
                    body: fd,
                });
                if (!response.ok) throw new Error('Upload failed');
                const data = await response.json();
                // update currentMap and maps list
                if (this.currentMap && this.currentMap.id === data.id) this.currentMap = data;
                const idx = this.maps.findIndex((m) => m.id === data.id);
                if (idx !== -1) this.maps.splice(idx, 1, data);
                return data;
            } catch (error) {
                console.error('Error uploading map image:', error);
                throw error;
            }
        }
    },
});