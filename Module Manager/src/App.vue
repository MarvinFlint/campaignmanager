<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <nav class="nav" role="navigation">
        <RouterLink to="/"><img class="nav-icon" alt="Navigation Home Icon" src="../public/icon.png"></RouterLink>
        <RouterLink to="/overview">Overview</RouterLink>
        <RouterLink to="/campaigns">Campaigns</RouterLink>
    </nav>
    <div class="main" role="main">
        <RouterView />
    </div>        
</template>