<script setup lang="ts">
import type { TToolName } from '~/types/tool.types';

const toolStore = useToolStore();

const activeTool: ComputedRef<TToolName | null> = computed(() => toolStore.getActiveTool);

const behavior = ref({
  size: {
    width: 350,
    height: 200,
  },
});

watch(behavior.value, () => {
  if (behavior.value.size.width === 0 || behavior.value.size.height === 0) return;
  toolStore.setBehaviorCreateWorkplace(behavior.value);
}, {  deep: true, immediate: true });

function setActiveTool(tool: TToolName) {
  if (activeTool.value === tool) {
    toolStore.unsetActiveTool();
    return;
  }
  toolStore.setActiveTool(tool);
}
</script>

<template>
  <div class="creation-bar">
    <div class="tool-wrap">
      <button
        class="tool"
        :class="{
          'tool__active': activeTool === 'create-workplace',
        }"
        @click="setActiveTool('create-workplace')"
        title="create workplace"
      >
        <img src="/tools/workplace.svg" alt="create-workplace">
      </button>
      <div
        class="tool-wrap__modal"
        :class="{
          'tool-wrap__modal_active': activeTool === 'create-workplace',
        }"  
      >

        <div class="behavior-inputs-wrapper">
          <h5 class="behavior-inputs-wrapper__title">size</h5>
          <div class="behavior-inputs-wrapper__inputs">
            <div class="behavior-inputs behavior-inputs_size">
              <label for="size-w">W:</label>
              <input v-model="behavior.size.width" type="number" name="size-w" id="size-w">
            </div>
            <div class="behavior-inputs behavior-inputs_size">
              <label for="size-h">H:</label>
              <input v-model="behavior.size.height" type="number" name="size-h" id="size-h">
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .creation-bar {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    gap: 10px;
  }

  .tool-wrap {
    position: relative;
    display: flex;
    justify-content: center;
  }

  .tool-wrap__modal {
    display: none;
    position: absolute;
    top: -90px;
    background: #181818;
    padding: 10px;
    border-radius: 7px;

    label {
      color: #ffffff;
    }

    &_active {
      display: block;
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
      max-width: 60px;
    }
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