<template>
  <article class="project-card" :class="{ skeleton: isSkeleton }">
    <div v-if="isSkeleton" class="card-skeleton" aria-hidden="true">
      <div class="skeleton-banner"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-pill"></div>
    </div>

    <div v-else-if="project" class="card-content">
      <div class="card-image">
        <img :src="project.thumbnail" :alt="`${project.title} project`" loading="lazy" />
        <span class="status-tag" :class="`status-tag--${project.statusVariant}`">{{ statusLabel }}</span>
        <span class="cause-chip">{{ project.cause }}</span>
        <div class="card-overlay"></div>
      </div>

      <div class="card-body">
        <header class="card-header">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
        </header>

        <div class="card-meta">
          <div class="meta-item">
            <span class="material-symbols-outlined" aria-hidden="true">location_on</span>
            <span>{{ project.location }}</span>
          </div>
          <div class="meta-item">
            <span class="material-symbols-outlined" aria-hidden="true">event</span>
            <span>{{ project.dateLabel }}</span>
          </div>
        </div>

        <div class="funding">
          <div class="funding-meta">
            <div>
              <span class="label">Funding Raised</span>
              <strong>{{ formattedRaised }}</strong>
            </div>
            <span class="target">Target {{ formattedGoal }}</span>
          </div>

          <div class="progress-track">
            <div
              class="progress-fill"
              role="progressbar"
              :aria-valuenow="fundingProgress"
              aria-valuemin="0"
              aria-valuemax="100"
              :style="{ width: `${fundingProgress}%` }"
            ></div>
          </div>

          <div class="funding-insight">
            <span>{{ fundingStatus }}</span>
            <span>{{ volunteersLabel }}</span>
          </div>
        </div>

        <button class="project-button" type="button" @click="showProjectDetails">
          Explore project
          <span class="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/stores/community'

const props = withDefaults(
  defineProps<{
    project?: Project
    isSkeleton?: boolean
  }>(),
  {
    isSkeleton: false,
  }
)

const emit = defineEmits<{
  (e: 'view-details', project: Project): void
}>()

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const fundingProgress = computed(() => {
  if (!props.project || props.project.fundingGoal <= 0) return 0
  const value = (props.project.fundingRaised / props.project.fundingGoal) * 100
  return Math.max(0, Math.min(100, Math.round(value)))
})

const formattedRaised = computed(() =>
  props.project ? currencyFormatter.format(props.project.fundingRaised) : currencyFormatter.format(0)
)

const formattedGoal = computed(() =>
  props.project ? currencyFormatter.format(props.project.fundingGoal) : currencyFormatter.format(0)
)

const fundingStatus = computed(() => {
  if (fundingProgress.value >= 100) return 'Goal reached'
  if (fundingProgress.value >= 80) return 'On track to goal'
  return `${fundingProgress.value}% funded`
})

const volunteersLabel = computed(() => {
  if (!props.project) return ''
  const count = props.project.volunteers ?? 0
  return `${count} volunteer${count === 1 ? '' : 's'}`
})

const statusLabel = computed(() => props.project?.status ?? 'In progress')

const showProjectDetails = () => {
  if (props.project) {
    emit('view-details', props.project)
  }
}
</script>

<style scoped>
.project-card {
  position: relative;
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  min-height: 100%;
}

.project-card:hover,
.project-card:focus-within {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
}

.project-card .card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-image {
  position: relative;
  height: 192px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.project-card:hover .card-image img {
  transform: scale(1.05);
}

.status-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  background: rgba(246, 248, 247, 0.92);
  color: #07140c;
}

.status-tag--urgent {
  background: rgba(255, 107, 107, 0.95);
  color: #fff5f5;
}

.status-tag--goal {
  background: rgba(61, 181, 110, 0.95);
  color: #0b2316;
}

.status-tag--starting {
  background: rgba(79, 142, 255, 0.95);
  color: #07142f;
}

.cause-chip {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(11, 21, 16, 0.86);
  color: var(--color-primary);
  backdrop-filter: blur(10px);
}

.card-overlay {
  position: absolute;
  inset: auto 0 0;
  height: 70%;
  background: linear-gradient(180deg, rgba(13, 22, 18, 0) 0%, rgba(13, 22, 18, 0.85) 100%);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(1.5rem, 2vw, 1.75rem);
  height: 100%;
}

.card-header h3 {
  margin: 0 0 0.5rem;
  font-family: var(--font-heading);
  font-size: 1.28rem;
  line-height: 1.3;
  color: var(--color-text-primary);
}

.card-header p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-size: 0.98rem;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item .material-symbols-outlined {
  font-size: 1rem;
  color: var(--color-primary);
}

.funding {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.funding-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.funding-meta .label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: 0.2rem;
}

.funding-meta strong {
  font-size: 1.15rem;
  color: var(--color-text-primary);
}

.funding-meta .target {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.progress-track {
  position: relative;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: inherit;
  transition: width 0.4s ease;
}

.funding-insight {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.project-button {
  margin-top: auto;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.6rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 600;
  font-size: 0.95rem;
  background: rgba(61, 181, 110, 0.15);
  color: var(--color-primary);
  transition: background var(--transition-base), transform var(--transition-base), color var(--transition-base);
}

.project-card:hover .project-button {
  background: var(--color-primary);
  color: #0b1510;
  transform: translateY(-2px);
}

.project-button .material-symbols-outlined {
  font-size: 1.1rem;
}

.project-card.skeleton {
  overflow: hidden;
}

.card-skeleton {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.02);
  position: relative;
}

.card-skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.08) 40%,
    rgba(255, 255, 255, 0) 80%
  );
  animation: shimmer 1.4s infinite;
}

.card-skeleton > * {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

.skeleton-banner {
  height: 160px;
  border-radius: 16px;
}

.skeleton-line {
  height: 14px;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-pill {
  width: 40%;
  height: 32px;
  border-radius: 999px;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 640px) {
  .card-body {
    gap: 1.25rem;
  }

  .card-header h3 {
    font-size: 1.15rem;
  }

  .project-button {
    width: 100%;
    justify-content: center;
  }
}
</style>