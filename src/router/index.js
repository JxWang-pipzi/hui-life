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
      {
        path: 'addresses',
        name: 'AddressManage',
        component: () => import('@/views/user/AddressManage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'coupons',
        name: 'CouponCenter',
        component: () => import('@/views/user/CouponCenter.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  { path: '/login', name: 'Login', component: () => import('@/views/user/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/user/Register.vue') },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { permission: 'dashboard:view' },
      },
      {
        path: 'services',
        name: 'ServiceManage',
        component: () => import('@/views/admin/ServiceManage.vue'),
        meta: { permission: 'service:manage' },
      },
      {
        path: 'orders',
        name: 'OrderManage',
        component: () => import('@/views/admin/OrderManage.vue'),
        meta: { permission: 'order:manage' },
      },
      {
        path: 'after-sales',
        name: 'AfterSaleManage',
        component: () => import('@/views/admin/AfterSaleManage.vue'),
        meta: { permission: 'after-sale:manage' },
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('@/views/admin/UserManage.vue'),
        meta: { permission: 'user:manage' },
      },
      {
        path: 'announcements',
        name: 'AnnouncementManage',
        component: () => import('@/views/admin/AnnouncementManage.vue'),
        meta: { permission: 'announcement:manage' },
      },
      {
        path: 'coupons',
        name: 'CouponManage',
        component: () => import('@/views/admin/CouponManage.vue'),
        meta: { permission: 'coupon:manage' },
      },
      {
        path: 'roles',
        name: 'RoleManage',
        component: () => import('@/views/admin/RoleManage.vue'),
        meta: { permission: 'role:manage' },
      },
      {
        path: 'logs',
        name: 'OperationLogs',
        component: () => import('@/views/admin/OperationLogs.vue'),
        meta: { permission: 'log:view' },
      },
    ],
  },
  {
    path: '/merchant',
    component: () => import('@/layouts/MerchantLayout.vue'),
    meta: { requiresAuth: true, requiresMerchant: true },
    children: [
      { path: '', redirect: '/merchant/dashboard' },
      {
        path: 'dashboard',
        name: 'MerchantDashboard',
        component: () => import('@/views/merchant/Dashboard.vue'),
        meta: { permission: 'merchant:workbench' },
      },
      {
        path: 'orders',
        name: 'MerchantOrders',
        component: () => import('@/views/merchant/Orders.vue'),
        meta: { permission: 'merchant:order' },
      },
      {
        path: 'services',
        name: 'MerchantServices',
        component: () => import('@/views/merchant/Services.vue'),
        meta: { permission: 'merchant:service' },
      },
      {
        path: 'reviews',
        name: 'MerchantReviews',
        component: () => import('@/views/merchant/Reviews.vue'),
        meta: { permission: 'merchant:review' },
      },
      {
        path: 'after-sales',
        name: 'MerchantAfterSales',
        component: () => import('@/views/merchant/AfterSales.vue'),
        meta: { permission: 'merchant:after-sale' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to) => {
    if (to.hash) {
      return { el: to.hash, top: 80, behavior: 'smooth' }
    }

    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return '/'
  }

  if (to.meta.requiresMerchant && !userStore.isMerchant) {
    return '/'
  }

  if (to.meta.permission && !userStore.hasPermission(to.meta.permission)) {
    return to.path.startsWith('/merchant') ? '/merchant' : '/admin'
  }

  return true
})

export default router
