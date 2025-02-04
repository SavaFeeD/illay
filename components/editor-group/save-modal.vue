<script setup lang="ts">
import type { TSaveMethod } from '~/types/project-illay.types';

interface IProps {
  isRestoreProject: boolean;
}
const props = defineProps<IProps>();

const saveModalStore = useSaveModalStore();
const workplaceStore = useWorkplaceStore();

const projectTitle = ref('');
const saveMethods: TSaveMethod[] = [
  'LocalStorage',
  'Server',
];
const selectedSaveMethod = ref<TSaveMethod>('LocalStorage');
const isInitSaveProject = ref(false);
const isInvalid = ref(false);

const isOpen = computed(() => saveModalStore.isOpen);
const progressBar = computed(() => workplaceStore.getProgressBarChunksProgress);
const progressBarStyle = computed(() => ({
  width: `${progressBar.value.readyCount * 100 / progressBar.value.countChunks}%`,
}));
const restoreProgressBar = computed(() => workplaceStore.getRestoreProgressBar);
const restoreProgressBarStyle = computed(() => ({
  width: `${restoreProgressBar.value.chunks.readyCount * 100 / restoreProgressBar.value.chunks.countChunks}%`,
}));
const restoreStatus = computed(() => ([
  {
    title: 'Decompressed',
    isReady: restoreProgressBar.value.decompressed,
  },
  {
    title: 'Workplaces restore',
    isReady: restoreProgressBar.value.workplacesRestore,
  },
  {
    title: 'Editors restore',
    isReady: restoreProgressBar.value.editorsRestore,
  }
]));
const isFinishRestore = computed(() => workplaceStore.isFinishRestore);

function closeModal() {
  isInitSaveProject.value = false;
  saveModalStore.hide();
  if (isFinishRestore.value) {
    workplaceStore.setFinalyRestoreStatus(true);
  }
}

function changeSaveMethod(saveMethod: TSaveMethod) {
  selectedSaveMethod.value = saveMethod;
}

function saveProject() {
  if (projectTitle.value === '') {
    isInvalid.value = true;
    return;
  }
  isInitSaveProject.value = true;
  workplaceStore.packageWorkplaceProject(projectTitle.value);
  workplaceStore.saveProjectIllay(selectedSaveMethod.value);
}

watch(projectTitle, (value) => {
  if (isInvalid.value && value != '') {
    isInvalid.value = false;
  }
});
</script>

