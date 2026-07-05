<script setup>
import { onMounted, ref } from 'vue'
import StatusTag from '@/components/StatusTag.vue'
import { getMyOrders } from '@/api/order'

const loading = ref(false)
const orders = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(8)

async function fetchOrders() {
  loading.value = true
  try {
    const result = await getMyOrders({ page: page.value, pageSize: pageSize.value })
    orders.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
</script>

<template>
  <div class="page-container orders-page">
    <h1 class="page-title">我的订单</h1>
    <div class="panel">
      <el-table v-loading="loading" :data="orders">
        <el-table-column prop="serviceTitle" label="服务" min-width="160" />
        <el-table-column prop="appointmentTime" label="预约时间" min-width="150" />
        <el-table-column prop="address" label="地址" min-width="220" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
      </el-table>
      <div class="mobile-orders">
        <div v-for="item in orders" :key="item.id" class="order-card">
          <div class="card-head">
            <strong>{{ item.serviceTitle }}</strong>
            <StatusTag :status="item.status" />
          </div>
          <p>{{ item.appointmentTime }}</p>
          <p>{{ item.address }}</p>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="fetchOrders"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.orders-page {
  padding: 28px 0 44px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.mobile-orders {
  display: none;
}

.order-card {
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;

  p {
    margin: 8px 0 0;
    color: #6b7280;
  }
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 768px) {
  :deep(.el-table) {
    display: none;
  }

  .mobile-orders {
    display: block;
  }
}
</style>
