<script setup lang="ts">
import type { IImageState } from 'canvas-editor-engine/dist/store/image.state';
import type { IHistoryLine } from 'canvas-editor-engine/dist/types/history';


const workplaceStore = useWorkplaceStore();
const selectedWorkplace = computed(() => workplaceStore.getSelectedWorkplace);

const history: Ref<{ data: IHistoryLine[]}> = ref({
  data: [],
});

function updateHistory() {
  setTimeout(() => {
    const mock = {
      stateName: '',
      view: '',
      stateValue: undefined as unknown as IImageState
    };
    history.value.data.push(mock);
    history.value.data.pop();
  }, 100);
}

function undo() {
  const ctx = selectedWorkplace.value?.ctx;
  if (!!ctx) {
    selectedWorkplace.value?.editor.throughHistoryService.undo(ctx);
  }
}

function redo() {
  const ctx = selectedWorkplace.value?.ctx;
  if (!!ctx) {
    selectedWorkplace.value?.editor.throughHistoryService.redo(ctx);
  }
}

function onChangeHistory(historyLines: IHistoryLine[]) {
  history.value.data = historyLines;
  updateHistory();
}

watch(selectedWorkplace, () => {
  const historyFromStore = selectedWorkplace.value?.editor.appStore.getHistoryLines();
  history.value.data = (historyFromStore) ? historyFromStore : [];

  selectedWorkplace.value?.editor.appStore.subscribe(
    'history',
    onChangeHistory
  );

  updateHistory();
}, {  deep: true, immediate: true });

</script>

<template>
  <div class="behavior-bar">
    <div class="group-title">
      <span>History</span>
      <div class="behavior-buttons">
        <button class="behavior-button" @click="undo" :disabled="history.data.length <= 1">undo</button>
        <button class="behavior-button" @click="redo">redo</button>
      </div>
    </div>
    <ul class="history-list">
      <li
        v-for="(item, order) in history.data"
        :key="`${item.stateName}-${item.view}-${order}`"
        class="history-list__item"
      >
        <img src="/tools/image.svg" alt="view-icon-image" />
        <span>{{ item.view }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  .behavior-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .history-list {
    margin: 10px 0 0 0;
    padding: 0 0 10px 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__item {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #cfcfcf;

      img {
        max-width: 12px;
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
</style>