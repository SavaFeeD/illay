<script setup lang="ts">
  import { VueCanvasEditorEngine } from 'canvas-editor-engine';

  const VueCanvasEditorEngineInstance = new VueCanvasEditorEngine();
  const initial = VueCanvasEditorEngineInstance.getInitial();
  customElements.define('canvas-editor-engine', initial.component);
</script>

<template>
  <div class="screen">
    <ClientOnly fallback-tag="div" fallback="Loading comments...">
      <slot />
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
  .screen {
    position: relative;
    width: 100%;
    max-width: 100vw;
    height: 100%;
    max-height: 100vh;
  }
</style>