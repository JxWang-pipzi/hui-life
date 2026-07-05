import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/user/Home.vue') },
      { path: 'services', name: 'ServiceList', component: () => import('@/views/user/ServiceList.vue') },
      { path: 'services/:id', name: 'ServiceDetail', component: () => import('@/views/user/ServiceDetail.vue') },
      {
        path: 'booking/:id',
        name: 'OrderForm',
        component: () => import('@/views/user/OrderForm.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'my-orders',
        name: 'MyOrders',
        component: () => import('@/views/user/MyOrders.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  { path: '/login', name: 'Login', component: () => import('@/views/user/Login.vue') },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/admin/Dashboard.vue') },
      { path: 'services', name: 'ServiceManage', component: () => import('@/views/admin/ServiceManage.vue') },
      { path: 'orders', name: 'OrderManage', component: () => import('@/views/admin/OrderManage.vue') },
      { path: 'users', name: 'UserManage', component: () => import('@/views/admin/UserManage.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return '/'
  }

  return true
})

export default router
