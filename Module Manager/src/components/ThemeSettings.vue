<script setup>
import { ref, onMounted } from 'vue'

const open = ref(false)
const primary = ref(getInitial('--primary', '#0077ff'))
const secondary = ref(getInitial('--secondary', '#333333'))
const whiteAccent = ref(getInitial('--white-accent', '#f5f5f5'))
const bg = ref(getInitial('--bg', '#0b0b0b'))

function toggle(){ open.value = !open.value }
function reset(){ primary.value = '#0077ff'; secondary.value = '#333333'; whiteAccent.value = '#f5f5f5'; bg.value = '#0b0b0b'; apply() }

function resetAll(){
  try{
    // remove persisted values
    localStorage.removeItem('--primary')
    localStorage.removeItem('--secondary')
    localStorage.removeItem('--white-accent')
    localStorage.removeItem('--bg')
  }catch(e){}

  // remove inline styles so CSS defaults apply
  document.documentElement.style.removeProperty('--primary')
  document.documentElement.style.removeProperty('--secondary')
  document.documentElement.style.removeProperty('--white-accent')
  document.documentElement.style.removeProperty('--bg')

  // refresh local values from computed style (falls back to variables.scss)
  primary.value = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0077ff'
  secondary.value = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#333333'
  whiteAccent.value = getComputedStyle(document.documentElement).getPropertyValue('--white-accent').trim() || '#f5f5f5'
  bg.value = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0b0b0b'
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
  try{
    localStorage.setItem('--primary', primary.value);
    localStorage.setItem('--secondary', secondary.value);
    localStorage.setItem('--white-accent', whiteAccent.value);
    localStorage.setItem('--bg', bg.value);
  }catch(e){}
}

onMounted(()=>{
    apply()
})
</script>

<template>
  <div class="theme-settings">
    <button class="cog" @click="toggle" :aria-expanded="open" aria-label="Theme settings">
      <img src="/cog-icon.svg" alt="Theme settings" width="22" height="22"/>
    </button>
    <div v-if="open" class="panel" role="dialog" aria-label="Theme settings panel">
      <label>Primary<br/><input type="color" v-model="primary" @input="apply"/></label>
      <label>Secondary<br/><input type="color" v-model="secondary" @input="apply"/></label>
      <label>Text Color<br/><input type="color" v-model="whiteAccent" @input="apply"/></label>
      <label>Background<br/><input type="color" v-model="bg" @input="apply"/></label>
      <div class="actions">
        <button @click="reset">Reset (persist)</button>
        <button @click="resetAll" style="margin-left:8px;">Reset All</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-settings{ position: relative; }
.cog{ background: transparent; border: none; padding: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center }
.cog img{ display: block; width: 22px; height: 22px }
.cog{ line-height: 0 }
.panel{ position: absolute; right: 0; top: 36px; background: var(--white-accent); color: #111; padding: 10px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 50; }
.panel label{ display: block; margin-bottom: 8px; font-size: 14px }
.panel input[type="color"]{ width: 48px; height: 32px; border: none; padding: 0; background: transparent }
.panel .actions{ text-align: right }
button{ cursor: pointer }
</style>
