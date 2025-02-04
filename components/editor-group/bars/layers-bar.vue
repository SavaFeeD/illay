<script setup lang="ts">
import type { IDrawLayersState } from 'canvas-editor-engine/dist/store/draw-layers.state';
import type { ILayer } from 'canvas-editor-engine/dist/types/draw-layers';
import type { IPainter } from 'canvas-editor-engine/dist/types/draw-service';
import ExecutionDelay from 'execution-delay';

const workplaceStore = useWorkplaceStore();
const selectedWorkplace = computed(() => workplaceStore.getSelectedWorkplace);
const selectedPainter = computed(() => workplaceStore.getSelectedPainter);

const layers: Ref<{ data: ILayer[]}> = ref({
  data: [],
});

function updateLayers() {
  setTimeout(() => {
    const mock = {
      id: '',
      painters: [],
      order: -1,
      name: '',
    };
    layers.value.data = layers.value.data.sort((a, b) => b.order - a.order);
    layers.value.data.push(mock);
    layers.value.data.pop();
  }, 100);
}

function onChangeLayers(layersLines: ILayer[]) {
  layers.value.data = layersLines;
  updateLayers();
}

function selectLayer(layerId: ILayer['id']) {
  const workplace = selectedWorkplace.value;
  if (!workplace) {
    console.warn('Selected workplace is not defined');
    return;
  };
  if (workplace.activeLayerId === layerId) {
    console.warn('Layer is already active');
    return;
  }
  if (workplace.activeLayerId !== layerId) {
    workplaceStore.selectPainter(null);
  } 
  workplaceStore.setActiveLayerForWorkplace(workplace.id, layerId);
}

function addLayer() {
  const workplace = selectedWorkplace.value;
  if (!workplace) {
    console.warn('Selected workplace is not defined');
    return;
  }
  workplace.editor.drawLayersService.addLayer();
}

function selectPainter(painter: IPainter) {
  if (selectedPainter.value?.painter?.id === painter.id) return console.warn('Painter is already selected');
  ExecutionDelay.add('select-painter', () => {
    workplaceStore.selectPainter(painter);
  }, 50);
}

watch(selectedWorkplace, () => {
  const layersFromStore = selectedWorkplace.value?.editor.appStore.getLayers();
  layers.value.data = (layersFromStore) ? layersFromStore : [];

  selectedWorkplace.value?.editor.appStore.subscribe(
    'layers',
    onChangeLayers
  );

  updateLayers();
}, {  deep: true, immediate: true });
</script>

<template>
  <div class="behavior-bar">
    <div class="head-group">
      <div class="behavior-buttons">
        <button class="behavior-button" @click="addLayer">
          <img src="/tools/layers.svg" alt="view-icon-layers" />
        </button>
      </div>
    </div>
    <ul class="layers-list">
      <li
        v-for="(item, order) in layers.data"
        :key="`${item.id}-${item.name}-${order}`"
        class="layers-list__item"
        :class="[
          { 'layers-list__item_active': item.id === selectedWorkplace?.activeLayerId },
        ]"
        @click="selectLayer(item.id)"
      >
        <context-menu
          config-name="layer"
          :options="{
            layerId: item.id,
          }"
        >
          <div class="layers-list__item-head">
            <img src="/tools/layers.svg" alt="view-icon-layers" />
            <span class="layers-list__item-head_text">{{ item.name }}</span>
          </div>
        </context-menu>
        <ul class="layers-list__item-content">
          <context-menu
            v-for="(layerPainter, layerPainterOrder) in item.painters"
            :key="`${layerPainter.id}-${layerPainterOrder}`"
            config-name="painter"
            :options="{
              painterId: layerPainter.id,
            }"
          >
            <li
              class="layers-list__item-head"
              :class="[
                {  'layers-list__item-head_active': layerPainter.id === selectedPainter?.painter?.id },
              ]"
              :title="layerPainter.id"
              @click="selectPainter(layerPainter)"
            >
              <img src="/tools/image.svg" alt="view-icon-image" />
              <span class="layers-list__item-head_text">{{ layerPainter.name }}</span>
            </li>
          </context-menu>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  .behavior-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding: 5px;
  }

  .layers-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__item-content {
      padding-left: 17px;
    }

    &__item-head {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #cfcfcf;
      padding: 5px 10px;
      border-radius: 7px;
      cursor: pointer;

      img {
        max-width: 12px;
      }

      &_text {
        max-width: 180px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      } 

      &_active {
        background-color: #282828;
      }
    }
    &__item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      color: #cfcfcf;
      padding: 10px;
      cursor: pointer;

      img {
        max-width: 12px;
      }

      &_active > .layers-list__item-head {
        background-color: #242424;
      }
    }
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 196px;
    color: #6d6e79;
    margin: 10px 0 0 0;
    font-weight: 400;
    text-transform: uppercase;
  }

  .behavior-buttons {
    display: flex;
    gap: 4px;
    cursor: pointer;
    > * {
      cursor: pointer;
      max-width: 27px;
      max-height: 27px;
      width: 100%;
      height: 100%;
    }
  }

  .behavior-button {
    border: #535460 1px solid;
    background: none;
    color: #ffffff;
    padding: 5px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    font-size: 13px;
    align-items: center;
    max-height: 20px;
    min-height: 20px;
    min-width: 20px;

    &:disabled {
      color: #535460;
    }
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

  .head-group {
    border-radius: 4px;
    padding: 8px;
    display: flex;
    gap: 10px;
    background: #24242470;
  }
</style>