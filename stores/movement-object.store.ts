import { defineStore } from 'pinia'
import { E_GLOBAL_MOVEMENT_OBJECT_INDEX } from "~/types/movement-object.types";


export const useMovementObjectStore = defineStore('movement-object', {
  state: () => ({
    order: 0 as number | E_GLOBAL_MOVEMENT_OBJECT_INDEX,
    zoom: 1 as number,
  }),

  getters: {
    getOrder: state => state.order,
    getZoom: state => state.zoom,
  },

  actions: {
    setOrder(order: number | E_GLOBAL_MOVEMENT_OBJECT_INDEX) {
      this.order = order;
    },

    setZoom(zoom: number) {
      this.zoom = zoom;
    },

    setSpaceContainer() {
      this.order = E_GLOBAL_MOVEMENT_OBJECT_INDEX['SPACE_CONTAINER'];
    },
  },
  
})