<template>
  <div class="save-modal" v-if="isOpen">
    <div class="save-modal__backgraund"></div>
    <div class="save-modal__content">
      <div class="save-modal-content">
        <template v-if="isInitSaveProject">
          <h2 class="save-modal-content__title">Please wait...</h2>
          <div class="progress-bar">
            <p class="progress-bar__counter">{{ progressBar.countChunks }} / {{ progressBar.readyCount }}</p>
            <div class="progress-bar__progress-wrapper">
              <div :style="progressBarStyle" class="progress-bar__progress"></div>
            </div>
          </div>
          <div class="save-modal-content__final-button-wrapper">
            <button
              v-if="progressBar.countChunks === progressBar.readyCount"
              class="save-modal-content__finish-button"
              @click="closeModal"
            >
              Finish
            </button>
          </div>
        </template>
        <template v-else-if="isRestoreProject">
          <h2 class="save-modal-content__title">Restore project</h2>
          <div class="progress-bar">
            <p class="progress-bar__counter">{{ restoreProgressBar.chunks.countChunks }} / {{ restoreProgressBar.chunks.readyCount }}</p>
            <div class="progress-bar__progress-wrapper">
              <div :style="restoreProgressBarStyle" class="progress-bar__progress"></div>
            </div>
          </div>
          <div class="reset-info">
            <ul class="reset-info__list">
              <li
                v-for="(item, order) in restoreStatus"
                :key="`${item.title}-${order}`"
                class="reset-info__item"
                :class="[
                  { 'reset-info__item--ready': item.isReady }
                ]"
              >
                <span>{{ item.title }}</span>
              </li>
            </ul>
          </div>
          <div class="save-modal-content__final-button-wrapper">
            <button
              v-if="isFinishRestore"
              class="save-modal-content__finish-button"
              @click="closeModal"
            >
              Finish
            </button>
          </div>
        </template>
        <template v-else>
          <div class="save-modal-content__header">
            <h2 class="save-modal-content__title">Save project</h2>
            <button
              class="save-modal-content__close-button"
              @click="closeModal"
            >X</button>
          </div>
          <div class="save-modal-content__body">
            <div class="save-modal-content__save-method-wrapper">
              <radio-button
                :options="saveMethods"
                initial-first
                name="save-method"
                @change="changeSaveMethod"
              ></radio-button>
            </div>
            <form class="input-wrapper" title="project-title" @submit.prevent="saveProject">
              <input
                v-model="projectTitle"
                type="text"
                name="project-title"
                id="project-title"
                class="input-wrapper__input"
                :class="{ 'input-wrapper__input--invalid': isInvalid }"
                placeholder="Project title"
              />
              <button
                class="save-modal-content__save-button"
                type="submit"
                @submit="saveProject"
              >
                <span>save</span>
              </button>
            </form>
          </div>
        </template>
      </div>      
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .save-modal {
    position: fixed;
    z-index: 1000000000000000000;

    &__backgraund {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(0, 0, 255, 0.164) 0%, rgba(255, 0, 195, 0.048) 100%);
    }

    &__content {
      display: flex;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -60%);
      max-width: 450px;
      width: 100%;
      border-radius: 10px;
      padding: 2px;
      background: -webkit-linear-gradient(215deg, rgb(0, 0, 255) 0%, rgb(255, 0, 194) 100%);
    }
  }

  .save-modal-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    background: #181818;
    padding: 25px 15px;
    border-radius: 10px;
    width: 100%;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__title {
      font-size: 1.1rem;
      font-weight: 400;
      color: #6d6e79;
      margin: 0;
    }

    &__close-button {
      background: none;
      border: none;
      font-size: 20px;
      color: #6d6e79;
      cursor: pointer;
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    &__save-button {
      background: -webkit-linear-gradient(215deg, rgb(0, 0, 255) 0%, rgb(255, 0, 194) 100%);
      border: none;
      border-radius: 5px;
      color: #ffffff;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      position: absolute;
      right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__finish-button {
      background: -webkit-linear-gradient(215deg, rgb(0, 0, 255) 0%, rgb(255, 0, 194) 100%);
      border: none;
      border-radius: 5px;
      color: #ffffff;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__final-button-wrapper {
      display: flex;
      justify-content: flex-end;
      min-height: 25px;
    }

    &__save-method-wrapper {
      display: flex;
      flex-direction: column;
      max-width: 220px;
    }
  }

  .input-wrapper {
    display: flex;
    position: relative;
    align-items: center;
    width: 100%;

    &__label {
      position: absolute;
      left: 6px;
      font-size: 22px;
      font-weight: 200;
      color: #ffffffab;
    }

    &__input {
      color: #ffffff;
      padding: 8px 65px 8px 16px;
      background-color: #242424;
      border: none;
      border-radius: 5px;
      width: 100%;
      font-size: 18px;

      &--invalid {
        outline: 1px solid rgba(122, 0, 37, 0.801);
      }
    }
  }

  .progress-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__progress-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      height: 10px;
      border-radius: 10px;
      background: #242424;
    }
    &__progress {
      height: 4px;
      border-radius: 10px;
      background: -webkit-linear-gradient(215deg, rgb(0, 0, 255) 0%, rgb(255, 0, 194) 100%);
    }
    &__counter {
      margin: 0;
      color: white;
    }
  }

  .reset-info {
    &__list {
      display: flex;
      flex-direction: column;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 10px;
    }
    &__item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #6d6e79;
      font-size: 16px;
      font-weight: 300;
      &--ready {
        color: #ffffff;
      }
    }

  }
</style>