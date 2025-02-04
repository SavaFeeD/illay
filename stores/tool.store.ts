import { defineStore } from 'pinia'
import type { IChangeQuality, TBarName, TToolName } from '~/types/tool.types';
import type { ISize } from 'canvas-editor-engine/dist/types/general';
import type { IPutWorkplaceSettings } from '~/types/workplace.types';

export const useToolStore = defineStore('tool', {
  state: () => ({
    activeTool: null as TToolName | null,
    activeBar: null as TBarName | null,
    belongsToWorkplace: ['create-workplace'],
    activeToolBelongsToWorkplace: false,
    behavior: {
      'create-workplace': {
        size: {
          width: 0,
          height: 0,
        } as ISize,
      },
      'change-quality': [] as IChangeQuality[],
    } as Record<TToolName, any>,
  }),

  getters: {
    getActiveTool: state => state.activeTool,
    getActiveBar: state => state.activeBar,
    isActiveToolBelongsToWorkplace: state => state.activeToolBelongsToWorkplace,
    getBehaviorCreateWorkplace: state => state.behavior['create-workplace'] as { size: ISize },
    getBehaviorChangeQuality: state => state.behavior['change-quality'] as IChangeQuality[],
  },

  actions: {
    setActiveTool(toolName: TToolName | null) {
      this.activeTool = toolName;
      this.activeToolBelongsToWorkplace = (!!toolName) ? this.belongsToWorkplace.includes(toolName) : false;
    },

    setActiveBar(barName: TBarName | null) {
      this.activeBar = barName;
    },

    unsetActiveBar() {
      this.activeBar = null;
    },

    unsetActiveTool() {
      this.activeTool = null;
      this.activeToolBelongsToWorkplace = false;
    },

    setBehaviorCreateWorkplace(payload: IPutWorkplaceSettings) {
      this.behavior['create-workplace'] = payload;
    },

    setBehaviorChangeQuality(payload: IChangeQuality) {
      const qualityIndex = this.behavior['change-quality'].findIndex((q: IChangeQuality) => q.workplaceId === payload.workplaceId);
      if (qualityIndex === -1) {
        this.behavior['change-quality'].push(payload);
      } else {
        this.behavior['change-quality'][qualityIndex] = payload;
      }
    },
  },
  
})