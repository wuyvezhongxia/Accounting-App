import { createApp } from 'vue'
import { createPinia } from 'pinia'
// amfe-flexible 会根据设备的屏幕宽度动态地设置根元素（<html>）的字体大小。它默认将设计稿宽度分成 10 等份，每一份的宽度对应 1rem 的大小。
import 'amfe-flexible'
import { Toast, Dialog } from 'vant'
import App from './App.vue'
import router from './router'
import persist from 'pinia-plugin-persistedstate'
const app = createApp(App)

app.use(createPinia().use(persist))
app.use(router)
// 注册组件
app.use(Toast)
app.use(Dialog)
app.mount('#app')
