<script setup lang="ts">
import type { TToolName } from '~/types/tool.types';

const toolStore = useToolStore();
const workplaceStore = useWorkplaceStore();

const activeTool = computed(() => toolStore.getActiveTool);
const toolRegistry = computed(() => workplaceStore.getToolRegistry);
const selectedWorkplace = computed(() => workplaceStore.getSelectedWorkplace);

const isActiveCrop = ref(false);

function setActiveTool(tool: TToolName) {
  if (activeTool.value === tool) {
    // @ts-ignore
    selectedWorkplace.value?.editor.toolService.offActive();
    toolStore.unset();
    return;
  }
  toolStore.setActiveTool(tool);
  if (tool === 'pipette') {
    const useLib = toolRegistry.value.find((lib) => lib.workplaceId === selectedWorkplace.value?.id);
    const pipetteToolId = useLib?.registry.find((tool) => tool.name === 'pipette')?.id;
    if (pipetteToolId !== undefined) {
      // @ts-ignore
      selectedWorkplace.value?.editor.toolService.setActive(pipetteToolId);
    }
  }
  if (tool === 'excretion') {
    const useLib = toolRegistry.value.find((lib) => lib.workplaceId === selectedWorkplace.value?.id);
    const excretionToolId = useLib?.registry.find((tool) => tool.name === 'excretion')?.id;
    if (excretionToolId !== undefined) {
      // @ts-ignore
      selectedWorkplace.value?.editor.toolService.setActive(excretionToolId);
    }
  }
  if (tool === 'crop') {
    if (!isActiveCrop.value) {
      // @ts-ignore
      selectedWorkplace.value?.editor.cropService.activate();
      isActiveCrop.value = true;
    }
  }
}


function cropDeativate() {
  // @ts-ignore
  if (!selectedWorkplace.value?.editor?.cropService) return;
  // @ts-ignore
  selectedWorkplace.value?.editor.cropService.deactivate();
  isActiveCrop.value = false;
  toolStore.unset();
}

function cropApply() {
  // @ts-ignore
  if (!selectedWorkplace.value?.editor?.cropService) return;
  const ctx = selectedWorkplace.value?.ctx;
  // @ts-ignore
  selectedWorkplace.value?.editor.cropService.crop(ctx);
  cropDeativate();
}

function excretionToolDeactivate() {
  // @ts-ignore
  selectedWorkplace.value?.editor.toolService.offActive();
  const useLib = toolRegistry.value.find((lib) => lib.workplaceId === selectedWorkplace.value?.id);
  const excretionTool = useLib?.registry.find((tool) => tool.name === 'excretion');
  if (excretionTool?.support) {
    excretionTool?.support();
  }
}

watchEffect(() => {
  if (activeTool.value === null) {
    // Crop tool deativate
    cropDeativate();
    // Excretion tool deativate
    excretionToolDeactivate();
  }
});
</script>

<template>
  <div class="workplace-tools-bar">
    <button
      class="tool"
      :class="{
        'tool__active': activeTool === 'pipette',
      }"
      @click="setActiveTool('pipette')"
      title="pipette"
    >
      <img src="/tools/pipette.svg" alt="pipette">
    </button>

    <button
      class="tool"
      :class="{
        'tool__active': activeTool === 'excretion',
      }"
      @click="setActiveTool('excretion')"
      title="excretion"
    >
      <img src="/tools/excretion.svg" alt="excretion">
    </button>
    <div class="adaptivity">
      <button
        class="tool"
        :class="{
          'tool__active': isActiveCrop,
        }"
        @click="setActiveTool('crop')"
        title="crop"
      >
        <img src="/tools/crop.svg" class="fix-crop-icon-style" alt="crop">
      </button>
      <div
        class="adaptivity_add"
        v-show="isActiveCrop"  
      >
        <button
          class="tool"
          @click="cropDeativate"
          title="deactivate-crop"
        >
          <img src="/tools/declime.svg" alt="deactivate-crop">
        </button>
        <button
          class="tool"
          @click="cropApply"
          title="apply-crop"
        >
          <img src="/tools/accept.svg" alt="apply-crop">
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .workplace-tools-bar {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    gap: 10px;
  }

  .fix-crop-icon-style {
    transform: translate(4px, 0px) scale(1.2);
  }

  .tool {
    max-width: 35px;
    max-height: 35px;
    padding: 5px;
    background-color: inherit;
    border: 1px solid #535460;
    border-radius: 5px;

    img {
      width: 100%;
      height: 100%;
    }

    &:active {
      background: -webkit-linear-gradient(215deg, rgba(0,0,255,1) 0%, rgba(255,0,194,1) 100%);
    }

    &__active {
      border: none;
      background: -webkit-linear-gradient(215deg, rgba(0,0,255,1) 0%, rgba(255,0,194,1) 100%);
    }
  }

  .adaptivity {
    position: relative;
    
    &_add {
      display: flex;
      gap: 10px;
      position: absolute;
      padding: 7px;
      background-color: #181818;
      border-radius: 5px;
      right: -100px;
      top: -7px;
    }
  }
</style>