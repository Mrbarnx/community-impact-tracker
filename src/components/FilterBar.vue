<template>
  <section class="filter-section" aria-labelledby="filters-heading">
    <div class="filter-inner">
      <h2 id="filters-heading" class="visually-hidden">Project filters</h2>

      <div class="search-bar">
        <label class="search-input" aria-label="Search projects">
          <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
            <path
              d="m21 21-4.35-4.35M19 11.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
          <input
            v-model="search"
            type="search"
            placeholder="Search projects..."
            autocomplete="off"
            aria-label="Search projects"
          />
        </label>

        <label class="location-select">
          <span class="visually-hidden">Filter by location</span>
          <select :value="filters.location" @change="onLocationChange">
            <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
          </select>
        </label>
      </div>

      <div class="sector-filters" role="group" aria-label="Filter by project sector">
        <button
          v-for="sector in sectors"
          :key="sector.key"
          type="button"
          :class="{ active: filters.sector === sector.key }"
          @click="onSectorChange(sector.key)"
        >
          {{ sector.label }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCommunityStore, type FilterState, type ProjectCause } from '@/stores/community'

const store = useCommunityStore()

const filters = computed(() => store.filters)
const locations = computed(() => store.locationOptions)

const search = ref(filters.value.search)

const sectors = [
  { key: 'All' as const, label: 'All Sectors' },
  { key: 'Health' as const, label: 'Health' },
  { key: 'Education' as const, label: 'Education' },
  { key: 'Infrastructure' as const, label: 'Infrastructure' },
  { key: 'Environment' as const, label: 'Environment' },
  { key: 'Food' as const, label: 'Food' },
]

watch(search, (value) => {
  store.setFilter({ search: value })
})

watch(
  () => filters.value.search,
  (value) => {
    if (value !== search.value) {
      search.value = value
    }
  }
)

const onSectorChange = (sector: FilterState['sector']) => {
  if (filters.value.sector === sector) return
  store.setFilter({ sector })
}

const onLocationChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as FilterState['location']
  store.setFilter({ location: value })
}
</script>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
