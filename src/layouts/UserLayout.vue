<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="user-main">
    <router-view />
  </main>
  <footer class="footer">
    <div class="page-container footer-inner">
      <div>
        <strong>惠生活服务预约平台</strong>
        <p>面向本地生活服务的官网展示、在线预约、订单跟进一体化前端。</p>
      </div>
      <div class="footer-links">
        <router-link to="/services">在线预约</router-link>
        <router-link to="/my-orders">我的订单</router-link>
        <router-link to="/coupons">优惠券</router-link>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.user-main {
  min-height: calc(100vh - 124px);
}

.footer {
  padding: 30px 0;
  color: #6b7280;
  background: #fff;
  border-top: 1px solid #e5e7eb;
}

.footer-inner {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;

  strong {
    color: #102a43;
    font-size: 18px;
  }

  p {
    margin: 8px 0 0;
  }
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;

  a {
    color: #0f766e;
    font-weight: 700;
  }
}

@media (max-width: 640px) {
  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
