<script setup lang="ts">
const navigateList = [
  {
    title: 'Dashboard',
    to: '/dashboard/'
  },
  {
    title: 'My projects',
    to: '/dashboard/my-projects'
  },
];
</script>

<template>
  <div class="side-bar">
    <div class="side-bar__logo">
      <illay-logo></illay-logo>
    </div>
    <div class="side-bar__navigate-list">
      <div
        class="side-bar__navigate-item"
        v-for="navigate in navigateList"
      >
        <dashboard-link :to="navigate.to">{{ navigate.title }}</dashboard-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .side-bar {
    background-color: #090a10;
    height: 100%;
    max-height: calc(100vh - 40px);
    padding: 20px;
    color: #ffffff;
    outline: #181b2b solid 2px;

    &__logo {
      padding-bottom: 10px;
    }

    &__navigate-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 30px 0;
    }
  }
</style>