<template>
  <section class="hero" id="overview">
    <div class="hero-inner">
      <div class="hero-content">
        <div>
          <h1>
            Tracking Our<br />
            <span>Impact Delivered</span>
          </h1>
          <p>
            Real-time data on civic projects and funding transparency. See where every dollar goes and the lives
            changed.
          </p>
        </div>

        <div class="stats-grid" aria-label="Impact metrics">
          <article v-for="stat in heroStats" :key="stat.label" class="stat">
            <h3>{{ stat.value }}</h3>
            <span>{{ stat.label }}</span>
          </article>
        </div>

        <div class="hero-actions">
          <button class="primary" type="button">View Latest Reports</button>
          <button class="secondary" type="button">
            <svg aria-hidden="true" class="icon" fill="none" height="18" viewBox="0 0 24 24" width="18">
              <path
                d="M8 5v14l11-7z"
                fill="currentColor"
              />
            </svg>
            How it works
          </button>
        </div>
      </div>

      <aside class="hero-metrics" aria-label="Project spotlight">
        <div class="hero-media" role="img" :aria-label="spotlight?.subtitle">
          <img v-if="spotlight" :src="spotlight.thumbnail" :alt="`${spotlight.title} preview`" />
          <div v-if="spotlight" class="media-overlay">
            <div>
              <p>{{ spotlight.title }}</p>
              <span>{{ spotlight.subtitle }}</span>
            </div>
            <div class="status-pill" :data-tone="spotlight.badgeTone">
              <span class="status-indicator" aria-hidden="true"></span>
              {{ spotlight.badge }}
            </div>
          </div>
          <button class="play-button" type="button" aria-label="Play spotlight video">
            <svg aria-hidden="true" fill="none" height="26" viewBox="0 0 24 24" width="26">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommunityStore } from '@/stores/community'
import type { ImpactTotals, SpotlightProject } from '@/stores/community'

const store = useCommunityStore()
const { impactTotals, highlightProject } = storeToRefs(store)

const formatter = new Intl.NumberFormat('en-US')

const heroStats = computed(() => [
  { label: 'Meals Served', value: formatter.format(impactTotals.value.meals) },
  { label: 'Trees Planted', value: formatter.format(impactTotals.value.trees) },
  { label: 'Volunteers', value: formatter.format(impactTotals.value.volunteers) },
])

const spotlight = computed(() => highlightProject.value)
</script>
