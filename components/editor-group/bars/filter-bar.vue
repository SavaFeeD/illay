<script setup lang="ts">
import ExecutionDelay from 'execution-delay';
import type { IChangeQuality } from '~/types/tool.types';

const toolStore = useToolStore();
const workplaceStore = useWorkplaceStore();

const selectedWorkplace = computed(() => workplaceStore.getSelectedWorkplace);

const behavior = ref({
  quality: 0,
});

const changeQualityData = computed(() => ({
  quality: behavior.value.quality,
}));

watch(changeQualityData, () => {
  ExecutionDelay.add('setBehaviorChangeQuality', () => {
    const changeQualityDataValue: IChangeQuality = {
      value: changeQualityData.value.quality,
      workplaceId: (selectedWorkplace.value?.id) ? selectedWorkplace.value.id : null,
    }
    toolStore.setBehaviorChangeQuality(changeQualityDataValue);
  }, 400);
}, { deep: true });
</script>

<template>
  <div class="behavior-bar">
    <h4 class="group-title">Filters</h4>
    <div class="behavior-inputs-wrapper">
      <h5 class="behavior-inputs-wrapper__title">quality</h5>
      <div class="behavior-inputs-wrapper__inputs">
        <div class="behavior-inputs behavior-inputs_size" title="quality">
          <label for="quality">Q:</label>
          <input v-model="behavior.quality" type="number" name="quality" id="quality">
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