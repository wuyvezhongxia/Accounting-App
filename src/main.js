import { createApp } from 'vue'
import { createPinia } from 'pinia'
// amfe-flexible 会根据设备的屏幕宽度动态地设置根元素（<html>）的字体大小。它默认将设计稿宽度分成 10 等份，每一份的宽度对应 1rem 的大小。
import 'amfe-flexible'
import { showToast, Dialog } from 'vant'
import App from './App.vue'
import router from './router/index'
import persist from 'pinia-plugin-persistedstate'
import dayjs from 'dayjs'
const app = createApp(App)
app.use(createPinia().use(persist))
app.use(router)
// 注册组件
app.use(showToast)
app.use(Dialog)
app.mount('#app')
// 将自定义的方法挂载到全局属性$filters中
app.config.globalProperties.$filters = {
  transTime(date) {
    return dayjs(Number(date)).format('HH:mm')
  },
  transDay(value) {
    return dayjs(value).format('MM-DD')
  },
  transYDM(value) {
    return dayjs(value).format('YYYY-MM-DD HH:mm')
  },
  transYMD(value) {
    return dayjs(value).format('YYYY-MM-DD')
  },
}
