<template>
  <header class="app-header">
    <div class="header-inner">
      <a class="logo" href="#">
        <span class="logo__mark">CI</span>
        <span class="logo__text">
          <span>Civic impact</span>
          <strong>Community Impact</strong>
        </span>
      </a>

      <nav aria-label="Primary navigation">
        <a v-for="link in navLinks" :key="link.label" :href="link.href">{{ link.label }}</a>
      </nav>

      <div class="header-actions">
        <button
          class="toggle-theme"
          type="button"
          :aria-pressed="darkMode"
          aria-label="Toggle dark mode"
          @click="emit('toggle-theme')"
        >
          <span v-if="darkMode" aria-hidden="true">🌙</span>
          <span v-else aria-hidden="true">☀️</span>
        </button>
        <button class="cta" type="button" @click="openGetInvolvedModal">Get Involved</button>
      </div>
    </div>

    <!-- Get Involved Modal -->
    <GetInvolvedModal v-model:isOpen="showGetInvolvedModal" />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GetInvolvedModal from './GetInvolvedModal.vue'

const props = defineProps<{ darkMode: boolean }>()
const emit = defineEmits<{ (e: 'toggle-theme'): void }>()

const showGetInvolvedModal = ref(false)

const navLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'Open Data', href: '#open-data' },
  { label: 'About Us', href: '#about' },
]

const openGetInvolvedModal = () => {
  showGetInvolvedModal.value = true
}
</script>
