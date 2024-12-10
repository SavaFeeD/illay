<script setup lang="ts">
import type { TToolName } from '~/types/tool.types';
import type { IWorkplace } from '~/types/workplace.types';

const workplaceStore = useWorkplaceStore();
const toolStore = useToolStore();

const workplaceList: ComputedRef<IWorkplace[]> = computed(() => workplaceStore.workplaceList);
const activeTool: ComputedRef<TToolName | null> = computed(() => toolStore.getActiveTool);

function createWorkplace() {
  if (activeTool.value !== 'create-workplace') return;

  const workplaceDefaultSchema = {
    name: `Workplace ${workplaceStore.workplaceList.length + 1}`,
  };
  workplaceStore.createWorkplace(workplaceDefaultSchema);
};

function selectWorkplace(payload: {workplaceId: IWorkplace['id'] | null, ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement | null, editor: HTMLDivElement | null}) {
  console.log('payload', payload);
  workplaceStore.selectWorkplace(payload.workplaceId, payload.ctx, payload.canvas, payload.editor);
}
</script>

<template>
  <div>
    <space
      @click="createWorkplace"
    >
      <div class="workplaces-wrapper">
        <workplace
          v-for="workplace in workplaceList"
          :key="workplace.id"
          :workplace="workplace"
          @select="selectWorkplace"
        ></workplace>
      </div>
    </space>
  </div>
</template>
