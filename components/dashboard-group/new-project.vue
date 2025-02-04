<script setup lang="ts">
import type { TSaveMethod } from '~/types/project-illay.types';

interface IProps {
  storeMethod: TSaveMethod;
}
const props = defineProps<IProps>();

function toEditor() {
  navigateTo(`/editor?storeMethod=${props.storeMethod}`);
}
</script>

<template>
  <div class="new-project" @click="toEditor">
    + New Project
  </div>
</template>

<style lang="scss" scoped>
  .new-project {
    display: flex;
    align-items: center;
    justify-content: center;
    border: dotted 2px #232323;
    border-radius: 10px;
    color: #ffffff;
    padding: 10px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      background: #333333;
    }
    &-title {
      font-size: 18px;
      color: #ffffff;
    }
  }
</style>