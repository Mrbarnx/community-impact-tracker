<template>
  <section class="impact-stats" aria-labelledby="impact-heading">
    <div class="stats-inner">
      <article
        v-for="card in cards"
        :key="card.title"
        class="stat-card"
        :data-tone="card.tone"
        :aria-label="`${card.title} ${card.value}`"
      >
        <header>
          <span>{{ card.title }}</span>
          <span class="material-symbols-outlined" aria-hidden="true">{{ card.icon }}</span>
        </header>
        <div class="stat-value">
          {{ card.value }}
        </div>
        <div class="stat-meta" :data-tone="card.tone">
          <span class="material-symbols-outlined" aria-hidden="true">trending_up</span>
          {{ card.delta }}
        </div>
        <div class="progress">
          <div class="progress-track" :style="{ '--progress': card.progress }"></div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommunityStore } from '@/stores/community'
import type { ImpactTotals } from '@/stores/community'

const store = useCommunityStore()
const { impactTotals } = storeToRefs(store)

const formatter = new Intl.NumberFormat('en-US')

const cards = computed(() => {
  const totals = impactTotals.value
  const formatter = new Intl.NumberFormat('en-US')
  
  return [
    {
      title: 'Total Budget',
      icon: 'account_balance',
      value: `$${formatter.format(totals.totalBudget)}`,
      progress: 100,
      description: 'Total allocated budget for all projects',
      tone: 'success',
      delta: 'Allocated'
    },
    {
      title: 'Raised',
      icon: 'savings',
      value: `$${formatter.format(totals.totalRaised)}`,
      progress: totals.totalBudget > 0 
        ? Math.min(100, (totals.totalRaised / totals.totalBudget) * 100)
        : 0,
      description: 'Total funds raised from all sources',
      tone: 'info',
      delta: `${Math.round((totals.totalRaised / totals.totalBudget) * 100)}% of goal`
    },
    {
      title: 'Active Projects',
      icon: 'engineering',
      value: formatter.format(totals.activeProjects),
      progress: Math.min(100, (totals.activeProjects / 50) * 100),
      description: 'Number of active community projects',
      tone: 'accent',
      delta: `${Math.round((totals.activeProjects / 50) * 100)}% capacity`
    },
    {
      title: 'Citizens Engaged',
      icon: 'groups',
      value: formatter.format(totals.citizensEngaged),
      progress: Math.min(100, (totals.citizensEngaged / 10000) * 100),
      description: 'Total community members involved',
      tone: 'success',
      delta: `${Math.round((totals.citizensEngaged / 1000) * 10)}% of target`
    }
  ]
})
</script>
