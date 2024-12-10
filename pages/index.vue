<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="container">
    <h1><span class="product-name">ILLAY.</span> EDITOR ENGINE SOLUTION</h1>
    <p class="product-description">Uses the canvas-editor-engine 2 library</p>
    <img src="/images/home-preview-editor.png" alt="home-preview-editor" class="preview-editor" />
  </div>
</template>

<style class="scss" scoped>
  h1 {
    color: #ffffff;
    text-align: center;
    font-size: 5.8rem;
    margin: 80px 0 0 0;
  }

  .product-name {
    color: #535460;
    background: -webkit-linear-gradient(215deg, rgba(0,0,255,1) 0%, rgba(255,0,194,1) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: invert(1);
  }
  .product-description {
    font-weight: 500;
    font-size: 1.8rem;
    max-width: 70%;
    margin: auto 0;
    color: #77788C;
  }

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    gap: 1rem;
  }
</style>