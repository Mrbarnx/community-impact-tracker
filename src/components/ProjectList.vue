<template>
  <section class="projects-section" id="projects">
    <div class="projects-inner">
      <div v-if="error" class="surface-card error-state" role="alert">
        <div class="error-content">
          <h3>Unable to load projects</h3>
          <p>{{ error }}</p>
        </div>
        <button type="button" @click="reload">Try again</button>
      </div>

      <div v-if="loading" class="projects-grid" aria-live="polite">
        <ProjectCard v-for="index in skeletonCount" :key="`skeleton-${index}`" :is-skeleton="true" />
      </div>

      <template v-else>
        <div v-if="displayedProjects.length" class="projects-grid">
          <ProjectCard v-for="project in displayedProjects" :key="project.id" :project="project" />
        </div>

        <EmptyState v-else @clear="clearFilters" />

        <button v-if="showLoadMore" class="load-more" type="button" @click="loadMore">
          Load More Projects
        </button>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import ProjectCard from './ProjectCard.vue'
import EmptyState from './EmptyState.vue'
import { useCommunityStore } from '@/stores/community'

const BASE_COUNT = 6
const SKELETON_COUNT = 6

const store = useCommunityStore()
const { filteredProjects, loading, error } = storeToRefs(store)

const visibleCount = ref(0)

watch(
  () => filteredProjects.value.length,
  (length) => {
    visibleCount.value = length === 0 ? 0 : Math.min(length, BASE_COUNT)
  },
  { immediate: true }
)

const displayedProjects = computed(() => {
  if (visibleCount.value === 0) return []
  return filteredProjects.value.slice(0, visibleCount.value)
})

const showLoadMore = computed(
  () => !loading.value && filteredProjects.value.length > visibleCount.value
)

const skeletonCount = computed(() => SKELETON_COUNT)

const loadMore = () => {
  visibleCount.value = Math.min(filteredProjects.value.length, visibleCount.value + BASE_COUNT)
}

const clearFilters = () => {
  store.resetFilters()
}

const reload = () => {
  store.fetchProjects()
}

onMounted(() => {
  if (!store.projects.length) {
    store.fetchProjects()
  }
})
</script>
