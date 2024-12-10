// https://nuxt.com/docs/api/configuration/nuxt-config
import yaml from '@rollup/plugin-yaml'
import vue from '@vitejs/plugin-vue';

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  modules: ['@pinia/nuxt'],
  
  pinia: {
    storesDirs: ['./stores/**'],
  },

  webpack: {
    loaders: {
      vue: {
        hotReload: true,
      }
    }
  },

  build: {
    transpile: ['canvas-editor-engine'],
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.includes('canvas-editor-engine')
    }
  },

  // vite: {
  //   plugins: [
  //     yaml(),
  //     vue({
  //       template: {
  //         compilerOptions: {
  //           isCustomElement: (tag) => tag.includes('canvas-editor-engine')
  //         }
  //       }
  //     }),
  //   ]
  // }
})