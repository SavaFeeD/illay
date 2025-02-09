<script setup lang="ts">
import type { IDocumentInfo } from '~/types/document.types';
import type { IProjectIllay, TSaveMethod } from '~/types/project-illay.types';
import type { IWorkplace } from '~/types/workplace.types';

const route = useRoute();
const workplaceStore = useWorkplaceStore();
const modalStore = useModalStore();

const isRestoreProject = ref(false);

const documentFsId = computed(() => route.query?.documentFsId as unknown as IDocumentInfo['documentFsId']);
const storeMethod: ComputedRef<TSaveMethod | undefined> = computed(() => route.query?.storeMethod as TSaveMethod);
const project: ComputedRef<IProjectIllay | null> = computed(() => workplaceStore.getProjectIllayForRestore);
const projectInfo: ComputedRef<IDocumentInfo | null> = computed(() => workplaceStore.getProjectsInfo.find(project => project.documentFsId === documentFsId.value) || null);
const isFinalyRestoreStatus: ComputedRef<boolean> = computed(() => workplaceStore.isFinalyRestoreStatus);

function getProjectFromServerStorage(projectInfo: IDocumentInfo) {
  workplaceStore.getProjectById(projectInfo);
}

function uploadData() {
  if (!!projectInfo.value && !!storeMethod.value) {
    isRestoreProject.value = true;
    modalStore.show('save');

    switch (storeMethod.value) {
      case 'LocalStorage':
        console.log('From local storage');
        break;
      case 'Server':
        getProjectFromServerStorage(projectInfo.value);
        break;
      default:
        console.warn('Unknown store method');
        break;
    }
  }
}

watch(project, () => {
  if (project.value) {
    const workplaceList: IWorkplace[] = [];
    project.value.workplaceProjects.forEach((workplaceProject) => {
      workplaceList.push({
        id: workplaceProject.id,
        title: workplaceProject.title,
        position: workplaceProject.position,
        size: workplaceProject.size,
        editor: null,
        activeLayerId: null,
      });
    });
    workplaceList.forEach((workplace) => {
      workplaceStore.restoreWorkplace(workplace);
    });
    workplaceStore.workplacesRestored();
  }
}, { deep: true });

watch(projectInfo, () => {
  uploadData();
}, { deep: true });

watch(documentFsId, (value) => {
  console.log(value);
  if (value) {
    workplaceStore.getProjectInfo(`info_${value}`);
  }
}, { deep: true, immediate: true });

watch(isFinalyRestoreStatus, (value) => {
  if (value) {
    isRestoreProject.value = false;
    modalStore.putOption('isRestoreProject', isRestoreProject.value);
  }
});

</script>

<template>
  <div class="screen">
    <ClientOnly fallback-tag="div" fallback="Loading comments...">
      <slot />
    </ClientOnly>
    <modal />
  </div>
</template>

<style lang="scss" scoped>
  .screen {
    position: relative;
    width: 100%;
    max-width: 100vw;
    height: 100%;
    max-height: 100vh;
  }
</style>