<template>
  <section id="about" class="about-section" aria-labelledby="about-title">
    <div class="about-inner">
      <header class="about-header">
        <span class="eyebrow">About us</span>
        <h2 id="about-title">Building civic trust, one project at a time</h2>
        <p class="mission-copy">{{ content.mission }}</p>
      </header>

      <div class="about-grid">
        <article class="about-story">
          <h3>{{ content.story.title }}</h3>
          <p>{{ content.story.body }}</p>
          <div class="story-highlight">
            <span class="quote-mark" aria-hidden="true">“</span>
            <p>{{ content.story.highlight }}</p>
          </div>
        </article>

        <ul class="about-metrics" aria-label="organization metrics">
          <li v-for="metric in content.metrics" :key="metric.label">
            <span class="metric-value">{{ metric.value }}</span>
            <span class="metric-label">{{ metric.label }}</span>
          </li>
        </ul>
      </div>

      <div class="about-highlights" role="list">
        <article
          v-for="highlight in content.highlights"
          :key="highlight.title"
          class="highlight-card"
          role="listitem"
        >
          <span class="material-symbols-outlined" aria-hidden="true">{{ highlight.icon }}</span>
          <div>
            <h4>{{ highlight.title }}</h4>
            <p>{{ highlight.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AboutContent } from '@/stores/community'

defineProps<{ content: AboutContent }>()
</script>

<style scoped>
.about-section {
  padding: clamp(3rem, 6vw, 5.5rem) clamp(1.5rem, 4vw, 5rem);
  background: radial-gradient(circle at top left, rgba(61, 181, 110, 0.14), transparent 60%),
    radial-gradient(circle at bottom right, rgba(46, 138, 86, 0.12), transparent 55%);
}

.about-inner {
  max-width: 1150px;
  margin: 0 auto;
  display: grid;
  gap: clamp(2rem, 4vw, 3.5rem);
}

.about-header {
  display: grid;
  gap: 0.75rem;
  max-width: 720px;
}

.eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
  font-weight: 600;
}

.about-header h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-family: var(--font-heading);
  color: var(--color-text-primary);
  line-height: 1.2;
}

.mission-copy {
  margin: 0;
  font-size: 1.05rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.about-grid {
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
}

.about-story {
  background: rgba(12, 20, 16, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: clamp(1.75rem, 3vw, 2.35rem);
  display: grid;
  gap: 1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.about-story h3 {
  margin: 0;
  font-size: 1.35rem;
  color: var(--color-text-primary);
  font-family: var(--font-heading);
}

.about-story p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.65;
}

.story-highlight {
  position: relative;
  padding-left: 2.5rem;
  color: var(--color-text-primary);
  font-style: italic;
  line-height: 1.6;
}

.quote-mark {
  position: absolute;
  left: 0;
  top: -0.5rem;
  font-size: 3rem;
  color: rgba(61, 181, 110, 0.35);
}

.about-metrics {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
  background: rgba(11, 21, 16, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.75rem;
}

.about-metrics li {
  display: grid;
  gap: 0.35rem;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
}

.metric-label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.about-highlights {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.highlight-card {
  padding: 1.4rem;
  border-radius: 16px;
  background: rgba(8, 15, 11, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: grid;
  gap: 0.75rem;
  align-content: start;
  transition: transform var(--transition-base), border-color var(--transition-base);
}

.highlight-card:hover,
.highlight-card:focus-within {
  transform: translateY(-3px);
  border-color: rgba(61, 181, 110, 0.45);
}

.highlight-card .material-symbols-outlined {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(61, 181, 110, 0.18);
  color: var(--color-primary);
  font-size: 1.35rem;
}

.highlight-card h4 {
  margin: 0;
  font-size: 1.05rem;
  color: var(--color-text-primary);
  font-family: var(--font-heading);
}

.highlight-card p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    text-align: center;
  }
}

@media (max-width: 640px) {
  .about-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .highlight-card {
    gap: 0.6rem;
  }
}
</style>
