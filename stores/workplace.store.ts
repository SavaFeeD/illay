import { defineStore } from 'pinia'
import type { IWorkplace, ICreateWorkplace, IToolRegistryItem, ISelectedWorkplace } from '~/types/workplace.types';

export const useWorkplaceStore = defineStore('workplace', {
  state: () => ({
    workplaceList: [] as IWorkplace[],
    toolRegistry: [] as IToolRegistryItem[],
    selectedWorkplace: null as ISelectedWorkplace | null,
    // loadedImage: null as ILoadedImage | null,
  }),

  getters: {
    getWorkplaceList: state => state.workplaceList,
    getSelectedWorkplace: state => state.selectedWorkplace,
    getToolRegistry: state => state.toolRegistry,
  },

  actions: {
    createWorkplace(workplace: ICreateWorkplace) {
      const newWorkplace: IWorkplace = {
        id: Date.now(),
        ...workplace,
      };
      this.workplaceList.push(newWorkplace);
    },

    addToolRegistryItem(workplaceId: IWorkplace['id'], registry: IToolRegistryItem['registry']) {
      const item: IToolRegistryItem = {
        workplaceId: workplaceId,
        registry,
      };
      this.toolRegistry.push(item);
    },

    selectWorkplace(workplaceId: IWorkplace['id'] | null, ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement | null, editor: HTMLDivElement | null) {
      const workplace = this.workplaceList.find((workplace) => workplace.id === workplaceId);
      if (!!workplace && !!ctx && !!canvas && !!editor) {
        (workplace as ISelectedWorkplace).ctx = ctx;
        (workplace as ISelectedWorkplace).canvas = canvas;
        (workplace as ISelectedWorkplace).editor = editor;
        this.selectedWorkplace = workplace as ISelectedWorkplace;
      }
    },

    // setLoadedImage(workplaceId: IWorkplace['id'], src: string) {
    //   this.loadedImage = {
    //     workplaceId,
    //     src,
    //   };
    // },

    unset() {
      this.selectedWorkplace = null;
    }
  },
  
})