<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { DataAnalysis, Discount, List, Lock, Memo, Notification, Tickets, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const route = useRoute()

const menus = [
  { path: '/admin/dashboard', title: '数据概览', icon: DataAnalysis, permission: 'dashboard:view' },
  { path: '/admin/services', title: '服务管理', icon: List, permission: 'service:manage' },
  { path: '/admin/orders', title: '订单管理', icon: Tickets, permission: 'order:manage' },
  { path: '/admin/after-sales', title: '售后处理', icon: Tickets, permission: 'after-sale:manage' },
  { path: '/admin/announcements', title: '公告管理', icon: Notification, permission: 'announcement:manage' },
  { path: '/admin/coupons', title: '优惠券管理', icon: Discount, permission: 'coupon:manage' },
  { path: '/admin/users', title: '用户管理', icon: User, permission: 'user:manage' },
  { path: '/admin/roles', title: '角色权限', icon: Lock, permission: 'role:manage' },
  { path: '/admin/logs', title: '操作日志', icon: Memo, permission: 'log:view' },
]

const visibleMenus = computed(() => menus.filter((item) => userStore.hasPermission(item.permission)))
</script>

<template>
  <el-container class="admin-layout">
    <el-aside width="220px" class="aside">
      <div class="admin-logo">惠生活后台</div>
      <el-menu router :default-active="route.path" background-color="#12352b" text-color="#d1fae5" active-text-color="#ffffff">
        <el-menu-item v-for="item in visibleMenus" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <span>
          当前账号：{{ userStore.userInfo?.name }}
          <small>{{ userStore.userInfo?.roles?.map((item) => item.name).join('、') }}</small>
        </span>
        <div>
          <el-button @click="$router.push('/')">返回前台</el-button>
          <el-button type="danger" plain @click="userStore.logout()">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
}

.aside {
  background: #12352b;
}

.admin-logo {
  height: 64px;
  padding-left: 20px;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  line-height: 64px;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .aside {
    width: 72px !important;
  }

  .admin-logo {
    padding: 0;
    text-align: center;
    font-size: 14px;
  }
}
</style>
