<template>
    <div class="vtt-page">
        <div class="vtt-container">
            <canvas ref="canvasRef" id="vtt-canvas" width="1000" height="600" aria-hidden="true"></canvas>

            <div class="vtt-overlay" role="application" aria-label="Virtual tabletop overlay">
                <template v-for="token in vtt.visibleTokens" :key="token.id">
                    <button
                        class="vtt-token"
                        :class="{ active: vtt.ui.activeTokenId === token.id }"
                        :style="tokenStyle(token)"
                        :aria-label="`Token ${token.name || token.id}`"
                        aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight W A S D"
                        :data-token-id="token.id"
                        @click.stop="onTokenClick(token, $event)"
                        @mousedown.prevent.stop="startDrag(token, $event)"
                        @focus="vtt.setActiveToken(token.id)"
                        @keydown="onTokenKeydown(token, $event)"
                        tabindex="0"
                    >
                        <template v-if="_imgForToken(token)">
                            <img :src="_imgForToken(token)" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:4px;"/>
                        </template>
                        <template v-else>
                            <div class="token-placeholder" aria-hidden="true">{{ _initialForToken(token) }}</div>
                        </template>
                        <span class="sr-only">{{ token.name || ('Token ' + token.id) }}</span>
                    </button>
                </template>

                <div v-if="placingCharacter && previewPos"
                            class="vtt-token preview"
                            :style="(() => {
                                    const cols = vtt.vtt.grid.cols;
                                    const rows = vtt.vtt.grid.rows;
                                    const baseCellW = imageW.value / cols;
                                    const baseCellH = imageH.value / rows;
                                    const baseCell = Math.max(baseCellW, baseCellH);
                                    const cellWidth = baseCell * zoom.value;
                                    const cellHeight = cellWidth;
                                    const gridWidth = baseCell * cols * zoom.value;
                                    const gridHeight = baseCell * rows * zoom.value;
                                    const offsetX = pan.x + ((imageW.value * zoom.value) - gridWidth) / 2;
                                    const offsetY = pan.y + ((imageH.value * zoom.value) - gridHeight) / 2;
                                    return {
                                        left: previewPos.pixelLeft + 'px',
                                        top: previewPos.pixelTop + 'px',
                                        width: cellWidth + 'px',
                                        height: cellHeight + 'px'
                                    };
                            })()"
                            aria-hidden="true"></div>
            </div>
        </div>

        <div ref="srLive" class="sr-only" role="status" aria-live="polite" aria-atomic="true">{{ liveMessage }}</div>

        <div v-if="placingToast" class="vtt-placement-toast" role="status" aria-live="assertive" aria-atomic="true">{{ placingToast }}</div>

        <aside class="vtt-characters" aria-label="Characters in campaign">
            <h3>Characters</h3>
            <template v-if="loadingChars">
                <div class="loading">Loading characters…</div>
            </template>
            <ul class="character-list">
                <li v-for="c in characterStore.characters" :key="c.id" class="character-row">
                    <div class="character-info">
                        <button class="character-item" @click="selectCharacter(c)">
                            <strong>{{ c.first_name }} {{ c.last_name || '' }}</strong>
                            <div class="meta">{{ c.race_name || '' }} · {{ c.alignment_name || '' }}</div>
                        </button>
                    </div>
                    <div class="character-actions">
                        <button class="add-token" @click.prevent="addTokenForCharacter(c)" aria-label="Add token for character">+</button>
                    </div>
                </li>
                <li v-if="!loadingChars && characterStore.characters.length === 0">No characters</li>
            </ul>
        </aside>
    </div>
</template>

<script setup>

import { onMounted, onUnmounted, ref, watch, nextTick, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useVttStore } from '@/stores/vttStore';
import { useMapStore } from '@/stores/mapStore';
import { useCharacterStore } from '@/stores/characterStore';

const characterStore = useCharacterStore();

const vtt = useVttStore();
const map = useMapStore();
const route = useRoute();

const canvasRef = ref(null);
let ctx = null;
let image = null;

const imageW = ref(0);
const imageH = ref(0);

const zoom = ref(vtt.ui.zoom || 1);
const pan = reactive({ x: vtt.ui.pan.x || 0, y: vtt.ui.pan.y || 0 });

