<template>
  <div class="app-shell">
    <AppHeader :dark-mode="darkMode" @toggle-theme="toggleTheme" />

    <main class="main-content">
      <HeroSection :totals="impactTotals" :spotlight="highlightProject" />

      <ImpactStats :totals="impactTotals" />

      <FilterBar />

      <ProjectList />

      <OpenDataSection id="open-data" :datasets="openDataSets" />

      <AboutSection id="about" :content="aboutContent" />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useCommunityStore } from './stores/community'
import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import ImpactStats from './components/ImpactStats.vue'
import FilterBar from './components/FilterBar.vue'
import ProjectList from './components/ProjectList.vue'
import OpenDataSection from './components/OpenDataSection.vue'
import AboutSection from './components/AboutSection.vue'
import AppFooter from './components/AppFooter.vue'

const store = useCommunityStore()
const { impactTotals, highlightProject, darkMode, aboutContent, openDataSets } = storeToRefs(store)

// Initialize store data
onMounted(() => {
  store.fetchProjects()
})

const toggleTheme = () => {
  store.toggleDarkMode()
}
</script>
