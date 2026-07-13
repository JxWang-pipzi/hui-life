<script setup>
import { Menu, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <header class="app-header">
    <div class="page-container header-inner">
      <router-link class="brand" to="/">
        <span>惠生活</span>
        <small>Life Booking</small>
      </router-link>

      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link :to="{ path: '/', hash: '#services' }">服务项目</router-link>
        <router-link :to="{ path: '/', hash: '#process' }">预约流程</router-link>
        <router-link :to="{ path: '/', hash: '#guarantee' }">服务保障</router-link>
        <router-link to="/services">在线预约</router-link>
        <router-link to="/my-orders">我的订单</router-link>
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
            <el-dropdown-item @click="$router.push('/services')">在线预约</el-dropdown-item>
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
  z-index: 20;
  background: rgba(248, 250, 252, 0.78);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(22px) saturate(1.35);
}

.header-inner {
  display: flex;
  align-items: center;
  height: 64px;
  gap: 28px;
}

.brand {
  display: grid;
  gap: 2px;
  font-weight: 800;
  color: #0f172a;

  span {
    font-size: 22px;
    line-height: 1;
  }

  small {
    color: #14b8a6;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
  }
}

.nav {
  display: flex;
  gap: 22px;
  flex: 1;

  a {
    color: #475569;
    font-weight: 500;
    transition: color 0.18s ease;
  }

  .router-link-active,
  a:hover {
    color: #14b8a6;
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
