<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="user-main">
    <router-view />
  </main>
  <footer class="footer">
    <div class="page-container">惠生活服务预约平台 - 前端工程化练习项目</div>
  </footer>
</template>

<style scoped lang="scss">
.user-main {
  min-height: calc(100vh - 124px);
}

.footer {
  padding: 24px 0;
  color: #6b7280;
  background: #fff;
  border-top: 1px solid #e5e7eb;
}
</style>
