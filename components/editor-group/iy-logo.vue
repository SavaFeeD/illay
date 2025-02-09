<script setup lang="ts">
const workplaceStore = useWorkplaceStore();
const modalStore = useModalStore();

const menuIsOpen = ref(false);

function togleMenu() {
  menuIsOpen.value = !menuIsOpen.value;
};

function saveProject() {
  workplaceStore.pullProjects();
  showModal();
  menuIsOpen.value = false;
};

function showModal() {
  modalStore.show('save');
  workplaceStore.resetIsSavedProjectState();
};
</script>

<template>
  <div class="menu-logo">
    <button class="logo" @click="togleMenu">IY.</button>
    <div v-show="menuIsOpen" class="menu-logo__menu">
      <nuxt-link
        class="menu-button"
        to="/dashboard/"
      >
        Go to overview
      </nuxt-link>
      <button
        class="menu-button"
        @click="saveProject"
      >
        Save project
      </button>
      <button class="menu-button">
        Settings
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .menu-logo {
    position: relative;
  
    &__menu {
      display: flex;
      gap: 10px;
      position: absolute;
      top: -15px;
      right: -315px;
      background-color: #181818;
      padding: 13px;
      border-radius: 10px;
    }
  }

  .menu-button {
    background: #2c2c2c;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    padding: 2px 5px;

    &:hover {
      background: -webkit-linear-gradient(215deg, rgb(0, 0, 255) 0%, rgb(255, 0, 194) 100%);
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