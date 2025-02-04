import type { ILayer } from "canvas-editor-engine/dist/types/draw-layers";


export const LAYER_CONFIG = (layerId: ILayer['id']) => [
  [
    {
      label: 'Rename',
      onSelect () {
        const workplaceStore = useWorkplaceStore();
        const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
        
        if (!selectedWorkplace.value?.editor) return console.warn('no selected workplace');
        if (!layerId) return console.warn('no layerId');
        
        selectedWorkplace.value.editor.drawAccumulatorService.renameLayer(layerId, 'RENAMED!');
      }
    },
    {
      label: 'Delete',
      onSelect () {
        const workplaceStore = useWorkplaceStore();
        const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
        
        if (!selectedWorkplace.value?.editor) return console.warn('no selected workplace');
        if (!layerId) return console.warn('no layerId');
      
        selectedWorkplace.value.editor.drawAccumulatorService.removeLayer(layerId);
      }
    },
  ],
];