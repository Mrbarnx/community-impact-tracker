<template>
  <div class="empty-state" role="status" aria-live="polite">
    <div class="empty-icon" aria-hidden="true">
      <svg fill="none" height="48" viewBox="0 0 48 48" width="48">
        <path
          d="M24 4a20 20 0 1 0 0 40 20 20 0 0 0 0-40Zm0 6a2 2 0 0 1 2 2v14a2 2 0 0 1-4 0V12a2 2 0 0 1 2-2Zm0 26a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
          fill="currentColor"
        />
      </svg>
    </div>
    <h3>No projects found</h3>
    <p>Try adjusting your filters or check back soon! We update our database daily.</p>
    <button type="button" @click="emit('clear')">Clear all filters</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'clear'): void }>()
</script>
