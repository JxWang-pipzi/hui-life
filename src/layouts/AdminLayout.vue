<script setup>
import { DataAnalysis, List, Tickets, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <el-container class="admin-layout">
    <el-aside width="220px" class="aside">
      <div class="admin-logo">惠生活后台</div>
      <el-menu router default-active="/admin/dashboard" background-color="#12352b" text-color="#d1fae5" active-text-color="#ffffff">
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/admin/services">
          <el-icon><List /></el-icon>
          <span>服务管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/orders">
          <el-icon><Tickets /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <span>当前账号：{{ userStore.userInfo?.name }}</span>
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
