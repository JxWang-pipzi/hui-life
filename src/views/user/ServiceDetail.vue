<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getServiceDetail, getServiceReviews } from '@/api/service'

const route = useRoute()
const service = ref(null)
const reviews = ref([])

onMounted(async () => {
  const [serviceResult, reviewResult] = await Promise.all([
    getServiceDetail(route.params.id),
    getServiceReviews({ serviceId: route.params.id, pageSize: 3 }),
  ])
  service.value = serviceResult
  reviews.value = reviewResult.list
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
          完成服务后可提交评价，如遇服务质量问题可在订单页申请售后。
        </p>
        <div class="guarantee-list">
          <span v-for="item in service.guarantee" :key="item">{{ item }}</span>
        </div>
      </div>

      <div class="panel">
        <h2 class="section-title">用户评价</h2>
        <el-empty v-if="reviews.length === 0" description="暂无评价" />
        <div v-else class="review-list">
          <div v-for="item in reviews" :key="item.id" class="review-item">
            <div class="review-head">
              <strong>{{ item.userName }}</strong>
              <el-rate :model-value="item.rating" disabled size="small" />
              <span>{{ item.createdAt }}</span>
            </div>
            <p>{{ item.content }}</p>
            <div class="tag-list">
              <el-tag v-for="tag in item.tags" :key="tag" size="small">{{ tag }}</el-tag>
            </div>
          </div>
        </div>
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

.guarantee-list,
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.guarantee-list span {
  padding: 8px 12px;
  color: #166534;
  background: #dcfce7;
  border-radius: 999px;
}

.review-list {
  display: grid;
  gap: 16px;
}

.review-item {
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  p {
    margin: 10px 0 0;
    color: #4b5563;
    line-height: 1.7;
  }
}

.review-head {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;

  span {
    color: #6b7280;
    font-size: 13px;
  }
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
