<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ThemeSettings from './components/ThemeSettings.vue'
</script>

<template>
    <a href="#main" class="skip-link">Skip to main content</a>

    <nav class="nav" role="navigation" aria-label="Main navigation">
        <ul class="nav-list">
            <li class="nav-item">
                <RouterLink to="/" class="nav-link" aria-label="Home">
                    <img class="nav-icon" alt="Home" src="/icon.png" />
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/overview" class="nav-link" aria-label="Overview" aria-current="page">Overview</RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/campaigns" class="nav-link" aria-label="Campaigns">Campaigns</RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/resources" class="nav-link" aria-label="Resources">Resources</RouterLink>
            </li>
            <li class="nav-item nav-settings" aria-hidden="false">
                <ThemeSettings />
            </li>
        </ul>
    </nav>
    <main id="main" class="main">
        <RouterView />
    </main>        
</template>

<style>
.skip-link {
  position: absolute;
  left: -999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  width: auto;
  height: auto;
  background: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  z-index: 1000;
}
.nav-list {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
  align-items: center;
}
.nav-icon { height: 24px; width: 24px; }
</style>