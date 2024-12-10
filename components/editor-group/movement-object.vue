<script setup lang="ts">
interface IProps {
  movementData: {
    left: number;
    top: number;
  };
  movementActions: {
    start: boolean;
    end: boolean;
    move: boolean;
  };
  isReload: boolean;
  zoom: number;
}
const props = defineProps<IProps>();
const emit = defineEmits(["reloaded"]);

const zeroCoord = ref({
  x: 0,
  y: 0,
});

const leftMove = ref(0);
const topMove = ref(0);

const savedCoord = ref({
  x: 0,
  y: 0,
});
const newCoord = ref({
  x: 0,
  y: 0,
});

const scale = ref(1);

const styles = computed(() => ({
  left: newCoord.value.x + leftMove.value + "px",
  top:  newCoord.value.y + topMove.value + "px",
  transform: `scale(${scale.value})`,
}));
const styleObject = reactive(styles);

function toZeroCoord() {
  setTimeout(() => {
    leftMove.value = zeroCoord.value.x;
    topMove.value = zeroCoord.value.y;
  }, 0);
  setTimeout(() => {
    savedCoord.value.x = zeroCoord.value.x;
    savedCoord.value.y = zeroCoord.value.y;
  }, 5);
  setTimeout(() => {
    newCoord.value.x = zeroCoord.value.x;
    newCoord.value.y = zeroCoord.value.y;
  }, 10);
}

onMounted(() => {
  toZeroCoord();
})

watch(() => props.isReload, (newVal) => {
  if (newVal) {
    toZeroCoord();
    emit("reloaded");
  }
}, { deep: true, immediate: true });

watch(() => props.movementData, (newVal) => {
  leftMove.value = newVal.left;
  topMove.value = newVal.top;
}, { deep: true, immediate: true });

watch(() => props.movementActions, (newVal) => {
  if (newVal.start) {
    newCoord.value.x = savedCoord.value.x;
    newCoord.value.y = savedCoord.value.y;
  }
  if (newVal.end) {
    savedCoord.value.x = newCoord.value.x + leftMove.value;
    savedCoord.value.y = newCoord.value.y + topMove.value;
  }
}, { deep: true, immediate: true });

watch(() => props.zoom, (newVal) => {
  scale.value = newVal;
});
</script>

<template>
  <div class="movement" :style="styleObject">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  .movement {
    position: absolute;
  }
</style>