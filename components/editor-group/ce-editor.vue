<script setup lang="ts">
import type { TToolName } from '~/types/tool.types';
import type { IWorkplace } from '~/types/workplace.types';

const workplaceStore = useWorkplaceStore();
const toolStore = useToolStore();
const movementObjectStore = useMovementObjectStore();

const workplaceList: ComputedRef<IWorkplace[]> = computed(() => workplaceStore.workplaceList);
const activeTool: ComputedRef<TToolName | null> = computed(() => toolStore.getActiveTool);
const initSettings = computed(() => toolStore.getBehaviorCreateWorkplace);

function createWorkplace() {
  if (activeTool.value !== 'create-workplace') return;

  const workplaceDefaultSchema = {
    name: `Workplace ${workplaceStore.workplaceList.length + 1}`,
    position: {
      x: 0,
      y: 0,
    },
    size: initSettings.value.size,
  };

  workplaceStore.createWorkplace(workplaceDefaultSchema);
};

function selectWorkplace(payload: {workplaceId: IWorkplace['id'] | null, ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement | null, editor: HTMLDivElement | null}) {
  console.log('payload', payload);
  workplaceStore.selectWorkplace(payload.workplaceId, payload.ctx, payload.canvas, payload.editor);
  if (payload.workplaceId) {
    movementObjectStore.setOrder(payload.workplaceId);
  }
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
      ></workplace>
    </space>
  </div>
</template>
