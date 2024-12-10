<script setup lang="ts">

</script>

<template>
  <div>
    <div class="colored-bg"></div>
    <div class="navbar-wrapper">
      <illay-logo></illay-logo>
      <nav>
        <NuxtLink to="/dashboard">Dashboard</NuxtLink>
      </nav>
    </div>
    <div class="page-wrapper">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .colored-bg {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 15vh;
    background: linear-gradient(180deg, #1e0e33 0%, #1e0e3300 100%);
  }
  .navbar-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    color: #ffffff;
    max-width: 920px;
    margin: 0 auto;
  }
  nav {
    display: flex;
    gap: 1rem;
    color: #77788C;
  }

  .page-wrapper {
    max-width: 920px;
    width: 100%;
    padding: 20px;
    margin: 0 auto;
  }
</style>