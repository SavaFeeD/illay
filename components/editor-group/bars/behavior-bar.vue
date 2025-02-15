<script setup lang="ts">
import type { TBarName } from '~/types/tool.types';

const toolStore = useToolStore();

const activeBar: ComputedRef<TBarName | null> = computed(() => toolStore.getActiveBar);

function setActiveBar(bar: TBarName) {
  if (activeBar.value === bar) {
    toolStore.unsetActiveBar();
    return;
  }
  toolStore.setActiveBar(bar);
}
</script>

<template>
  <div class="behavior-bar">
    <button
      class="tool"
      :class="{
        'tool__active': activeBar === 'settings',
      }"
      @click="setActiveBar('settings')"
    >
      <img src="/tools/settings.svg" alt="settings">
    </button>
    <button
      class="tool"
      :class="{
        'tool__active': activeBar === 'image',
      }"
      @click="setActiveBar('image')"
    >
      <img src="/tools/image.svg" alt="image">
    </button>
    <button
      class="tool"
      :class="{
        'tool__active': activeBar === 'filter',
      }"
      @click="setActiveBar('filter')"
    >
      <img src="/tools/filter.svg" alt="filter">
    </button>
    <button
      class="tool"
      :class="{
        'tool__active': activeBar === 'history',
      }"
      @click="setActiveBar('history')"
    >
      <img src="/tools/history.svg" alt="history">
    </button>
    <button
      class="tool"
      :class="{
        'tool__active': activeBar === 'layers',
      }"
      @click="setActiveBar('layers')"
    >
      <img src="/tools/layers.svg" alt="layers">
    </button>
    <button
      class="tool"
      :class="{
        'tool__active': activeBar === 'export',
      }"
      @click="setActiveBar('export')"
    >
      <img src="/tools/download.svg" alt="export">
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .behavior-bar {
    display: flex;
    gap: 10px;
  }

  label {
    color: #ffffff;
  }

  .tool {
    max-width: 35px;
    max-height: 35px;
    padding: 5px;
    background-color: inherit;
    border: 1px solid #535460;
    border-radius: 5px;

    img {
      width: 100%;
      height: 100%;
    }

    &__active {
      border: none;
      background: -webkit-linear-gradient(215deg, rgba(0,0,255,1) 0%, rgba(255,0,194,1) 100%);
    }
  }

  .group-title {
    width: 100%;
    color: #6d6e79;
    margin: 10px 0 0 0;
    font-weight: 400;
    text-transform: uppercase;
  }

  .behavior-buttons {
    cursor: pointer;
    > * {
      cursor: pointer;
    }
  }

  .behavior-button {
    border: #535460 1px solid;
    border-radius: 7px;
    padding: 10px;
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    font-size: 13px;
  }

  .behavior-inputs-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;

    &__title {
      width: 100%;
      color: #535460;
      margin: 0;
      font-weight: 400;
    }

    &__inputs {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
  }

  .behavior-inputs {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      position: absolute;
      left: 6px;
      font-size: 12px;
    }
    input {
      color: #ffffff;
      padding: 4px 8px 4px 25px;
      max-width: 30px;
      background-color: #242424;
      border: none;
      border-radius: 5px;
      min-width: 60px;
    }
  }
</style>