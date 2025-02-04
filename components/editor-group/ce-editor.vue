<script setup lang="ts">
import type WebComponent from 'canvas-editor-engine/dist/web-component';
import type { TToolName } from '~/types/tool.types';
import type { ICreateWorkplace, ISelectedWorkplace, IWorkplace } from '~/types/workplace.types';

const workplaceStore = useWorkplaceStore();
const toolStore = useToolStore();
const movementObjectStore = useMovementObjectStore();

const workplaceList: ComputedRef<IWorkplace[]> = computed(() => workplaceStore.workplaceList);
const activeTool: ComputedRef<TToolName | null> = computed(() => toolStore.getActiveTool);
const selectedWorkplace: ComputedRef<ISelectedWorkplace | null> = computed(() => workplaceStore.getSelectedWorkplace);

function createWorkplace() {
  if (activeTool.value !== 'create-workplace') return;
  const initSettings = JSON.parse(JSON.stringify(toolStore.getBehaviorCreateWorkplace));

  const workplaceDefaultSchema: ICreateWorkplace = {
    position: {
      x: 0,
      y: 0,
    },
    size: initSettings.size,
  };

  workplaceStore.createWorkplace(workplaceDefaultSchema);
};

function selectWorkplace(payload: {workplaceId: IWorkplace['id'] | null, ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement | null, editor: WebComponent | null}) {
  workplaceStore.selectWorkplace(payload.workplaceId, payload.ctx, payload.canvas, payload.editor);
  if (payload.workplaceId) {
    movementObjectStore.setOrder(payload.workplaceId);
  }
}

function openEditorContext(event: MouseEvent, targetWorkplaceId: ISelectedWorkplace['id']) {
  event.preventDefault();
  if (!selectedWorkplace.value) return;
  if (selectedWorkplace.value.id != targetWorkplaceId) return;
  console.log('CONTEXT MENU!');
}
</script>

<template>
  <div>
    <space
      @click="createWorkplace"
    >
      <workplace
        v-for="workplace in workplaceList"
        :key="workplace.id"  
        :workplace="workplace"
        @select="selectWorkplace"
        @right-click="openEditorContext"
      ></workplace>
    </space>
  </div>
</template>
