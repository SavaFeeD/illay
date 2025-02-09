<script setup lang="ts">
import type { ISelectedWorkplace, IWorkplace } from '~/types/workplace.types';
import { AppConfig, VueCanvasEditorEngine } from 'canvas-editor-engine';
import type { IChangeQuality, TToolName } from '~/types/tool.types';
import type { ISize } from 'canvas-editor-engine/dist/types/general';
import ExecutionDelay from 'execution-delay';
import type { IDrawImageArgs } from 'canvas-editor-engine/dist/types/image';
import type WebComponent from 'canvas-editor-engine/dist/web-component';
import type { IWorkplaceProject } from '~/types/project-illay.types';
import type { ILayer } from 'canvas-editor-engine/dist/types/draw-layers';
import type { ISmoothFilterOptions } from 'canvas-editor-engine/dist/types/draw-service';
import type Painter from 'canvas-editor-engine/dist/utils/painter';

interface IProps {
  workplace: IWorkplace;
  zIndex?: number;
  backgroundColor?: string;
};
const props = defineProps<IProps>();

const emits = defineEmits(['select', 'right-click']);

const workplaceStore = useWorkplaceStore();
const toolStore = useToolStore();
const movementObjectStore = useMovementObjectStore();

const editor: Ref<WebComponent | null> = ref(null);
const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);
const useEditorStoreForRender = ref(true);
const currentQuality = ref(0);

const activeTool: ComputedRef<TToolName | null> = computed(() => toolStore.getActiveTool);
const selectedWorkplace: ComputedRef<ISelectedWorkplace | null> = computed(() => workplaceStore.getSelectedWorkplace);
const zoom: ComputedRef<number> = computed(() => movementObjectStore.getZoom);
const qualityList = computed(() => toolStore.getBehaviorChangeQuality);
const isStartEditorsRestore = computed(() => workplaceStore.restoreProgressBar.workplacesRestore);
const restoreIllayProject = computed(() => workplaceStore.getProjectIllayForRestore);
const currentWorkplaceRecovery: ComputedRef<IWorkplaceProject | undefined> = computed(() => {
  if (restoreIllayProject.value) {
    const workplaceProjects = restoreIllayProject.value.workplaceProjects;
    return workplaceProjects.find(workplaceProject => workplaceProject.id === props.workplace.id);
  }
});
const selectedPainter = computed(() => workplaceStore.getSelectedPainter);

const appConfig = new AppConfig();
appConfig.CANVAS_SIZE.width = props.workplace.size.width;
appConfig.CANVAS_SIZE.height = props.workplace.size.height;
appConfig.ZOOM = zoom.value;

const workplaceStyle = computed(() => ({
  'z-index': props?.zIndex || 1,
  'background-color': props?.backgroundColor || '#ffffff',
  'translate': `calc(${props.workplace.size.width}px / 2 * -1) calc(${props.workplace.size.height}px / 2 * -1)`,
}));

function openEditorContext(event: MouseEvent) {
  emits('right-click', event, props.workplace.id);
}

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
  editor.value.appConfig.CANVAS_SIZE.width = size.width;
  editor.value.appConfig.CANVAS_SIZE.height = size.height;
}

function vagueFilterPixelStart(qualityListValue: IChangeQuality[]) {
  const quality = qualityListValue.find(quality => quality.workplaceId === props.workplace.id);
  if (!quality?.value) return;
  if (currentQuality.value === quality.value) return;
  currentQuality.value = quality.value;
  if (!editor.value) return;
  const painter = selectedPainter.value?.painter;
  if (!painter) return console.warn('Painter is not selected');
  editor.value.eventService.dispatch('loading-start');
  ExecutionDelay.add('draw', () => {
    vagueFilterPixel(quality.value, painter.id);
  }, 500);
}

function vagueFilterPixel(quality: number, painterId: Painter['id']) {
  const options: IDrawImageArgs = {
    position: {
      x: 0,
      y: 0,
    }
  };
  const smoothFilterOptions: ISmoothFilterOptions = {
    useStore: useEditorStoreForRender.value,
    options: options,
    filterOptions: { quality: quality },
  }
  selectedWorkplace.value?.editor.drawAccumulatorService.smoothFilter(painterId, smoothFilterOptions);
}

function getPainters(): Painter[] {
  if (!selectedWorkplace.value) return [];
  const layerId = selectedWorkplace.value.activeLayerId;
  if (!layerId) {
    console.warn(`layerId is ${layerId}`);
    return [];
  }
  const layer = selectedWorkplace.value.editor.drawLayersService.getLayerById(layerId);
  if (!layer) {
    console.warn(`layer is ${layer}`);
    return [];
  }
  return layer.painters;
}

function recoveryWorkplace(editor: WebComponent, ctx: CanvasRenderingContext2D) {
  if (isStartEditorsRestore.value && currentWorkplaceRecovery.value) {
    const currentProject = currentWorkplaceRecovery.value.project;
    if (currentProject) {
      const jsonProjects = JSON.stringify([currentProject]);
      const baseLayer = editor.drawLayersService.getLayerByOrder(1);
      editor.restoreJSONProjects(baseLayer.id, jsonProjects);
      // const projectProcessor = editor.projectsService.on('File');
      // const serializer = projectProcessor.getSerializerInstance(jsonProjects);
      // const projects = serializer.getProjects();
      // editor.drawService.drawProject(ctx, projects[0]);
      // editor.throughHistoryService.recovery(projects[0]);
      workplaceStore.editorsRestored();
    }
  }
}

// watch(() => props.workplace, () => {
//   ExecutionDelay.add(`resizeInputImage-${props.workplace.id}`, () => {
//     if (selectedWorkplace.value) resizeInputImage(selectedWorkplace.value.size);
//   }, 400);
// }, { deep: true });

watch(zoom, (zoomValue) => {
  appConfig.ZOOM = zoomValue;
  if (editor.value?.appConfig?.ZOOM != undefined) {
    editor.value.appConfig.ZOOM = zoomValue;
  }
});

watch(qualityList, vagueFilterPixelStart, { deep: true });

onMounted(() => {
  try {
    if (!editor.value) throw new Error('Editor is null');
    workplaceStore.setEditorForWorkplace(props.workplace.id, editor.value);

    const { editorElement, canvasSelector } = editor.value.init(appConfig);

    canvas.value = editorElement.querySelector(canvasSelector);
    if (canvas.value) {
      ctx.value = canvas.value.getContext('2d') as CanvasRenderingContext2D;
      recoveryWorkplace(editor.value, ctx.value);
    }

    const registry = editor.value.toolService.registry;
    workplaceStore.addToolRegistryItem(props.workplace.id, registry);

    const layer = editor.value.drawLayersService.getLayerByOrder(1);

    console.log('layer', layer);

    workplaceStore.setActiveLayerForWorkplace(props.workplace.id, layer.id);

  } catch (e) {
    console.error(e);
  }
});
</script>

<template>
  <movement-object
    :order="workplace.id"
    class="workplace-position"
    :recovery="currentWorkplaceRecovery"
  >
    <div
      class="workplace"
      :style="workplaceStyle"
      :class="{
        'workplace_selected': selectedWorkplace?.id === workplace.id,
      }"
      @click="selectWorkplace"
      @contextmenu="openEditorContext($event)"
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
      border-width: 2px;
      border-style: solid;
      border-image: -webkit-linear-gradient(215deg, rgb(0, 0, 255) 0%, rgb(255, 0, 194) 100%) 1;
      transform: translate(-2px, -2px);
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