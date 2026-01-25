import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initFocusMode } from './utils/focusMode'

import App from './App.vue'
import router from './router'

// Apply persisted theme variables before mounting so UI doesn't flash
try{
	const p = localStorage.getItem('--primary')
	const s = localStorage.getItem('--secondary')
	const w = localStorage.getItem('--white-accent')
	const b = localStorage.getItem('--bg')
	const f = localStorage.getItem('--focus-ring-color')
	const fb = localStorage.getItem('--focus-ring-bg')
	if(p) document.documentElement.style.setProperty('--primary', p)
	if(s) document.documentElement.style.setProperty('--secondary', s)
	if(w) document.documentElement.style.setProperty('--white-accent', w)
	if(b) document.documentElement.style.setProperty('--bg', b)
	if(f) document.documentElement.style.setProperty('--focus-ring-color', f)
	if(fb) document.documentElement.style.setProperty('--focus-ring-bg', fb)
}catch(e){}

const app = createApp(App)

app.use(createPinia())
app.use(router)

// initialize focus mode (adds .user-is-tabbing while user navigates via keyboard)
initFocusMode()

app.mount('#app')
