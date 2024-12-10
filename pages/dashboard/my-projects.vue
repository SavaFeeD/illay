<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <div>
    <dashboard-header>
      <template v-slot:title>
        My projects
      </template>
    </dashboard-header>
    <div class="project-list">
      <project-item
        v-for="project in 10"
        :key="project"
        :project-id="project"  
      >
        Project {{ project }}
      </project-item>
      <new-project />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .project-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
</style>