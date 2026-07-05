<script setup>
defineProps({
  service: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <router-link class="service-card" :to="`/services/${service.id}`">
    <img :src="service.cover" :alt="service.title" loading="lazy" />
    <div class="content">
      <div class="meta">
        <el-tag size="small" type="success">{{ service.categoryName }}</el-tag>
        <span>{{ service.rating }} 分</span>
      </div>
      <h3>{{ service.title }}</h3>
      <p>{{ service.desc }}</p>
      <div class="footer">
        <strong>¥{{ service.price }}</strong>
        <span>已预约 {{ service.sales }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.service-card {
  display: block;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  }

  img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }
}

.content {
  padding: 14px;
}

.meta,
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #6b7280;
  font-size: 13px;
}

h3 {
  margin: 12px 0 8px;
  font-size: 18px;
}

p {
  display: -webkit-box;
  min-height: 42px;
  margin: 0 0 14px;
  overflow: hidden;
  color: #6b7280;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

strong {
  color: #e35d2f;
  font-size: 20px;
}
</style>
