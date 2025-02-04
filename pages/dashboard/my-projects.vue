<script setup lang="ts">
import type { IDocumentInfo } from '~/types/document.types';
import { E_STORAGE_KEYS, type TSaveMethod } from '~/types/project-illay.types';

definePageMeta({
  layout: 'dashboard'
});

const workplaceStore = useWorkplaceStore();

const projects: ComputedRef<IDocumentInfo[]> = computed(() => workplaceStore.getProjectsInfo);

const storeMethods: TSaveMethod[] = [
  'LocalStorage',
  'Server',
];
const selectedStoreMethod = ref<TSaveMethod>('LocalStorage');

function changeStoreMethod(method: TSaveMethod) {
  selectedStoreMethod.value = method;
}

function getProjectsFromLocalStorage() {
  const localProjects = localStorage.getItem(E_STORAGE_KEYS['projects']);
  if (localProjects) {
    JSON.parse(localProjects) as IDocumentInfo[];
  }
}

async function getProjectsFromServer() {
  const fsids = await workplaceStore.getProjectInfoIds();
  if (fsids.length > 0) {
    fsids.forEach(async (fsid) => {
      workplaceStore.getProjectInfo(fsid);
    });
  }
}

function uploadData() {
  switch(selectedStoreMethod.value) {
    case 'LocalStorage':
      getProjectsFromLocalStorage();
      break;
    case 'Server':
      getProjectsFromServer();
      break;
    default:
      console.warn('Unknown store method');
      break;
  }
}

watch(selectedStoreMethod, () => {
  workplaceStore.clearProjectsInfo();
  uploadData();
});

onMounted(() => {
  uploadData();
});
</script>

<template>
  <div>
    <dashboard-header>
      <template v-slot:title>
        My projects
      </template>
    </dashboard-header>

    <div class="dashboard-content">

      <div class="store-method-wrapper">
        <radio-button
          :options="storeMethods"
          name="store-method"
          initial-first
          @change="changeStoreMethod"
        ></radio-button>
      </div>

      <div class="project-list">
        <template v-if="!!projects">
          <project-item
            v-for="project in projects"
            :key="project.documentFsId"
            :documentFsId="project.documentFsId"
            :store-method="selectedStoreMethod"
          >
            {{ project.projectName }}
          </project-item>
        </template>
        <new-project :store-method="selectedStoreMethod" />
      </div>

    </div>

  </div>
</template>

<style lang="scss" scoped>
  .dashboard-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .store-method-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 280px;
  }
  
  .project-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: 125px;
    gap: 1rem;
  }
</style>