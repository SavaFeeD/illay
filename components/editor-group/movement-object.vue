<script setup lang="ts">
import { E_GLOBAL_MOVEMENT_OBJECT_INDEX, type IMovementActions, type IMovementData, type TZoomValue } from '~/types/movement-object.types';
import type { IWorkplaceProject } from '~/types/project-illay.types';

interface IProps {
  order: number | E_GLOBAL_MOVEMENT_OBJECT_INDEX;
  isReload?: boolean;
  recovery?: IWorkplaceProject;
}

const props = defineProps<IProps>();
const emit = defineEmits(["reloaded"]);

const movementObjectStore = useMovementObjectStore();
const workplaceStore = useWorkplaceStore();

const activeOrder = computed(() => movementObjectStore.getOrder);

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

const movementData = inject<ComputedRef<IMovementData>>('movementData');
const movementActions = inject<Ref<IMovementActions>>('movementActions');
const zoom = inject<Ref<TZoomValue>>('zoom');

const scale = ref(1);

const styles = computed(() => {
  const styleData: any = {
    left: newCoord.value.x + leftMove.value + "px",
    top:  newCoord.value.y + topMove.value + "px",
    transform: `scale(${scale.value})`,
  }
  if (props.order === E_GLOBAL_MOVEMENT_OBJECT_INDEX['SPACE_CONTAINER']) {
    styleData.translate = `calc(100vw / 2) calc(100vh / 2)`;
  }
  return styleData; 
});
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

watchEffect(() => {
  if (!movementData?.value) return;
  if (props.order !== activeOrder.value) return;
  
  leftMove.value = movementData.value.left;
  topMove.value = movementData.value.top;
});

watchEffect(() => {
  if (!movementActions?.value) return;
  if (props.order !== activeOrder.value) return;

  if (movementActions.value.start) {
    newCoord.value.x = savedCoord.value.x;
    newCoord.value.y = savedCoord.value.y;
  }
  if (movementActions.value.end) {
    savedCoord.value.x = newCoord.value.x + leftMove.value;
    savedCoord.value.y = newCoord.value.y + topMove.value;
  }
});

watchEffect(() => {
  if (!zoom?.value) return;
  if (props.order !== E_GLOBAL_MOVEMENT_OBJECT_INDEX['SPACE_CONTAINER']) return;

  scale.value = zoom.value;
});

watch(styleObject, (value) => {
  if (props.order != E_GLOBAL_MOVEMENT_OBJECT_INDEX['SPACE_CONTAINER']) {
    workplaceStore.setPositionForWorkplace(props.order, {
      x: value.left.replace("px", ""),
      y: value.top.replace("px", ""),
    });
  }
})

onMounted(() => {
  if (props.recovery) {
    setTimeout(() => {
      console.log("props.recovery", props.recovery);
      const { x, y } = (props.recovery) ? props.recovery.position : {x: 0, y: 0};
      newCoord.value.x = +x;
      newCoord.value.y = +y;
      console.log('styleObject', styleObject.value);
    }, 10);
  }
})
</script>

<template>
  <div class="movement" :style="styleObject">
    <div class="nesting">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .movement {
    position: absolute;
  }
  .nesting {
    position: relative;
  }
</style>