<script setup>
import { onMounted, ref } from 'vue'
import { Bell, Discount } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getAnnouncements, getCoupons, receiveCoupon } from '@/api/operation'

const loading = ref(false)
const announcements = ref([])
const coupons = ref([])

async function fetchData() {
  loading.value = true
  try {
    const [announcementResult, couponResult] = await Promise.all([getAnnouncements({ scene: 'coupon' }), getCoupons()])
    announcements.value = announcementResult
    coupons.value = couponResult
  } finally {
    loading.value = false
  }
}

async function receive(row) {
  await receiveCoupon(row.id)
  ElMessage.success('领取成功')
  fetchData()
}

onMounted(fetchData)
</script>

<template>
  <div class="page-container coupon-page">
    <h1 class="page-title">优惠券中心</h1>
    <div v-if="announcements.length" class="notice-list">
      <div v-for="item in announcements" :key="item.id" class="notice-item">
        <el-icon><Bell /></el-icon>
        <span>{{ item.title }}：{{ item.content }}</span>
      </div>
    </div>

    <el-skeleton v-if="loading" :rows="6" animated />
    <div v-else class="coupon-grid">
      <div v-for="item in coupons" :key="item.id" class="coupon-card">
        <div class="coupon-icon">
          <el-icon><Discount /></el-icon>
        </div>
        <div class="coupon-body">
          <strong>{{ item.title }}</strong>
          <p>满 {{ item.thresholdAmount }} 元可用，适用分类：{{ item.category || '全部' }}</p>
          <small>有效期：{{ item.startAt }} 至 {{ item.endAt }}</small>
        </div>
        <div class="coupon-action">
          <span>¥{{ item.discountAmount }}</span>
          <el-button type="primary" :disabled="item.received || item.stock <= 0" @click="receive(item)">
            {{ item.received ? '已领取' : item.stock <= 0 ? '已领完' : '立即领取' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.coupon-page {
  padding: 28px 0 44px;
}

.notice-list {
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}

.notice-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 14px;
  color: #166534;
  background: #dcfce7;
  border-radius: 8px;
}

.coupon-grid {
  display: grid;
  gap: 16px;
}

.coupon-card {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) 160px;
  gap: 16px;
  align-items: center;
  padding: 18px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.coupon-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  color: #e35d2f;
  font-size: 34px;
  background: #fff1eb;
  border-radius: 8px;
}

.coupon-body {
  strong {
    display: block;
    font-size: 18px;
  }

  p,
  small {
    display: block;
    margin: 8px 0 0;
    color: #6b7280;
  }
}

.coupon-action {
  display: grid;
  gap: 10px;
  justify-items: end;

  span {
    color: #e35d2f;
    font-size: 30px;
    font-weight: 800;
  }
}

@media (max-width: 700px) {
  .coupon-card {
    grid-template-columns: 52px 1fr;
  }

  .coupon-action {
    grid-column: 1 / -1;
    grid-template-columns: 1fr auto;
    align-items: center;
    justify-items: start;
  }
}
</style>
