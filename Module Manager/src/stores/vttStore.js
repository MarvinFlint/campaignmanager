import { defineStore} from 'pinia';

export const useVttStore = defineStore('vtt', {
    state: () => ({
        vtt:{
            id: null,
            imageURL: null,
            grid: {
                cols: 40,
                rows: 30,
                cellSize: 50
            }
        },
        tokens: [],
        ui: {
            activeTokenId: null,
            selectedTokenIds: [],
            zoom: 1,
            pan: { x: 0, y: 0 }
        },

        layers: {
            grid: { visibile: true },
            tokens: { visible: true, interactive: true },
        }
    }),
    getters: {
        activeToken(state) {
            return state.tokens.find(token => token.id === state.ui.activeTokenId) || null;
        },

        visibleTokens(state) {
            return state.tokens.filter(token => {
                const layer = state.layers.tokens;
                return layer.visible && (!layer.interactive || token.visible);
            });
        }
    },
    actions: {
        setActiveToken(tokenId) {
            this.ui.activeTokenId = tokenId;
        },
        moveToken(tokenId, dx, dy) {
            const token = this.tokens.find(t => t.id === tokenId);
            if (token) {
                token.x += dx;
                token.y += dy;
            }
        },
        createToken(payload) {
            const id = `token-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const grid = this.vtt.grid || { cellSize: 50 };
            const defaultX = (payload && typeof payload.x === 'number') ? payload.x : 0;
            const defaultY = (payload && typeof payload.y === 'number') ? payload.y : 0;
            const token = {
                id,
                x: defaultX,
                y: defaultY,
                color: (payload && payload.color) || '#d33',
                name: payload && payload.character ? `${payload.character.first_name || ''} ${payload.character.last_name || ''}`.trim() : 'Token',
                character_id: payload && payload.character ? payload.character.id : null,
                visible: true,
            };
            this.tokens.push(token);
            return token;
        },
        setTokenPosition(tokenId, x, y) {
            const token = this.tokens.find(t => t.id === tokenId);
            if (token) {
                token.x = x;
                token.y = y;
            }
        },
        removeToken(tokenId) {
            const idx = this.tokens.findIndex(t => t.id === tokenId);
            if (idx !== -1) this.tokens.splice(idx, 1);
        },
        setImageUrl(mapId) {
            const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
            this.vtt.imageURL = `${apiBase.replace(/\/$/, '')}/maps/${mapId}/image`;
        }
        ,
        async loadState(mapId) {
            try {
                const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
                const res = await fetch(`${apiBase.replace(/\/$/, '')}/maps/${mapId}/state`);
                if (!res.ok) return;
                const data = await res.json();
                // expected shape: { vtt: {...}, tokens: [...], ui: {...} }
                if (data.vtt) this.vtt = Object.assign({}, this.vtt, data.vtt);
                if (Array.isArray(data.tokens)) this.tokens = data.tokens;
                if (data.ui) this.ui = Object.assign({}, this.ui, data.ui);
            } catch (e) {
                console.error('Failed to load VTT state', e);
            }
        },
        async saveState(mapId) {
            try {
                const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
                const payload = {
                    vtt: this.vtt,
                    tokens: this.tokens,
                    ui: this.ui
                };
                const res = await fetch(`${apiBase.replace(/\/$/, '')}/maps/${mapId}/state`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) console.warn('Failed to save VTT state', res.status);
            } catch (e) {
                console.error('Failed to save VTT state', e);
            }
        },
        // simple debounced save helper
        _debounced: { timer: null },
        scheduleSave(mapId, delay = 800) {
            if (this._debounced.timer) clearTimeout(this._debounced.timer);
            this._debounced.timer = setTimeout(() => {
                this.saveState(mapId);
                this._debounced.timer = null;
            }, delay);
        }
    }
})