<script setup lang="ts">
import type { IWorkplace } from '~/types/workplace.types';
import { AppConfig, VueCanvasEditorEngine } from 'canvas-editor-engine';
import type { TToolName } from '~/types/tool.types';
import type { ISize } from 'canvas-editor-engine/dist/types/general';
import ExecutionDelay from 'execution-delay';
import type { IDrawImageArgs } from 'canvas-editor-engine/dist/types/image';

interface IProps {
  workplace: IWorkplace;
  zIndex?: number;
  backgroundColor?: string;
};
const props = defineProps<IProps>();

const emits = defineEmits(['select']);

const workplaceStore = useWorkplaceStore();
const toolStore = useToolStore();
const movementObjectStore = useMovementObjectStore();

const editor = ref(null);
const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);
const useEditorStoreForRender = ref(true);

const activeTool: ComputedRef<TToolName | null> = computed(() => toolStore.getActiveTool);
const selectedWorkplace: ComputedRef<IWorkplace | null> = computed(() => workplaceStore.getSelectedWorkplace);
const zoom: ComputedRef<number> = computed(() => movementObjectStore.getZoom);
const qualityList = computed(() => toolStore.getBehaviorChangeQuality);

const appConfig = new AppConfig();
appConfig.CANVAS_SIZE.width = props.workplace.size.width;
appConfig.CANVAS_SIZE.height = props.workplace.size.height;
appConfig.ZOOM = zoom.value;

const workplaceStyle = computed(() => ({
  'z-index': props?.zIndex || 1,
  'background-color': props?.backgroundColor || '#ffffff',
  'translate': `calc(${props.workplace.size.width}px / 2 * -1) calc(${props.workplace.size.height}px / 2 * -1)`,
}));

function selectWorkplace() {
  if (!activeTool.value) {
    if (selectedWorkplace.value?.id === props.workplace.id) {
      workplaceStore.selectWorkplace(null, null, null, null);
    } else {
      emits('select', {
        workplaceId: props.workplace.id,
        ctx: ctx.value,
        canvas: canvas.value,
        editor: editor.value,
      });
    }
  }
}

function resizeInputImage(size: ISize) {
  if (editor.value === null) {
    console.warn('editor is null');
    return;
  };
  // @ts-ignore
  editor.value.appConfig.CANVAS_SIZE.width = size.width;
  // @ts-ignore
  editor.value.appConfig.CANVAS_SIZE.height = size.height;
}

function vagueFilterPixel(quality: number) {
  const options: IDrawImageArgs = {
    position: {
      x: 0,
      y: 0,
    }
  };
  // @ts-ignore
  selectedWorkplace.value?.editor.drawService.drawSmoothImage(useEditorStoreForRender.value, options, { quality: quality });
}

watch(() => props.workplace, (newValue) => {
  console.log(newValue)
  ExecutionDelay.add(`resizeInputImage-${props.workplace.id}`, () => {
    if (selectedWorkplace.value) resizeInputImage(selectedWorkplace.value.size);
  }, 400);
}, { deep: true });

watch(zoom, (zoomValue) => {
  appConfig.ZOOM = zoomValue;
  // @ts-ignore
  if (editor.value?.appConfig?.ZOOM != undefined) {
    // @ts-ignore
    editor.value.appConfig.ZOOM = zoomValue;
  }
});

watch(qualityList, (qualityListValue) => {
  const quality = qualityListValue.find(quality => quality.workplaceId === props.workplace.id);
  if (!quality?.value) return;
  // @ts-ignore
  editor.value.eventService.dispatch('loading-start');
  ExecutionDelay.add('draw', () => {
    vagueFilterPixel(quality.value);
  }, 500);
}, { deep: true });

onMounted(() => {
  try {
    // @ts-ignore
    const { editorElement, canvasSelector } = editor.value.init(appConfig);
    
    canvas.value = editorElement.querySelector(canvasSelector);
    if (canvas.value) {
      ctx.value = canvas.value.getContext('2d') as CanvasRenderingContext2D;
    }

    // @ts-ignore
    const registry = editor.value.toolService.registry;

    console.log(registry);

    workplaceStore.addToolRegistryItem(props.workplace.id, registry);

  } catch (e) {
    console.log(e);
  }
});
</script>

<template>
  <movement-object
    :order="workplace.id"
    class="workplace-position"
  >
    <div
      class="workplace"
      :style="workplaceStyle"
      :class="{
        'workplace_selected': selectedWorkplace?.id === workplace.id,
      }"
      @click="selectWorkplace"
    >
      <label
        class="title"
      >
        {{ workplace.title }}
      </label>
      <canvas-editor-engine ref="editor"></canvas-editor-engine>
    </div>
  </movement-object>
</template>

<style lang="scss" scoped>
  .workplace {
    position: absolute;
    border-radius: 5px;

    &_selected {
      border-width: 4px;
      border-style: solid;
      border-image: -webkit-linear-gradient(215deg, rgb(0, 0, 255) 0%, rgb(255, 0, 194) 100%) 1;
      transform: translate(-4px, -4px);
    }
  }
  .title {
    position: absolute;
    top: -25px;
    max-width: 300px;
    width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>