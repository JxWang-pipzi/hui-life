<script setup>
import { ref } from 'vue'
import { getMerchantDashboard, getMerchantOrders, getMerchantReviews } from '@/api/merchant'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const summary = ref({})
const orders = ref([])
const reviews = ref([])

async function fetchData() {
  loading.value = true
  try {
    const [dashboardResult, orderResult, reviewResult] = await Promise.all([
      getMerchantDashboard(),
      getMerchantOrders({ page: 1, pageSize: 5 }),
      getMerchantReviews(),
    ])
    summary.value = dashboardResult
    orders.value = orderResult.list
    reviews.value = reviewResult.slice(0, 5)
  } finally {
    loading.value = false
  }
}

fetchData()
</script>

<template>
  <div v-loading="loading">
    <h1 class="page-title">商家工作台</h1>

    <div class="merchant-card panel">
      <div>
        <p class="eyebrow">当前商家</p>
        <h2>{{ summary.merchant?.providerName }}</h2>
        <p>{{ summary.merchant?.address }}</p>
      </div>
      <el-tag type="success">{{ summary.merchant?.status === 'approved' ? '已审核' : '待审核' }}</el-tag>
    </div>

    <div class="stats-grid">
      <div class="panel stat-card">
        <strong>{{ summary.serviceCount || 0 }}</strong>
        <span>在售服务</span>
      </div>
      <div class="panel stat-card">
        <strong>{{ summary.orderCount || 0 }}</strong>
        <span>累计订单</span>
      </div>
      <div class="panel stat-card">
        <strong>{{ summary.pendingCount || 0 }}</strong>
        <span>待确认</span>
      </div>
      <div class="panel stat-card">
        <strong>{{ summary.rating || '-' }}</strong>
        <span>综合评分</span>
      </div>
    </div>

    <div class="content-grid">
      <div class="panel">
        <div class="section-head">
          <h3>最近订单</h3>
          <el-button link type="primary" @click="$router.push('/merchant/orders')">全部订单</el-button>
        </div>
        <el-table :data="orders">
          <el-table-column prop="serviceTitle" label="服务" min-width="150" />
          <el-table-column prop="customerName" label="联系人" width="100" />
          <el-table-column prop="appointmentTime" label="预约时间" width="150" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <StatusTag :status="row.status" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="panel">
        <div class="section-head">
          <h3>最新评价</h3>
          <el-button link type="primary" @click="$router.push('/merchant/reviews')">查看评价</el-button>
        </div>
        <div v-if="reviews.length === 0" class="empty">暂无评价</div>
        <div v-else class="review-list">
          <div v-for="item in reviews" :key="item.id" class="review-item">
            <div>
              <strong>{{ item.userName }}</strong>
              <span>{{ item.serviceTitle }}</span>
            </div>
            <el-rate :model-value="item.rating" disabled />
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.merchant-card {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2,
  p {
    margin: 0;
  }

  h2 {
    margin: 6px 0;
  }
}

.eyebrow {
  color: #0f766e;
  font-weight: 800;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 16px 0;
}

.stat-card {
  display: grid;
  gap: 8px;
  text-align: center;

  strong {
    color: #0f766e;
    font-size: 32px;
  }
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
  gap: 16px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  h3 {
    margin: 0;
  }
}

.review-list {
  display: grid;
  gap: 14px;
}

.review-item {
  padding-bottom: 14px;
  border-bottom: 1px solid #e5e7eb;

  div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  span,
  p {
    color: #6b7280;
  }
}

.empty {
  color: #6b7280;
  text-align: center;
}

@media (max-width: 900px) {
  .stats-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
