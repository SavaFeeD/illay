<script setup lang="ts">
  import { VueCanvasEditorEngine } from 'canvas-editor-engine';

  const VueCanvasEditorEngineInstance = new VueCanvasEditorEngine();
  const initial = VueCanvasEditorEngineInstance.getInitial();
  customElements.define('canvas-editor-engine', initial.component);
</script>

<template>
  <div class="app">
    <UApp>
      <NuxtLayout class="app__layout">
        <NuxtPage/>
      </NuxtLayout>
    </UApp>
  </div>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');

  * {
    font-family: "Nunito Sans", sans-serif;
  }

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    background: linear-gradient(90deg, #090a10 0%, #10121d 25%, #10121d 75%, #090a10 100%);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  body::-webkit-scrollbar {
    width: 7px;
    background-color: #1e0e33;
  }
          
  body::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: #090a10;
  }
          
  body::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #1e0e33;
  }

  .hide {
    display: none;
  }
</style>