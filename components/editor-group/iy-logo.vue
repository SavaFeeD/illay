<script setup lang="ts">
const menuIsOpen = ref(false);

function togleMenu() {
  menuIsOpen.value = !menuIsOpen.value;
};
</script>

<template>
  <div class="menu-logo">
    <button class="logo" @click="togleMenu">IY.</button>
    <div v-show="menuIsOpen" class="menu-logo__menu">
      <button class="menu-button">
        Go to overview
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .menu-logo {
    position: relative;
  
    &__menu {
      position: absolute;
      top: 0;
      right: -130px;
    }
  }

  .logo {
    color: #535460;
    background: -webkit-linear-gradient(215deg, rgba(0,0,255,1) 0%, rgba(255,0,194,1) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    font-size: 1.5rem;
    border: none;
  }
</style>