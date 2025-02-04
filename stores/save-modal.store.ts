import { defineStore } from 'pinia'


export const useSaveModalStore = defineStore('save-modal', {
  state: () => ({
    open: false as boolean,
  }),

  getters: {
    isOpen: state => !!state.open,
  },

  actions: {
    show() {
      this.open = true;
    },

    hide() {
      this.open = false;
    }
  },
})