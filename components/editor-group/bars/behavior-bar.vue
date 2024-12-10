<script setup lang="ts">
import type { IDrawImageArgs } from 'canvas-editor-engine/dist/types/image';
import type { TToolName } from '~/types/tool.types';

const toolStore = useToolStore();
const workplaceStore = useWorkplaceStore();

const activeTool: ComputedRef<TToolName | null> = computed(() => toolStore.getActiveTool);
const selectedWorkplace = computed(() => workplaceStore.getSelectedWorkplace);

function setActiveTool(tool: TToolName) {
  if (activeTool.value === tool) {
    toolStore.unset();
    return;
  }
  toolStore.setActiveTool(tool);
}


function setImage(event: Event) {
  let file: File | null = null;
  const target = event.target as HTMLInputElement;

  if (target && target.files) {
    file = target.files[0];
  }

  if (!!file) {
    const src = window.URL.createObjectURL(file);
    console.log('src', src);
    
    // if (selectedWorkplace.value?.id) {
    //   workplaceStore.setLoadedImage(selectedWorkplace.value.id, src)
    // }

    if (!!selectedWorkplace.value?.ctx && !!selectedWorkplace.value?.editor) {
      const options: IDrawImageArgs = {
        position: {
          x: 0,
          y: 0,
        }
      };
      // @ts-ignore
      selectedWorkplace.value?.editor.drawService.drawImage(selectedWorkplace.value?.ctx, src, options);
    }
  }
}
</script>

<template>
  <div class="behavior-bar">
    <div class="behavior-buttons">
      <label for="load-image" class="behavior-button">
        load image
      </label>
      <input
        class="hide"
        type="file"
        name="load-image"
        id="load-image"
        @change="setImage"
        accept="image/*"
        capture
      >
    </div>
    <div class="behavior-inputs">
      <div class="behavior-inputs_position">
        <label for="position-x">X:</label>
        <input type="number" name="position-x" id="position-x">
      </div>
      <div class="behavior-inputs_position">
        <label for="position-y">Y:</label>
        <input type="number" name="position-y" id="position-y">
      </div>
    </div>
    <div class="behavior-inputs">
      <div class="behavior-inputs_size">
        <label for="size-w">Width:</label>
        <input type="number" name="size-w" id="size-w">
      </div>
      <div class="behavior-inputs_size">
        <label for="size-h">Height:</label>
        <input type="number" name="size-h" id="size-h">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .behavior-bar {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    gap: 10px;
  }

  label {
    color: #ffffff;
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

    &__active {
      border: none;
      background: -webkit-linear-gradient(215deg, rgba(0,0,255,1) 0%, rgba(255,0,194,1) 100%);
    }
  }
</style>