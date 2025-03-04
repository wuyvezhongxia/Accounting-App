import { createRouter, createWebHistory } from 'vue-router'
import User from '@/views/user/UserIndex.vue'
import Home from '@/views/layout/LayoutHome.vue'
import LoginRegister from '@/views/login/LoginRegister.vue'
import DataTotal from '@/views/data/DataTotal.vue'
import AccountDetail from '@/views/account/AccountDetail.vue'
import AccountIndex from '@/views/account/AccountIndex.vue'
import AboutUs from '@/views/user/AboutUs.vue'
import UserAccount from '@/views/user/UserAccount.vue'
import { useUserStore } from '@/stores/user'
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
      name: 'detail',
      path: '/account/detail',
      component: AccountDetail,
    },
    {
      path: '/useraccount',
      component: UserAccount,
    },
    {
      path: '/about',
      component: AboutUs,
    },
  ],
})
// const authUrl = ['/account', '/user',...]
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token
  if (to.path === '/login') {
    next()
    return
  }
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router
