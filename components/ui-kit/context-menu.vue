<script setup lang="ts">
import type { ContextMenuItem } from '@nuxt/ui';
import { LAYER_CONFIG } from '~/composables/context-menu-configs/layer.config';
import { PAINTER_CONFIG } from '~/composables/context-menu-configs/painter.config';

export type TContextMenuConfigName = 'custom' | 'default' | 'painter' | 'layer';

interface IProps {
  options: {
    painterId?: string;
    layerId?: string;
  },
  configName: TContextMenuConfigName;
  config?: any[];
};
const props = defineProps<IProps>();

const isDisabled = computed(() => props.configName === 'default')

const items = computed(() => {
  let config = [] as ContextMenuItem[] | ContextMenuItem[][];
  switch (props.configName) {
    case 'custom':
      if (props?.config) {
        config = props.config as ContextMenuItem[] | ContextMenuItem[][];
      } else {
        console.warn('[Context Menu] Config is not defined');
      }
      break;
    case 'painter':
      if (props?.options?.painterId) {
        config = PAINTER_CONFIG(props.options.painterId) as ContextMenuItem[] | ContextMenuItem[][];
      } else {
        console.warn('[Context Menu] Painter ID is not defined');
      }
      break;
    case 'layer':
      if (props?.options?.layerId) {
        config = LAYER_CONFIG(props.options.layerId) as ContextMenuItem[] | ContextMenuItem[][];
      } else {
        console.warn('[Context Menu] Layer ID is not defined');
      }
      break;
    default:
      config = [] as ContextMenuItem[] | ContextMenuItem[][];
      break;
  }
  return config;
});

// Sample config
// const items = ref([
  // [
  //   {
  //     label: 'Appearance',
  //     children: [
  //       {
  //         label: 'System',
  //         icon: 'i-lucide-monitor'
  //       },
  //       {
  //         label: 'Light',
  //         icon: 'i-lucide-sun'
  //       },
  //       {
  //         label: 'Dark',
  //         icon: 'i-lucide-moon'
  //       }
  //     ]
  //   }
  // ],
//   [
//     {
//       label: 'Show Sidebar',
//       kbds: ['meta', 's']
//     },
//     {
//       label: 'Show Toolbar',
//       kbds: ['shift', 'meta', 'd']
//     },
//     {
//       label: 'Collapse Pinned Tabs',
//       disabled: true
//     }
//   ],
//   [
//     {
//       label: 'Refresh the Page'
//     },
//     {
//       label: 'Clear Cookies and Refresh'
//     },
//     {
//       label: 'Clear Cache and Refresh'
//     },
//     {
//       type: 'separator'
//     },
//     {
//       label: 'Developer',
//       children: [
//         [
//           {
//             label: 'View Source',
//             kbds: ['meta', 'shift', 'u']
//           },
//           {
//             label: 'Developer Tools',
//             kbds: ['option', 'meta', 'i']
//           },
//           {
//             label: 'Inspect Elements',
//             kbds: ['option', 'meta', 'c']
//           }
//         ],
//         [
//           {
//             label: 'JavaScript Console',
//             kbds: ['option', 'meta', 'j']
//           }
//         ]
//       ]
//     }
//   ]
// ] as ContextMenuItem[] | ContextMenuItem[][]);

</script>

<template>
  <UContextMenu
    :disabled="isDisabled"
    :items="items"
    :ui="{
      content: 'w-48'
    }"
  >
    <slot />
  </UContextMenu>
</template>

<style lang="scss" scoped></style>