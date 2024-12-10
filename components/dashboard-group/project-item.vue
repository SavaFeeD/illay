<script setup lang="ts">
interface IProps {
  projectId: number;
}
const props = defineProps<IProps>();

const computedLink = computed(combineLink)

function combineLink() {
  return '/editor' + '?projectId=' + props.projectId;
}

function toEditor() {
  const link = computedLink.value;
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