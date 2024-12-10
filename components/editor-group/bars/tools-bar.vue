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

function unsetActiveTool() {
  toolStore.unset();
}
</script>

<template>
  <div class="tools-bar">
    <button
      class="tool"
      :class="{
        'tool__active': activeTool === null,
      }"
      @click="unsetActiveTool"
      title="cursor"
    >
      <img src="/tools/cursor.svg" alt="cursor">
    </button>
    <button
      class="tool"
      :class="{
        'tool__active': activeTool === 'grab',
      }"
      @click="setActiveTool('grab')"
    >
      <img src="/tools/grab.svg" alt="grab">
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .tools-bar {
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