import { defineStore } from 'pinia'
import type { TToolName } from '~/types/tool.types';

export const useToolStore = defineStore('tool', {
  state: () => ({
    activeTool: null as TToolName | null,
    belongsToWorkplace: ['create-workplace'],
    activeToolBelongsToWorkplace: false,
  }),

  getters: {
    getActiveTool: state => state.activeTool,
    isActiveToolBelongsToWorkplace: state => state.activeToolBelongsToWorkplace,
  },

  actions: {
    setActiveTool(toolName: TToolName | null) {
      this.activeTool = toolName;
      this.activeToolBelongsToWorkplace = (!!toolName) ? this.belongsToWorkplace.includes(toolName) : false;
    },

    unset() {
      this.activeTool = null;
      this.activeToolBelongsToWorkplace = false;
    }
  },
  
})