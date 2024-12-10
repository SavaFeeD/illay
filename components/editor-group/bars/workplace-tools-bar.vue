<script setup lang="ts">
import type { TToolName } from '~/types/tool.types';

const toolStore = useToolStore();

const activeTool: ComputedRef<TToolName | null> = computed(() => toolStore.getActiveTool);

function setActiveTool(tool: TToolName) {
  if (activeTool.value === tool) {
    toolStore.unset();
    return;
  }
  toolStore.setActiveTool(tool);
}
</script>

<template>
  <div class="workplace-tools-bar">
    <button
      class="tool"
      :class="{
        'tool__active': activeTool === 'pipette',
      }"
      @click="setActiveTool('pipette')"
      title="pipette"
    >
      <img src="/tools/pipette.svg" alt="pipette">
    </button>
    <button
      class="tool"
      :class="{
        'tool__active': activeTool === 'excretion',
      }"
      @click="setActiveTool('excretion')"
      title="excretion"
    >
      <img src="/tools/excretion.svg" alt="excretion">
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .workplace-tools-bar {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    gap: 10px;
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
</style>