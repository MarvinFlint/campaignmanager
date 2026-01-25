<template>
    <section class="map-details">
        <button class="tab back-tab" @click="goBack" aria-label="Back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
        <h2>{{ mapStore.currentMap?.title }}</h2>    
        <div class="map-container">
              <div class="map-actions">
                  <div class="notes-column">
                <p v-if="!editingNotes">{{ mapStore.currentMap?.notes || 'No notes for this map.' }}</p>
                <div v-else>
                    <label for="notes-textarea">Notes</label>
                    <textarea id="notes-textarea" v-model="notes"></textarea>
                </div>
                <div class="textarea-buttons">
                    <button aria-label="Edit notes" class="edit-button icon-button" v-if="!editingNotes" @click="startEdit"><img class="edit-icon button-icon" alt="Edit Icon" src="/edit_icon.png" /></button>
                    <button aria-label="Save notes" class="save-button icon-button" v-if="editingNotes" @click="saveNotes"><img class="confirm-icon button-icon" alt="Confirm changes" src="/checkmark.svg"></button>
                    <button aria-label="Discard changes" class="discard-button icon-button" v-if="editingNotes" @click="cancelEdit"><img class="discard-icon button-icon" alt="Discard changes" src="/cross.jpg"></button>
                </div>
            </div>
                <router-link v-if="mapStore.currentMap && mapStore.currentMap.id" :to="{ name: 'tabletop', params: { mapId: mapStore.currentMap.id } }">
                    <button class="tab play-tab">Play</button>
                </router-link>               
                <button class="tab image-tab" type="button" @click="toggleImageControls">Upload</button>
                <div v-if="showImageControls" class="image-controls">
                    <div v-if="previewDataUrl" class="preview">
                        <p>Preview</p>
                        <img :src="previewDataUrl" alt="Preview" />
                    </div>
                    <div class="file-row">
                        <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" />
                        <button class="upload-button" :disabled="!selectedFile || uploading" @click="uploadImage">Upload</button>
                        <button class="cancel-button" v-if="selectedFile && !uploading" @click="toggleImageControls">Cancel</button>
                        <div v-if="uploading" class="uploading">Uploading...</div>
                    </div>
                <div v-if="uploadError" class="upload-error">{{ uploadError }}</div>
                </div>
            </div>           
            <div class="map-image" :key="mapStore.currentMap?.id">
                <template v-if="mapStore.currentMap?.image">
                    <div v-if="imageLoading" class="loading">
                        <div class="spinner" role="status" aria-hidden="true"></div>
                        <span class="sr-only">Loading image...</span>
                    </div>
                    <img
                        v-if="displayedSrc && !imageLoading && !imageError"
                        :src="displayedSrc"
                        :alt="`Image of ${mapStore.currentMap.title}`"
                    />
                    <div v-if="imageError && !imageLoading">
                        <p>No image available for this map.</p>
                    </div>
                </template>
                <template v-else>
                    <p>No image available for this map.</p>
                </template>
            </div>            
            
        </div>
        
    </section>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();
const router = useRouter();

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const imageUrl = computed(() => mapStore.currentMap?.id ? `${apiBase.replace(/\/$/, '')}/maps/${mapStore.currentMap.id}/image` : '');

const imageLoading = ref(false);
const imageError = ref(false);
const displayedSrc = ref('');
const editingNotes = ref(false);
const notes = ref('');

// Preload the image using a JS Image to avoid flashes of previous images
watch(
    () => mapStore.currentMap?.id,
    (newId) => {
        // reset state immediately so previous image is removed
        displayedSrc.value = '';
        imageError.value = false;

        if (!newId) {
            imageLoading.value = false;
            return;
        }

        const newUrl = imageUrl.value;
        if (!newUrl) {
            imageLoading.value = false;
            return;
        }

        imageLoading.value = true;

        const img = new Image();
        img.onload = () => {
            displayedSrc.value = newUrl;
            imageLoading.value = false;
            imageError.value = false;
        };
        img.onerror = () => {
            displayedSrc.value = '';
            imageLoading.value = false;
            imageError.value = true;
        };
        // start loading after handlers are attached
        img.src = newUrl;
    },
    { immediate: true }
);

// sync notes when current map changes
watch(() => mapStore.currentMap, (newMap) => {
    notes.value = newMap?.notes || '';
    editingNotes.value = false;
}, { immediate: true });

const startEdit = () => {
    editingNotes.value = true;
};

const cancelEdit = () => {
    editingNotes.value = false;
    notes.value = mapStore.currentMap?.notes || '';
};

const goBack = () => {
    const areaId = mapStore.currentMap?.area_id || mapStore.currentMap?.areaId;
    if (areaId) {
        router.push({ name: 'area', params: { id: String(areaId) } });
    } else {
        router.back();
    }
};

const saveNotes = async () => {
    if (!mapStore.currentMap) return;
    try {
        await mapStore.updateMap({ id: mapStore.currentMap.id, title: mapStore.currentMap.title, notes: notes.value });
        editingNotes.value = false;
    } catch (err) {
        console.error('Failed to save notes', err);
        // keep editing state so user can retry
    }
};

// Image upload state
const selectedFile = ref(null);
const previewDataUrl = ref('');
const uploading = ref(false);
const uploadError = ref('');
const fileInput = ref(null);
const showImageControls = ref(false);

const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
        clearSelection();
        return;
    }
    selectedFile.value = f;
    uploadError.value = '';
    // preview via FileReader
    const reader = new FileReader();
    reader.onload = (ev) => {
        previewDataUrl.value = ev.target.result;
    };
    reader.readAsDataURL(f);
};

const clearSelection = () => {
    selectedFile.value = null;
    previewDataUrl.value = '';
    uploadError.value = '';
    if (fileInput.value) fileInput.value.value = '';
};

const toggleImageControls = () => {
    showImageControls.value = !showImageControls.value;
    if (!showImageControls.value) {
        clearSelection();
    }
};

const uploadImage = async () => {
    if (!selectedFile.value || !mapStore.currentMap) return;
    uploading.value = true;
    uploadError.value = '';
    try {
        const data = await mapStore.uploadMapImage(selectedFile.value, mapStore.currentMap.id);
        // refresh server image by reloading the preloaded src
        const newUrl = `${apiBase.replace(/\/$/, '')}/maps/${mapStore.currentMap.id}/image?ts=${Date.now()}`;
        displayedSrc.value = '';
        imageLoading.value = true;
        const img = new Image();
        img.onload = () => {
            displayedSrc.value = newUrl;
            imageLoading.value = false;
            imageError.value = false;
            clearSelection();
        };
        img.onerror = () => {
            uploadError.value = 'Uploaded but failed to load server image';
            imageLoading.value = false;
            imageError.value = true;
        };
        img.src = newUrl;
    } catch (err) {
        console.error(err);
        uploadError.value = err.message || 'Upload failed';
    } finally {
        uploading.value = false;
        toggleImageControls();
    }
};
</script>