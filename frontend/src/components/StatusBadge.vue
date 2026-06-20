<script setup lang="ts">
defineProps<{
  label: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
}>()
</script>

<template>
  <span class="status-badge" :data-tone="tone ?? 'neutral'">
    {{ label }}
  </span>
</template>
