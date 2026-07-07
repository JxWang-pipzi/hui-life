<script setup>
import { Menu, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <header class="app-header">
    <div class="page-container header-inner">
      <router-link class="brand" to="/">惠生活</router-link>

      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/services">服务预约</router-link>
        <router-link to="/my-orders">我的订单</router-link>
        <router-link to="/coupons">优惠券</router-link>
        <router-link to="/addresses">地址管理</router-link>
        <router-link v-if="userStore.isAdmin" to="/admin">后台管理</router-link>
      </nav>

      <div class="actions">
        <template v-if="userStore.isLogin">
          <el-dropdown>
            <el-button :icon="User">
              {{ userStore.userInfo?.name }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/my-orders')">我的订单</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/coupons')">优惠券</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/addresses')">地址管理</el-dropdown-item>
                <el-dropdown-item v-if="userStore.isAdmin" @click="$router.push('/admin')">
                  后台管理
                </el-dropdown-item>
                <el-dropdown-item divided @click="userStore.logout()">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <el-button v-else type="primary" @click="$router.push('/login')">登录</el-button>
      </div>

      <el-dropdown class="mobile-menu" trigger="click">
        <el-button :icon="Menu" circle />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$router.push('/')">首页</el-dropdown-item>
            <el-dropdown-item @click="$router.push('/services')">服务预约</el-dropdown-item>
            <el-dropdown-item @click="$router.push('/my-orders')">我的订单</el-dropdown-item>
            <el-dropdown-item @click="$router.push('/coupons')">优惠券</el-dropdown-item>
            <el-dropdown-item @click="$router.push('/addresses')">地址管理</el-dropdown-item>
            <el-dropdown-item v-if="userStore.isAdmin" @click="$router.push('/admin')">
              后台管理
            </el-dropdown-item>
            <el-dropdown-item v-if="!userStore.isLogin" divided @click="$router.push('/login')">
              登录
            </el-dropdown-item>
            <el-dropdown-item v-else divided @click="userStore.logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #e5e7eb;
  backdrop-filter: blur(12px);
}

.header-inner {
  display: flex;
  align-items: center;
  height: 64px;
  gap: 28px;
}

.brand {
  font-size: 24px;
  font-weight: 800;
  color: #1f7a5c;
}

.nav {
  display: flex;
  gap: 22px;
  flex: 1;

  a {
    color: #4b5563;
    font-weight: 500;
  }

  .router-link-active {
    color: #1f7a5c;
  }
}

.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .header-inner {
    height: 56px;
  }

  .nav,
  .actions {
    display: none;
  }

  .mobile-menu {
    display: block;
    margin-left: auto;
  }
}
</style>
