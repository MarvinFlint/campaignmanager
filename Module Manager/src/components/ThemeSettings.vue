<template>
    <div class="theme-settings">
        <button class="cog" @click="toggle" :aria-expanded="open" aria-label="Theme settings">
            <img src="/cog-icon.svg" alt="Theme settings" width="22" height="22"/>
        </button>
        <div v-if="open" class="panel" role="dialog" aria-label="Theme settings panel">
            <label>Primary<br/><input type="color" v-model="primary" @input="apply"/></label>
            <label>Secondary<br/><input type="color" v-model="secondary" @input="apply"/></label>
            <label>Accent Color<br/><input type="color" v-model="whiteAccent" @input="apply"/></label>
            <label>Background<br/><input type="color" v-model="bg" @input="apply"/></label>
            <label>Focus Ring<br/><input type="color" v-model="focusRing" @input="apply"/></label>      
            <div class="actions">
                <button class="default-button small" @click="resetAll">Reset</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const open = ref(false)
const primary = ref(getInitial('--primary', '#0077ff'))
const secondary = ref(getInitial('--secondary', '#333333'))
const whiteAccent = ref(getInitial('--white-accent', '#f5f5f5'))
const bg = ref(getInitial('--bg', '#0b0b0b'))
const focusRing = ref(getInitial('--focus-ring-color', 'rgba(102,163,255,0.95)'))
const focusRingBg = ref(getInitial('--focus-ring-bg', 'rgba(102,163,255,0.06)'))

function toggle(){ open.value = !open.value }
function reset(){ primary.value = '#0077ff'; secondary.value = '#333333'; whiteAccent.value = '#f5f5f5'; bg.value = '#0b0b0b'; focusRing.value = 'rgba(102,163,255,0.95)'; apply() }

function resetAll(){
    try{
        localStorage.removeItem('--primary')
        localStorage.removeItem('--secondary')
        localStorage.removeItem('--white-accent')
        localStorage.removeItem('--bg')
        localStorage.removeItem('--focus-ring-color')
    }
    catch(e){

    }

    document.documentElement.style.removeProperty('--primary')
    document.documentElement.style.removeProperty('--secondary')
    document.documentElement.style.removeProperty('--white-accent')
    document.documentElement.style.removeProperty('--bg')
    document.documentElement.style.removeProperty('--focus-ring-color')

    primary.value = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0077ff'
    secondary.value = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#333333'
    whiteAccent.value = getComputedStyle(document.documentElement).getPropertyValue('--white-accent').trim() || '#f5f5f5'
    bg.value = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0b0b0b'
    focusRing.value = getComputedStyle(document.documentElement).getPropertyValue('--focus-ring-color').trim() || 'rgba(102,163,255,0.95)'
    focusRingBg.value = getComputedStyle(document.documentElement).getPropertyValue('--focus-ring-bg').trim() || 'rgba(102,163,255,0.06)'
}

function getInitial(varName, fallback){
    try{
        const stored = localStorage.getItem(varName)
        if(stored) return stored
    } catch(e){}
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback
}

function apply(){
    document.documentElement.style.setProperty('--primary', primary.value)
    document.documentElement.style.setProperty('--secondary', secondary.value)
    document.documentElement.style.setProperty('--white-accent', whiteAccent.value)
    document.documentElement.style.setProperty('--bg', bg.value)
    document.documentElement.style.setProperty('--focus-ring-color', focusRing.value)
    document.documentElement.style.setProperty('--focus-ring-bg', focusRingBg.value)
    try{
        localStorage.setItem('--primary', primary.value);
        localStorage.setItem('--secondary', secondary.value);
        localStorage.setItem('--white-accent', whiteAccent.value);
        localStorage.setItem('--bg', bg.value);
        localStorage.setItem('--focus-ring-color', focusRing.value);
        localStorage.setItem('--focus-ring-bg', focusRingBg.value);
    }catch(e){

    }
}

onMounted(()=>{
    apply()
})
</script>