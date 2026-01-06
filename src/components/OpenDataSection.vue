<template>
  <section id="open-data" class="open-data" aria-labelledby="open-data-title">
    <div class="open-data__inner">
      <header class="open-data__header">
        <span class="eyebrow">Open data</span>
        <h2 id="open-data-title">Download live civic transparency datasets</h2>
        <p>
          Every dataset is refreshed routinely and mapped to the projects featured on this page. Analysts,
          journalists, and community groups use these exports to run the numbers alongside us.
        </p>
      </header>

      <div class="dataset-grid" role="list">
        <article
          v-for="dataset in datasets"
          :key="dataset.id"
          class="dataset-card"
          role="listitem"
        >
          <header>
            <h3>{{ dataset.title }}</h3>
            <p>{{ dataset.description }}</p>
          </header>

          <dl class="dataset-meta">
            <div>
              <dt>Last updated</dt>
              <dd>{{ dataset.updatedAt }}</dd>
            </div>
            <div>
              <dt>Records</dt>
              <dd>{{ formatRecords(dataset.records) }}</dd>
            </div>
          </dl>

          <ul class="tag-list" aria-label="Dataset tags">
            <li v-for="tag in dataset.tags" :key="tag">{{ tag }}</li>
          </ul>

          <div class="dataset-actions">
            <button type="button" class="ghost-button" @click="openDetails(dataset)">
              Preview fields
              <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>
            </button>
            <a class="primary-link" :href="dataset.downloadUrl">
              Download CSV
              <span class="material-symbols-outlined" aria-hidden="true">file_download</span>
            </a>
          </div>
        </article>
      </div>
    </div>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="activeDataset" class="dataset-modal" role="dialog" aria-modal="true" aria-live="polite">
          <div class="dataset-modal__panel">
            <button type="button" class="close" @click="closeDetails" aria-label="Close dataset preview">
              <span class="material-symbols-outlined" aria-hidden="true">close</span>
            </button>

            <header>
              <span class="eyebrow">Dataset preview</span>
              <h3>{{ activeDataset.title }}</h3>
              <p>{{ activeDataset.description }}</p>
            </header>

            <dl class="detail-grid">
              <div>
                <dt>Records</dt>
                <dd>{{ formatRecords(activeDataset.records) }}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{{ activeDataset.updatedAt }}</dd>
              </div>
            </dl>

            <footer>
              <a class="primary-link" :href="activeDataset.downloadUrl">
                Download full dataset
                <span class="material-symbols-outlined" aria-hidden="true">file_download</span>
              </a>
              <button type="button" class="ghost-button" @click="closeDetails">
                Close
                <span class="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </footer>
          </div>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import type { OpenDataDataset } from '@/stores/community'

const props = defineProps<{ datasets: OpenDataDataset[] }>()

const activeDataset = ref<OpenDataDataset | null>(null)
const numberFormatter = computed(() => new Intl.NumberFormat('en-US'))

const formatRecords = (value: number) => numberFormatter.value.format(value)

const openDetails = (dataset: OpenDataDataset) => {
  activeDataset.value = dataset
}

const closeDetails = () => {
  activeDataset.value = null
}
</script>

<style scoped>
.open-data {
  padding: clamp(3rem, 6vw, 5.5rem) clamp(1.5rem, 4vw, 5rem);
  background: linear-gradient(180deg, rgba(9, 16, 12, 0.92) 0%, rgba(9, 16, 12, 0.98) 100%);
}

.open-data__inner {
  max-width: 1150px;
  margin: 0 auto;
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
}

.open-data__header {
  display: grid;
  gap: 0.75rem;
  max-width: 720px;
  color: var(--color-text-secondary);
}

.open-data__header h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-family: var(--font-heading);
  color: var(--color-text-primary);
}

.open-data__header p {
  margin: 0;
  line-height: 1.7;
}

.eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
  font-weight: 600;
}

.dataset-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.dataset-card {
  padding: 1.75rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(8, 15, 11, 0.8);
  display: grid;
  gap: 1.1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: transform var(--transition-base), border-color var(--transition-base);
}

.dataset-card:hover,
.dataset-card:focus-within {
  transform: translateY(-3px);
  border-color: rgba(61, 181, 110, 0.5);
}

.dataset-card h3 {
  margin: 0;
  color: var(--color-text-primary);
  font-family: var(--font-heading);
  font-size: 1.2rem;
}

.dataset-card p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.dataset-meta {
  display: flex;
  gap: 1.5rem;
}

.dataset-meta div {
  display: grid;
  gap: 0.2rem;
}

.dataset-meta dt {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.dataset-meta dd {
  margin: 0;
  font-weight: 600;
  color: var(--color-text-primary);
}

.tag-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-list li {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(61, 181, 110, 0.16);
  color: var(--color-primary);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.dataset-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ghost-button,
.primary-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 999px;
  padding: 0.65rem 1.3rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: transform var(--transition-base), box-shadow var(--transition-base), color var(--transition-base);
}

.ghost-button {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: var(--color-text-secondary);
}

.ghost-button:hover,
.ghost-button:focus-visible {
  color: var(--color-primary);
  border-color: rgba(61, 181, 110, 0.5);
  transform: translateY(-1px);
}

.primary-link {
  border: none;
  background: rgba(61, 181, 110, 0.18);
  color: var(--color-primary);
  text-decoration: none;
}

.primary-link:hover,
.primary-link:focus-visible {
  background: var(--color-primary);
  color: #0b1510;
  box-shadow: 0 12px 24px rgba(61, 181, 110, 0.25);
}

.dataset-modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(5, 10, 7, 0.78);
  backdrop-filter: blur(12px);
  padding: 1.5rem;
  z-index: 1500;
}

.dataset-modal__panel {
  position: relative;
  width: min(520px, 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(12, 20, 16, 0.96);
  padding: clamp(2rem, 4vw, 2.5rem);
  display: grid;
  gap: 1.5rem;
}

.dataset-modal__panel h3 {
  margin: 0;
  font-family: var(--font-heading);
  color: var(--color-text-primary);
}

.dataset-modal__panel p {
  margin: 0;
  color: var(--color-text-secondary);
}

.dataset-modal__panel footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  display: grid;
  place-items: center;
  color: var(--color-text-secondary);
}

.close:hover,
.close:focus-visible {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-primary);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.detail-grid dt {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.detail-grid dd {
  margin: 0;
  font-weight: 600;
  color: var(--color-text-primary);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 620px) {
  .dataset-meta {
    flex-direction: column;
    gap: 0.75rem;
  }

  .dataset-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .ghost-button,
  .primary-link {
    justify-content: center;
    width: 100%;
  }
}
</style>
