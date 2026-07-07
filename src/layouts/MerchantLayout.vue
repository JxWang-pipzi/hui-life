<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChatDotRound, Goods, House, Service, Tickets } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const menus = [
  { path: '/merchant/dashboard', title: '商家工作台', icon: House, permission: 'merchant:workbench' },
  { path: '/merchant/orders', title: '订单处理', icon: Tickets, permission: 'merchant:order' },
  { path: '/merchant/services', title: '服务维护', icon: Goods, permission: 'merchant:service' },
  { path: '/merchant/reviews', title: '评价反馈', icon: ChatDotRound, permission: 'merchant:review' },
  { path: '/merchant/after-sales', title: '售后处理', icon: Service, permission: 'merchant:after-sale' },
]

const visibleMenus = computed(() => menus.filter((item) => userStore.hasPermission(item.permission)))

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <el-container class="merchant-layout">
    <el-aside width="220px" class="aside">
      <div class="merchant-logo">惠生活商家版</div>
      <el-menu router :default-active="route.path" background-color="#0f3f3b" text-color="#ccfbf1" active-text-color="#ffffff">
        <el-menu-item v-for="item in visibleMenus" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="merchant-header">
        <span>
          当前商家账号：{{ userStore.userInfo?.name }}
          <small>{{ userStore.userInfo?.roles?.map((item) => item.name).join('、') }}</small>
        </span>
        <div>
          <el-button @click="$router.push('/')">返回用户端</el-button>
          <el-button type="danger" plain @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.merchant-layout {
  min-height: 100vh;
}

.aside {
  background: #0f3f3b;
}

.merchant-logo {
  height: 64px;
  padding-left: 20px;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  line-height: 64px;
}

.merchant-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;

  small {
    margin-left: 10px;
    color: #6b7280;
  }
}

@media (max-width: 768px) {
  .aside {
    width: 72px !important;
  }

  .merchant-logo {
    padding: 0;
    text-align: center;
    font-size: 14px;
  }
}
</style>
