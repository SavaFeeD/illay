<script setup lang="ts">
definePageMeta({
  layout: 'editor'
})

const toolStore = useToolStore();
const workplaceStore = useWorkplaceStore();

const selectedWorkplace = computed(() => workplaceStore.getSelectedWorkplace);
const activeBehaviorBar = computed(() => toolStore.getActiveBar);
</script>

<template>
  <div class="ui ui__left-top-bar">
    <iy-logo />
    <tools-bar />
    <workplace-tools-bar v-if="!!selectedWorkplace" />
  </div>
  <div class="ui ui__bottom-center-bar">
    <creation-bar />
  </div>
  <div
    v-if="!!selectedWorkplace"
    class="ui ui__right-top-bar"
  >
    <div class="wrapper">
      <div class="subbars">
        <behavior-bar />
      </div>
    </div>
    <div class="subbars" v-if="activeBehaviorBar">
      <settings-bar v-show="activeBehaviorBar === 'settings'" />
      <filter-bar v-show="activeBehaviorBar === 'filter'" />
      <image-bar v-show="activeBehaviorBar === 'image'" />
      <history-bar v-show="activeBehaviorBar === 'history'" />
      <layers-bar v-show="activeBehaviorBar === 'layers'" />
      <export-bar v-show="activeBehaviorBar === 'export'" />
    </div>
  </div>

  <ce-editor class="editor"></ce-editor>
</template>

<style lang="scss" scoped>
  .ui {
    position: fixed;
    z-index: 1000000;

    &__left-top-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      top: 20px;
      left: 25px;
      padding: 15px;
      background: #181818;
      border-radius: 10px;
    }

    &__bottom-center-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      bottom: 20px;
      left: calc(50% - 160px);
      width: 320px;
      padding: 15px;
      background: #181818;
      border-radius: 10px;
    }

    &__right-top-bar {
      display: flex;
      flex-direction: column;
      gap: 10px;
      top: 20px;
      right: 25px;

      .wrapper {
        display: flex;
        flex-direction: row-reverse;
      }

      .subbars {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        background: #181818;
        border-radius: 10px;
      }
    }
  }

  .editor {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>