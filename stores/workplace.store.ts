import type { IPosition, ISize } from 'canvas-editor-engine/dist/types/general';
import { defineStore } from 'pinia'
import type { IWorkplace, ICreateWorkplace, IToolRegistryItem, ISelectedWorkplace, IPutWorkplaceSettings } from '~/types/workplace.types';

export const useWorkplaceStore = defineStore('workplace', {
  state: () => ({
    workplaceList: [] as IWorkplace[],
    toolRegistry: [] as IToolRegistryItem[],
    selectedWorkplace: null as ISelectedWorkplace | null,
  }),

  getters: {
    getWorkplaceList: state => state.workplaceList,
    getSelectedWorkplace: state => state.selectedWorkplace,
    getToolRegistry: state => state.toolRegistry,
  },

  actions: {
    createWorkplace(workplace: ICreateWorkplace) {
      const id = Date.now();
      const newWorkplace: IWorkplace = {
        id,
        title: `Workspace #${id}`,
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
      } else {
        this.selectedWorkplace = null;
      }
    },

    unset() {
      this.selectedWorkplace = null;
    },

    putWorkplaceSettings(workplaceId: IWorkplace['id'], settings: IPutWorkplaceSettings) {
      const listing = this.workplaceList.map((workplace) => {
        if (workplace.id === workplaceId) {
          if (settings.position) {
            workplace.position = settings.position;
          }
          if (settings.size) {
            workplace.size = settings.size;
          }
        }
        return workplace;
      });
      if (listing) {
        this.workplaceList = listing;
      }
      console.log('2 this.workplaceList', this.workplaceList);
    },
  },
  
});