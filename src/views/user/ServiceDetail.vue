<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getServiceDetail } from '@/api/service'

const route = useRoute()
const service = ref(null)

onMounted(async () => {
  service.value = await getServiceDetail(route.params.id)
})
</script>

<template>
  <div class="page-container detail-page">
    <el-skeleton v-if="!service" :rows="8" animated />
    <template v-else>
      <div class="detail-main">
        <img :src="service.cover" :alt="service.title" loading="lazy" />
        <div class="panel info">
          <el-tag type="success">{{ service.categoryName }}</el-tag>
          <h1>{{ service.title }}</h1>
          <p>{{ service.desc }}</p>
          <div class="price">¥{{ service.price }}</div>
          <div class="stats">
            <span>评分 {{ service.rating }}</span>
            <span>已预约 {{ service.sales }}</span>
          </div>
          <el-button type="primary" size="large" @click="$router.push(`/booking/${service.id}`)">
            立即预约
          </el-button>
        </div>
      </div>

      <div class="panel">
        <h2 class="section-title">服务说明</h2>
        <p class="content">
          下单后工作人员会在 2 小时内确认预约时间。若需要修改地址或时间，可在订单确认前联系客服处理。
          本项目重点演示详情页、登录跳转、订单表单和接口联调流程。
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.detail-page {
  display: grid;
  gap: 20px;
  padding: 28px 0 44px;
}

.detail-main {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;

  > img {
    width: 100%;
    height: 420px;
    object-fit: cover;
    border-radius: 8px;
  }
}

.info {
  h1 {
    margin: 16px 0 12px;
    font-size: 30px;
  }

  p {
    color: #6b7280;
    line-height: 1.7;
  }
}

.price {
  margin: 20px 0;
  color: #e35d2f;
  font-size: 32px;
  font-weight: 800;
}

.stats {
  display: flex;
  gap: 18px;
  margin-bottom: 24px;
  color: #6b7280;
}

.content {
  color: #4b5563;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .detail-main {
    grid-template-columns: 1fr;

    > img {
      height: 260px;
    }
  }
}
</style>
