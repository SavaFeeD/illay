import type { IPainter } from "canvas-editor-engine/dist/types/draw-service";


export const PAINTER_CONFIG = (painterId: IPainter['id']) => [
  [
    {
      label: 'Rename',
      onSelect () {
        const workplaceStore = useWorkplaceStore();
        const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
        
        if (!selectedWorkplace.value?.editor) return console.warn('no selected workplace');
        if (!painterId) return console.warn('no painterId');
        
        selectedWorkplace.value.editor.drawAccumulatorService.renamePainter(painterId, 'RENAMED!');
      }
    },
    {
      label: 'Delete',
      onSelect () {
        const workplaceStore = useWorkplaceStore();
        const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
        
        if (!selectedWorkplace.value?.editor) return console.warn('no selected workplace');
        if (!painterId) return console.warn('no painterId');
      
        selectedWorkplace.value.editor.drawAccumulatorService.removePainter(painterId);
      }
    },
  ],
];