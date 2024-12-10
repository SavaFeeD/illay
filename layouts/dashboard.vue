<script setup lang="ts">

</script>

<template>
  <div class="page-wrapper">
    <side-bar></side-bar>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .page-wrapper {
    display: grid;
    grid-template-columns: 250px 8fr;
    height: 100vh;
    gap: 50px;
  }
  .content {
    padding: 0 40px 0 0;
  }
</style>