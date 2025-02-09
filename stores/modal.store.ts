import { defineStore } from 'pinia'

export type TModalKey = 'save' | 'rename';

export const useModalStore = defineStore('modal', {
  state: () => ({
    open: false as boolean,
    key: null as TModalKey | null,
    options: {} as {[key: string]: any},
  }),

  getters: {
    isOpen: state => !!state.open,
    getOptions: state => state.options,
    getKey: state => state.key,
  },

  actions: {
    show(key: TModalKey | null, options?: {[key: string]: any}) {
      this.open = true;
      this.key = key;
      if (!!options) {
        this.options = options;
      } else {
        this.options = {};
      }
    },

    putOption(key: string, value: any) {
      this.options[key] = value;
    },

    hide() {
      this.open = false;
    }
  },
})