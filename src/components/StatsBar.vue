<template>
  <section class="stats-bar" aria-label="Community impact statistics">
    <div class="stats-container">
      <div v-for="stat in stats" :key="stat.label" class="stat-item">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommunityStore } from '@/stores/community'

const store = useCommunityStore()
const { impactTotals } = storeToRefs(store)

const formatter = new Intl.NumberFormat('en-US')

const stats = computed(() => [
  { 
    label: 'Total Budget', 
    value: `$${formatter.format(impactTotals.value.totalBudget)}` 
  },
  { 
    label: 'Raised', 
    value: `$${formatter.format(impactTotals.value.totalRaised)}`,
    highlight: true
  },
  { 
    label: 'Active Projects', 
    value: formatter.format(impactTotals.value.activeProjects) 
  },
  { 
    label: 'Citizens Engaged', 
    value: formatter.format(impactTotals.value.citizensEngaged) 
  },
  { 
    label: 'Meals Served', 
    value: formatter.format(impactTotals.value.meals) 
  },
  { 
    label: 'Trees Planted', 
    value: formatter.format(impactTotals.value.trees) 
  }
])
</script>

<style scoped>
.stats-bar {
  background-color: var(--color-background-alt);
  padding: 1.5rem 0;
  overflow-x: auto;
}

.stats-container {
  display: flex;
  gap: 2rem;
  padding: 0 2rem;
  max-width: 1440px;
  margin: 0 auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin-top: 0.25rem;
}

/* Highlight the raised amount */
.stat-item:nth-child(2) .stat-value {
  color: var(--color-accent);
  font-size: 1.75rem;
}

@media (max-width: 1024px) {
  .stats-container {
    gap: 1.5rem;
    padding: 0 1.5rem;
  }
  
  .stat-item {
    min-width: 100px;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .stat-item:nth-child(2) .stat-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .stats-container {
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .stat-item {
    min-width: 80px;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .stat-item:nth-child(2) .stat-value {
    font-size: 1.25rem;
  }
}
</style>
