import type Painter from "canvas-editor-engine/dist/utils/painter";

export const PAINTER_CONFIG = (painterId: Painter['id']) => [
  [
    {
      label: 'Rename',
      onSelect () {
        const workplaceStore = useWorkplaceStore();
        const modalStore = useModalStore();

        const selectedWorkplace = computed(() => workplaceStore.selectedWorkplace);
        
        if (!selectedWorkplace.value?.editor) return console.warn('no selected workplace');
        if (!painterId) return console.warn('no painterId');

        const painter = selectedWorkplace.value.editor.drawAccumulatorService.getPainterById(painterId);

        modalStore.show('rename', {
          data: {
            who: 'painter',
            before: painter?.name,
            id: painterId,
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
        if (!painterId) return console.warn('no painterId');
      
        selectedWorkplace.value.editor.drawAccumulatorService.removePainter(painterId);
      }
    },
  ],
];