watch(() => zoom.value, (nv) => { vtt.ui.zoom = nv; });
watch(() => [pan.x, pan.y], (nv) => { vtt.ui.pan.x = pan.x; vtt.ui.pan.y = pan.y; });

const placingCharacter = ref(null);
const previewPos = ref(null);
const placingToast = ref('');
let dragging = null;
const liveMessage = ref('');
const _imgCache = new Map();

function getTokenImageForCharacter(charId){
    if (!charId) return null;
    const cached = _imgCache.get(charId);
    if (cached !== undefined) return cached;
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
    const url = `${apiBase.replace(/\/$/, '')}/characters/${charId}/token`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { _imgCache.set(charId, img); draw(); };
    img.onerror = () => { _imgCache.set(charId, null); };
    img.src = url;
    _imgCache.set(charId, undefined);
    return undefined;
}

async function ensureMapLoaded(){
    const mapId = route.params.mapId || route.params.id;
    if (mapId) {
        if (!map.currentMap || String(map.currentMap.id) !== String(mapId)) {
            await map.fetchMap(mapId);
        }
        vtt.setImageUrl(mapId);
    }
}

const loadingChars = ref(false);

async function loadCampaignCharacters(){
    if (!map.currentMap?.campaign_id) return;
    loadingChars.value = true;
    try {
        await characterStore.fetchCampaignCharacters(map.currentMap.campaign_id);
    } finally {
        loadingChars.value = false;
    }
}

function addTokenForCharacter(character){
    placingCharacter.value = character;
}

function snapToPixelGrid(clientX, clientY){
    const rect = canvasRef.value.getBoundingClientRect();
    const cols = vtt.vtt.grid.cols;
    const rows = vtt.vtt.grid.rows;
    const baseCellW = imageW.value / cols;
    const baseCellH = imageH.value / rows;
    const baseCell = Math.max(baseCellW, baseCellH);
    const cellWidth = baseCell * zoom.value;
    const cellHeight = cellWidth;
    const gridWidth = baseCell * cols * zoom.value;
    const gridHeight = baseCell * rows * zoom.value;
    const offsetX = pan.x + ((imageW.value * zoom.value) - gridWidth) / 2;
    const offsetY = pan.y + ((imageH.value * zoom.value) - gridHeight) / 2;

    const localX = clientX - rect.left - offsetX;
    const localY = clientY - rect.top - offsetY;
    let gridX = Math.floor(localX / cellWidth);
    let gridY = Math.floor(localY / cellHeight);
    gridX = Math.max(0, Math.min(cols - 1, gridX));
    gridY = Math.max(0, Math.min(rows - 1, gridY));
    const pixelLeft = offsetX + gridX * cellWidth;
    const pixelTop = offsetY + gridY * cellHeight;
    return { x: gridX, y: gridY, pixelLeft, pixelTop };
}

function findFirstEmptyCell(){
    const cols = vtt.vtt.grid.cols || 1;
    const rows = vtt.vtt.grid.rows || 1;
    const occupied = new Set((vtt.visibleTokens || []).map(t => `${t.x},${t.y}`));
    for (let y = 0; y < rows; y++){
        for (let x = 0; x < cols; x++){
            if (!occupied.has(`${x},${y}`)) return { x, y };
        }
    }
    return { x: Math.floor(cols/2), y: Math.floor(rows/2) };
}

function onCanvasClick(ev){
    if (!placingCharacter.value) return;
    const snapResult = snapToPixelGrid(ev.clientX, ev.clientY);
    const created = vtt.createToken({ character: placingCharacter.value, x: snapResult.x, y: snapResult.y });
    placingCharacter.value = null;
    previewPos.value = null;
    draw();
    vtt.setActiveToken(created.id);

    nextTick(() => {
        const selector = `[data-token-id="${created.id}"]`;
        const btn = document.querySelector(selector);
        if (btn && typeof btn.focus === 'function') btn.focus();
    });
}

function onCanvasMouseMove(ev){
    if (!placingCharacter.value) return;
    const snapResult = snapToPixelGrid(ev.clientX, ev.clientY);
    previewPos.value = { pixelLeft: snapResult.pixelLeft, pixelTop: snapResult.pixelTop };
}

