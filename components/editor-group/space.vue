<script setup lang="ts">
import type { TToolName } from '~/types/tool.types';
import SpaceEvents from '~/utils/event-handler.space';

const toolStore = useToolStore();

const activeTool: ComputedRef<TToolName | null> = computed(() => toolStore.getActiveTool);

const zoom: Ref<number> = ref(1);

const movementActions = ref({
  start: false,
  end: false,
  move: false,
});

const isReload = ref(false);

const startCoord = ref({
  x: 0,
  y: 0,
});
const endCoord = ref({
  x: 0,
  y: 0,
});
const leftMove = computed(() => {
  return endCoord.value.x - startCoord.value.x;
});
const topMove = computed(() => {
  return endCoord.value.y - startCoord.value.y;
});

function movementStart(e: MouseEvent) {
  movementActions.value.move = true;
  movementActions.value.start = true;
  movementActions.value.end = false;
  startCoord.value.x = e.clientX;
  startCoord.value.y = e.clientY;
  endCoord.value.x = e.clientX;
  endCoord.value.y = e.clientY;
}

function movementEnd(e: MouseEvent) {
  movementActions.value.move = false;
  movementActions.value.end = true;
  movementActions.value.start = false;
}

function movement(e: MouseEvent) {
  if (movementActions.value.move && activeTool.value === 'grab') {
    endCoord.value.x = e.clientX;
    endCoord.value.y = e.clientY;
  }
}

function onWheel(e: WheelEvent) {
  if (activeTool.value === 'grab') {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoom.value += 0.15;
    } else {
      if (zoom.value-0.15 > 0) {
        zoom.value -= 0.15;
      }
    }
  }
}

function reloadPosition() {
  isReload.value = true;
};

onMounted(() => {
  SpaceEvents.on('space:reload', reloadPosition);
})
</script>

<template>
  <div
    class="space"
    :class="{
      'grabbing': activeTool === 'grab',
    }"
    @wheel="onWheel"
    @mousedown="movementStart"
    @mouseup="movementEnd"
    @mousemove="movement"
    @mouseout="movementEnd"
  >
    <movement-object
      :movement-data="{
        left: leftMove,
        top: topMove,
      }"
      :movement-actions="movementActions"
      :is-reload="isReload"
      :zoom="zoom"
      @reloaded="isReload = false"
    >
      <slot />
    </movement-object>
  </div>
</template>

<style lang="scss" scoped>
  .space {
    height: 100vh;
    width: 100%;
    background: #474747;
    overflow: hidden;
    position: absolute;
  }

  .grabbing {
    cursor: grab;
  }
</style>