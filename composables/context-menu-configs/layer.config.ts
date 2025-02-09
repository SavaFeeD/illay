import type { ILayer } from "canvas-editor-engine/dist/types/draw-layers";


export const LAYER_CONFIG = (layerId: ILayer['id']) => [
  [
    {
      label: 'Rename',
      onSelect () {
        const workplaceStore = useWorkplaceStore();
        const modalStore = useModalStore();

        const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
        
        if (!selectedWorkplace.value?.editor) return console.warn('no selected workplace');
        if (!layerId) return console.warn('no layerId');
        
        const layer = selectedWorkplace.value.editor.drawLayersService.getLayerById(layerId);

        modalStore.show('rename', {
          data: {
            who: 'layer',
            before: layer?.name,
            id: layerId,
          },
          position: 'top',
        });
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
    {
      label: 'Change order up',
      onSelect () {
        const workplaceStore = useWorkplaceStore();
        const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
        
        if (!selectedWorkplace.value?.editor) return console.warn('no selected workplace');
        if (!layerId) return console.warn('no layerId');
      
        selectedWorkplace.value.editor.drawAccumulatorService.changeLayerOrder(
          layerId,
          {
            direction: 'up',
          }
        );
      }
    },
    {
      label: 'Change order down',
      onSelect () {
        const workplaceStore = useWorkplaceStore();
        const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
        
        if (!selectedWorkplace.value?.editor) return console.warn('no selected workplace');
        if (!layerId) return console.warn('no layerId');
      
        selectedWorkplace.value.editor.drawAccumulatorService.changeLayerOrder(
          layerId,
          {
            direction: 'down',
          }
        );
      }
    },
    {
      label: 'Change order front',
      onSelect () {
        const workplaceStore = useWorkplaceStore();
        const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
        
        if (!selectedWorkplace.value?.editor) return console.warn('no selected workplace');
        if (!layerId) return console.warn('no layerId');
      
        selectedWorkplace.value.editor.drawAccumulatorService.changeLayerOrder(
          layerId,
          {
            direction: 'front',
          }
        );
      }
    },
    {
      label: 'Change order back',
      onSelect () {
        const workplaceStore = useWorkplaceStore();
        const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
        
        if (!selectedWorkplace.value?.editor) return console.warn('no selected workplace');
        if (!layerId) return console.warn('no layerId');
      
        selectedWorkplace.value.editor.drawAccumulatorService.changeLayerOrder(
          layerId,
          {
            direction: 'back',
          }
        );
      }
    },
  ],
];