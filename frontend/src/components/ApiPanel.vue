<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <section class="panel">
    <header class="panel__header">
      <div>
        <h2>{{ title }}</h2>
        <p>{{ subtitle }}</p>
      </div>
      <slot name="aside" />
    </header>
    <div class="panel__body">
      <slot />
    </div>
  </section>
</template>
