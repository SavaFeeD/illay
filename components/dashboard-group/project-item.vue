<script setup lang="ts">
import type { IDocumentInfo } from '~/types/document.types';
import type { TSaveMethod } from '~/types/project-illay.types';

interface IProps {
  documentFsId: IDocumentInfo['documentFsId'];
  storeMethod: TSaveMethod;
}
const props = defineProps<IProps>();

const combinedLink = computed(combineLink)

function combineLink() {
  return `/editor?documentFsId=${props.documentFsId}&storeMethod=${props.storeMethod}`;
}

function toEditor() {
  const link = combinedLink.value;
  navigateTo(link);
}
</script>

<template>
  <div class="project-item" @click="toEditor">
    <h5 class="project-item-title">
      <slot />
    </h5>
  </div>
</template>

<style lang="scss" scoped>
  .project-item {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #232323;
    border-radius: 10px;
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