let bgPanning = null;
function startBgPan(ev){
    if (ev.button !== 0) return;
    bgPanning = { startX: ev.clientX, startY: ev.clientY, origX: pan.x, origY: pan.y };
    window.addEventListener('mousemove', bgPanMove);
    window.addEventListener('mouseup', endBgPan);
}

function bgPanMove(ev){
    if (!bgPanning) return;
    const dx = ev.clientX - bgPanning.startX;
    const dy = ev.clientY - bgPanning.startY;
    pan.x = bgPanning.origX + dx;
    pan.y = bgPanning.origY + dy;
    draw();
}

function endBgPan(){
    if (!bgPanning) return;
    window.removeEventListener('mousemove', bgPanMove);
    window.removeEventListener('mouseup', endBgPan);
    bgPanning = null;
}

function onWheel(ev){
    ev.preventDefault();
    const delta = -ev.deltaY;
    const factor = delta > 0 ? 1.1 : 0.9;
    zoomAtPoint(ev.clientX, ev.clientY, factor);
}

function zoomAtPoint(clientX, clientY, factor){
    if (!canvasRef.value) return;
    const rect = canvasRef.value.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    const newZoom = Math.max(0.1, Math.min(10, zoom.value * factor));
    const imageX = (mx - pan.x) / zoom.value;
    const imageY = (my - pan.y) / zoom.value;
    zoom.value = newZoom;
    pan.x = mx - imageX * zoom.value;
    pan.y = my - imageY * zoom.value;
    draw();
}

function startDrag(token, ev){
    dragging = { token, offsetX: ev.clientX, offsetY: ev.clientY };
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', endDrag);
}

function dragMove(ev){
    if (!dragging) return;
    const snapResult = snapToPixelGrid(ev.clientX, ev.clientY);
    vtt.setTokenPosition(dragging.token.id, snapResult.x, snapResult.y);
    draw();
}

function endDrag(){
    if (!dragging) return;
    window.removeEventListener('mousemove', dragMove);
    window.removeEventListener('mouseup', endDrag);
    dragging = null;
}

function draw(){
    if (!image || !ctx || !canvasRef.value) return;
    const canvas = canvasRef.value;
    
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const drawW = imageW.value * zoom.value;
    const drawH = imageH.value * zoom.value;
    ctx.drawImage(image, pan.x, pan.y, drawW, drawH);
    drawGrid();
    drawTokens();
}

function drawGrid(){
    const { rows, cols } = vtt.vtt.grid;
    if (!canvasRef.value) return;
    const baseCellW = imageW.value / cols;
    const baseCellH = imageH.value / rows;
    const baseCell = Math.max(baseCellW, baseCellH);
    const cellWidth = baseCell * zoom.value;
    const cellHeight = cellWidth;
    const gridWidth = baseCell * cols * zoom.value;
    const gridHeight = baseCell * rows * zoom.value;
    const offsetX = pan.x + ((imageW.value * zoom.value) - gridWidth) / 2;
    const offsetY = pan.y + ((imageH.value * zoom.value) - gridHeight) / 2;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';

    for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(offsetX + x * cellWidth, offsetY + 0);
        ctx.lineTo(offsetX + x * cellWidth, offsetY + rows * cellHeight);
        ctx.stroke();
    }

    for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(offsetX + 0, offsetY + y * cellHeight);
        ctx.lineTo(offsetX + cols * cellWidth, offsetY + y * cellHeight);
        ctx.stroke();
    }
}

