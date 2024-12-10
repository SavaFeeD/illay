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
  <div class="creation-bar">
    <button
      class="tool"
      :class="{
        'tool__active': activeTool === 'create-workplace',
      }"
      @click="setActiveTool('create-workplace')"
      title="create workplace"
    >
      <img src="/tools/workplace.svg" alt="create-workplace">
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .creation-bar {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
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