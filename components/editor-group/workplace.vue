<script setup lang="ts">
import type { IWorkplace } from '~/types/workplace.types';
import { AppConfig, VueCanvasEditorEngine } from 'canvas-editor-engine';
import type { TToolName } from '~/types/tool.types';

interface IProps {
  workplace: IWorkplace;
  zIndex?: number;
  backgroundColor?: string;
};
const props = defineProps<IProps>();

const emits = defineEmits(['select']);

const workplaceStore = useWorkplaceStore();
const toolStore = useToolStore();

const activeTool: ComputedRef<TToolName | null> = computed(() => toolStore.getActiveTool);
const selectedWorkplace: ComputedRef<IWorkplace | null> = computed(() => workplaceStore.getSelectedWorkplace);

const editor = ref(null);
const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);

const appConfig = new AppConfig();
appConfig.CANVAS_SIZE.width = 1000;
appConfig.CANVAS_SIZE.height = 650;

const workplaceStyle = computed(() => ({
  'z-index': props?.zIndex || 1,
  'background-color': props?.backgroundColor || '#ffffff',
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
  <div
    class="workplace"
    :style="workplaceStyle"
    :class="{
      'workplace_selected': selectedWorkplace?.id === workplace.id,
    }"
    @click="selectWorkplace"
  >
    <canvas-editor-engine ref="editor"></canvas-editor-engine>
  </div>
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
</style>