function drawTokens(){
    const cols = vtt.vtt.grid.cols;
    const rows = vtt.vtt.grid.rows;
    const baseCellW = imageW.value / cols;
    const baseCellH = imageH.value / rows;
    const baseCell = Math.max(baseCellW, baseCellH);
    const cellWidth = baseCell * zoom.value;
    const cellHeight = cellWidth;
    const gridWidth = baseCell * cols * zoom.value;
    const gridHeight = baseCell * rows * zoom.value;
    const offsetX = pan.x + ((imageW.value * zoom.value) - gridWidth) / 2;
    const offsetY = pan.y + ((imageH.value * zoom.value) - gridHeight) / 2;
    vtt.visibleTokens.forEach(token => {
        const x = offsetX + token.x * cellWidth;
        const y = offsetY + token.y * cellHeight;
        const charId = token.character_id;
        const cached = _imgCache.get(charId);
        if (cached instanceof Image && cached.complete) {
            try {
                ctx.drawImage(cached, x, y, cellWidth, cellHeight);
            } catch (e) {
                ctx.fillStyle = token.color || '#888';
                ctx.beginPath();
                ctx.arc(x + cellWidth/2, y + cellHeight/2, Math.min(cellWidth, cellHeight)/2 - 2, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const ch = (token.name && token.name[0]) || '?';
                ctx.fillText(ch.toUpperCase(), x + cellWidth/2, y + cellHeight/2);
            }
        } else if (cached === null) {
            ctx.fillStyle = '#777';
            ctx.beginPath();
            ctx.arc(x + cellWidth/2, y + cellHeight/2, Math.min(cellWidth, cellHeight)/2 - 2, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const ch = (token.name && token.name[0]) || '?';
            ctx.fillText(ch.toUpperCase(), x + cellWidth/2, y + cellHeight/2);
        } else {
            if (charId && !_imgCache.has(charId)) getTokenImageForCharacter(charId);
            ctx.fillStyle = token.color || '#d33';
            ctx.fillRect(x, y, cellWidth, cellHeight);
        }
    });
}

function tokenStyle(token){
    if (!canvasRef.value) return {};
    const cols = vtt.vtt.grid.cols;
    const rows = vtt.vtt.grid.rows;
    const baseCellW = imageW.value / cols;
    const baseCellH = imageH.value / rows;
    const baseCell = Math.max(baseCellW, baseCellH);
    const cellWidth = baseCell * zoom.value;
    const cellHeight = cellWidth;
    const gridWidth = baseCell * cols * zoom.value;
    const gridHeight = baseCell * rows * zoom.value;
    const offsetX = pan.x + ((imageW.value * zoom.value) - gridWidth) / 2;
    const offsetY = pan.y + ((imageH.value * zoom.value) - gridHeight) / 2;
    return {
        position: 'absolute',
        left: `${offsetX + token.x * cellWidth}px`,
        top: `${offsetY + token.y * cellHeight}px`,
        width: `${cellWidth}px`,
        height: `${cellHeight}px`,
        background: 'transparent',
        border: '2px solid rgba(0,0,0,0.2)',
        padding: '0',
    };
}

function onTokenClick(token, ev){
    try {
        if (ev && ev.currentTarget && typeof ev.currentTarget.focus === 'function') {
            ev.currentTarget.focus();
        }
    } catch (e) {
    }

    vtt.setActiveToken(token.id);

    const custom = new CustomEvent('vtt-token-click', { detail: token, bubbles: true });
    canvasRef.value && canvasRef.value.dispatchEvent(custom);
}

function onTokenKeydown(token, ev){
    const key = ev.key;
    let dx = 0, dy = 0;
    const step = ev.shiftKey ? 5 : 1;
    if (key === 'ArrowUp') dy = -step;
    else if (key === 'ArrowDown') dy = step;
    else if (key === 'ArrowLeft') dx = -step;
    else if (key === 'ArrowRight') dx = step;
    /* Fallback keys for screen readers */
    else if (key === 'w' || key === 'W') dy = -step;
    else if (key === 's' || key === 'S') dy = step;
    else if (key === 'a' || key === 'A') dx = -step;
    else if (key === 'd' || key === 'D') dx = step;
    else return;

    ev.preventDefault();
    ev.stopPropagation();

    const cols = vtt.vtt.grid.cols || 1;
    const rows = vtt.vtt.grid.rows || 1;
    const startX = token.x;
    const startY = token.y;
    let newX = startX + dx;
    let newY = startY + dy;
    newX = Math.max(0, Math.min(cols - 1, newX));
    newY = Math.max(0, Math.min(rows - 1, newY));

    if (newX === startX && newY === startY){
        liveMessage.value = `${token.name || ('Token ' + token.id)} is at the edge of the grid.`;
        return;
    }

    vtt.setTokenPosition(token.id, newX, newY);
    draw();
    const ddx = newX - startX;
    const ddy = newY - startY;
    const dir = ddx < 0 ? 'left' : ddx > 0 ? 'right' : ddy < 0 ? 'up' : 'down';
    const steps = Math.abs(ddx || ddy);
    const label = token.name || ('Token ' + token.id);
    liveMessage.value = `Moved ${label} ${steps > 1 ? steps + ' fields ' : 'one field '} ${dir}.`;
}

onMounted(async () => {
    await ensureMapLoaded();
    await loadCampaignCharacters();
    await nextTick();
    const canvas = canvasRef.value;
    ctx = canvas.getContext('2d');

    function resizeCanvas(){
        if (!canvas) return;
        const container = canvas.parentElement;
        const displayWidth = container.clientWidth;
        const displayHeight = container.clientHeight;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.round(displayWidth * dpr);
        canvas.height = Math.round(displayHeight * dpr);

        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';

        ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        draw();
    }

    image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = vtt.vtt.imageURL;
    image.onload = () => {
           imageW.value = image.naturalWidth || image.width || 1000;
           imageH.value = image.naturalHeight || image.height || 600;
           resizeCanvas();
           draw();
    };

    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('mousemove', onCanvasMouseMove);
        canvas.addEventListener('mousedown', startBgPan);
        canvas.addEventListener('wheel', onWheel, { passive: false });

    // global handlers: clicking outside tokens deselects; Esc clears selection
    function onDocumentClick(ev){
        // Ignore clicks inside the VTT overlay
        const overlay = canvas.parentElement && canvas.parentElement.querySelector('.vtt-overlay');
        if (overlay && overlay.contains(ev.target)) return;

        // Ignore clicks on interactive form controls elsewhere in the app
        const tgt = ev.target;
        const tag = tgt && tgt.tagName;
        const isControl = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || (tgt && tgt.isContentEditable);
        if (isControl) return;

        // Deselect any active token; do not forcibly blur global active element
        vtt.setActiveToken(null);
    }

    function onDocumentKeydown(ev){
        // ignore when typing in inputs or editable elements
        const tgt = ev.target;
        const isEditable = tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable);
        if (isEditable) return;

        if (ev.key === 'Escape' || ev.key === 'Esc'){
            // if currently placing a character, cancel placement
            if (placingCharacter.value) {
                placingCharacter.value = null;
                previewPos.value = null;
                placingToast.value = '';
                try { if (document && document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch(e) {}
                draw();
                ev.preventDefault();
                ev.stopPropagation();
                return;
            }

            vtt.setActiveToken(null);
            try { if (document && document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch(e) {}
            return;
        }

        // pan with Ctrl/Meta + Arrow keys (and provide Ctrl + WASD fallback)
        const isCtrlLike = (ev.ctrlKey || ev.metaKey);
        const isArrow = (ev.key === 'ArrowUp' || ev.key === 'ArrowDown' || ev.key === 'ArrowLeft' || ev.key === 'ArrowRight');
        const isWASD = (ev.key === 'w' || ev.key === 'W' || ev.key === 'a' || ev.key === 'A' || ev.key === 's' || ev.key === 'S' || ev.key === 'd' || ev.key === 'D');
        if (isCtrlLike && (isArrow || isWASD)){
            // compute step: try to use one grid cell (scaled by zoom) or fallback to 20px
            let step = 20;
            try {
                const cols = vtt.vtt.grid.cols;
                const rows = vtt.vtt.grid.rows;
                const baseCellW = imageW.value / (cols || 1);
                const baseCellH = imageH.value / (rows || 1);
                const baseCell = Math.max(baseCellW, baseCellH) || 20;
                step = Math.max(10, Math.round(baseCell * zoom.value));
            } catch (e) {}

            const k = ev.key;
            if (k === 'ArrowLeft' || k === 'a' || k === 'A') pan.x -= step;
            else if (k === 'ArrowRight' || k === 'd' || k === 'D') pan.x += step;
            else if (k === 'ArrowUp' || k === 'w' || k === 'W') pan.y -= step;
            else if (k === 'ArrowDown' || k === 's' || k === 'S') pan.y += step;

            draw();
            ev.preventDefault();
            ev.stopPropagation();
            return;
        }

        // zoom with + / - keys (also handle = with shift for + and Numpad keys)
        if (ev.key === 'Enter' && placingCharacter.value){
            // place token at first available cell
            const cell = findFirstEmptyCell();
            const created = vtt.createToken({ character: placingCharacter.value, x: cell.x, y: cell.y });
            placingCharacter.value = null;
            previewPos.value = null;
            draw();
            vtt.setActiveToken(created.id);
            nextTick(() => {
                const selector = `[data-token-id="${created.id}"]`;
                const btn = document.querySelector(selector);
                if (btn && typeof btn.focus === 'function') btn.focus();
            });
            ev.preventDefault();
            ev.stopPropagation();
            return;
        }

        if (ev.key === '+' || ev.key === '=' || ev.key === '-' || ev.code === 'NumpadAdd' || ev.code === 'NumpadSubtract'){
            // determine zoom factor
            const add = ev.key === '+' || ev.code === 'NumpadAdd' || (ev.key === '=' && ev.shiftKey);
            const factor = add ? 1.1 : 0.9;
            // zoom centered on canvas center
            const canvas = canvasRef.value;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const cx = rect.left + rect.width/2;
            const cy = rect.top + rect.height/2;
            zoomAtPoint(cx, cy, factor);
            ev.preventDefault();
            ev.stopPropagation();
        }
    }

    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeydown);

    window.addEventListener('resize', resizeCanvas);

    watch(() => [vtt.vtt.grid.cols, vtt.vtt.grid.rows], () => {
        resizeCanvas();
    });

    onUnmounted(() => {
        canvas.removeEventListener('click', onCanvasClick);
        canvas.removeEventListener('mousemove', onCanvasMouseMove);
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('mousedown', startBgPan);
        canvas.removeEventListener('wheel', onWheel);
        document.removeEventListener('click', onDocumentClick);
        document.removeEventListener('keydown', onDocumentKeydown);
    });
});

watch(() => vtt.vtt.imageURL, (nv) => {
    if (!nv) return;
    image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = nv;
    image.onload = draw;
});

watch(() => [vtt.visibleTokens.length, JSON.stringify(vtt.vtt.grid)], () => {
    draw();
});

watch(() => JSON.stringify(vtt.tokens), () => {
    draw();
});

function _imgForToken(token){
    const charId = token && token.character_id;
    const cached = _imgCache.get(charId);
    if (cached instanceof Image && cached.complete) {
        // return the blob URL if the image was loaded from server; if src is set, return that
        return cached.src || null;
    }
    if (cached === null) return null;
    // kick off loading if not started
    if (charId && cached === undefined) getTokenImageForCharacter(charId);
    return null;
}

function _initialForToken(token){
    if (!token) return '?';
    const name = token.name || '';
    const first = name.trim()[0] || '?';
    return first.toUpperCase();
}

// preload for characters already loaded
watch(() => characterStore.characters.map(c => c.id).join(','), (nv) => {
    (characterStore.characters || []).forEach(c => {
        if (!c || !c.id) return;
        if (!_imgCache.has(c.id)) getTokenImageForCharacter(c.id);
    });
});

watch(() => map.currentMap && map.currentMap.campaign_id, (nv) => {
    if (nv) loadCampaignCharacters();
});

function selectCharacter(c){
    const ev = new CustomEvent('vtt-character-select', { detail: c, bubbles: true });
    canvasRef.value && canvasRef.value.dispatchEvent(ev);
}

watch(() => placingCharacter.value, (nv) => {
    if (nv) {
        placingToast.value = `Placing ${nv.first_name || nv.name || 'character'}. Click on the map or press Enter to place. Press Escape to cancel.`;
        // Also announce via persistent live region for reliable SR output
        liveMessage.value = placingToast.value;
    } else {
        placingToast.value = '';
    }
});


</script>

<style scoped>
.vtt-placement-toast{
    position: fixed;
    left: 16px;
    bottom: 24px;
    background: rgba(0,0,0,0.85);
    color: #fff;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 14px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.35);
    z-index: 1200;
}
</style>