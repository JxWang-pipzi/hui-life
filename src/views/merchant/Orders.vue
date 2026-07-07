<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getMerchantOrders, updateMerchantOrderStatus } from '@/api/merchant'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const orders = ref([])
const total = ref(0)
const query = reactive({
  page: 1,
  pageSize: 8,
})

const statusOptions = [
  { label: '确认接单', value: 'confirmed' },
  { label: '完成服务', value: 'completed' },
  { label: '取消订单', value: 'canceled' },
]

async function fetchList() {
  loading.value = true
  try {
    const result = await getMerchantOrders(query)
    orders.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

async function changeStatus(row, status) {
  await updateMerchantOrderStatus(row.id, status)
  ElMessage.success('订单状态已更新')
  fetchList()
}

fetchList()
</script>

<template>
  <div>
    <h1 class="page-title">订单处理</h1>
    <div class="panel">
      <el-table v-loading="loading" :data="orders">
        <el-table-column prop="serviceTitle" label="服务" min-width="150" />
        <el-table-column prop="customerName" label="联系人" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="appointmentTime" label="预约时间" width="150" />
        <el-table-column prop="address" label="地址" min-width="220" />
        <el-table-column label="评价" width="100">
          <template #default="{ row }">
            <span>{{ row.reviewRating ? `${row.reviewRating} 分` : '未评价' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-dropdown>
              <el-button link type="primary">处理订单</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item in statusOptions" :key="item.value" @click="changeStatus(row, item.value)">
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="query.page"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="query.pageSize"
          @current-change="fetchList"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
</style>
