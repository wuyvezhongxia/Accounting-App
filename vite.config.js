import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import postCssPxToRem from 'postcss-pxtorem'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  css:{
    postcss:{
      plugins:[
        postCssPxToRem({
          rootValue: 37.5,
          propList: ['*'] // 需要转换的属性
        })
      ]
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/css/variables.scss";`
      }
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  lintOnSave:false
})
