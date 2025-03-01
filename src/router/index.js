import { createRouter, createWebHistory } from 'vue-router'
import User from '@/views/user/UserIndex.vue'
import Home from '@/views/layout/LayoutHome.vue'
import LoginRegister from '@/views/login/LoginRegister.vue'
import DataTotal from '@/views/data/DataTotal.vue'
import AccountDetail from '@/views/account/AccountDetail.vue'
import AccountIndex from '@/views/account/AccountIndex.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: LoginRegister },
    {
      path: '/',
      component: Home,
      redirect: '/account/index',
      children: [
        { path: '/account/index', component: AccountIndex },
        { path: '/user', component: User },
        { path: '/data', component: DataTotal },
      ],
    },
    {
      path: '/account/detail',
      component: AccountDetail,
    },
  ],
})

export default router
