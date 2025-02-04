<script setup lang="ts">
import type { IDrawImageArgs } from 'canvas-editor-engine/dist/types/image';

const workplaceStore = useWorkplaceStore();

const selectedWorkplace = computed(() => workplaceStore.getSelectedWorkplace);

const behavior = ref({
  position: {
    x: 0,
    y: 0,
  },
  size: {
    width: 0,
    height: 0,
  },
});

function setImage(event: Event) {
  let file: File | null = null;
  let src: string | null = null;
  const target = event.target as HTMLInputElement;
  const editor = selectedWorkplace.value?.editor;
  const layerId = selectedWorkplace.value?.activeLayerId;

  if (target && target.files) {
    file = target.files[0];
  }

  if (!file || !editor || !layerId) return;

  src = window.URL.createObjectURL(file);
  const options: IDrawImageArgs = {
    position: behavior.value.position,
  };
  if (behavior.value.size.width != 0 && behavior.value.size.height != 0) {
    options.size = behavior.value.size;
  }
  const opt = {
    drawImageArgs: options,
    src,
  };
  const initialSize = {
    width: 250,
    height: 220,
  };
  editor.drawAccumulatorService.add(layerId, 'image', opt, initialSize);
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
    <div class="behavior-inputs-wrapper">
      <h5 class="behavior-inputs-wrapper__title">position</h5>
      <div class="behavior-inputs-wrapper__inputs">
        <div class="behavior-inputs behavior-inputs_position" title="axis x">
          <label for="position-x">X:</label>
          <input v-model="behavior.position.x" type="number" name="position-x" id="position-x">
        </div>
        <div class="behavior-inputs behavior-inputs_position" title="axis y">
          <label for="position-y">Y:</label>
          <input v-model="behavior.position.y" type="number" name="position-y" id="position-y">
        </div>
      </div>
    </div>
    <div class="behavior-inputs-wrapper">
      <h5 class="behavior-inputs-wrapper__title">size</h5>
      <div class="behavior-inputs-wrapper__inputs">
        <div class="behavior-inputs behavior-inputs_size" title="width">
          <label for="size-w">W:</label>
          <input v-model="behavior.size.width" type="number" name="size-w" id="size-w">
        </div>
        <div class="behavior-inputs behavior-inputs_size" title="height">
          <label for="size-h">H:</label>
          <input v-model="behavior.size.height" type="number" name="size-h" id="size-h">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .behavior-bar {
    display: flex;
    flex-direction: column;
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

  .group-title {
    width: 100%;
    color: #6d6e79;
    margin: 10px 0 0 0;
    font-weight: 400;
    text-transform: uppercase;
  }

  .behavior-buttons {
    cursor: pointer;
    > * {
      cursor: pointer;
    }
  }

  .behavior-button {
    border: #535460 1px solid;
    border-radius: 7px;
    padding: 10px;
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    font-size: 13px;
  }

  .behavior-inputs-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;

    &__title {
      width: 100%;
      color: #535460;
      margin: 0;
      font-weight: 400;
    }

    &__inputs {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
  }

  .behavior-inputs {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      position: absolute;
      left: 6px;
      font-size: 12px;
    }
    input {
      color: #ffffff;
      padding: 4px 8px 4px 25px;
      max-width: 30px;
      background-color: #242424;
      border: none;
      border-radius: 5px;
      min-width: 60px;
    }
  }
</style>