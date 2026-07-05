<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import StatusTag from '@/components/StatusTag.vue'
import { getAdminOrders, updateOrderStatus } from '@/api/order'

const loading = ref(false)
const orders = ref([])
const total = ref(0)
const query = reactive({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 8,
})

const statusOptions = [
  { label: '待确认', value: 'pending' },
  { label: '已确认', value: 'confirmed' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'canceled' },
]

async function fetchList() {
  loading.value = true
  try {
    const result = await getAdminOrders(query)
    orders.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

async function changeStatus(row, status) {
  await updateOrderStatus(row.id, status)
  ElMessage.success('订单状态已更新')
  fetchList()
}

function reset() {
  query.keyword = ''
  query.status = ''
  query.page = 1
  fetchList()
}

fetchList()
</script>

<template>
  <div>
    <h1 class="page-title">订单管理</h1>
    <div class="panel">
      <div class="toolbar">
        <el-input v-model="query.keyword" clearable placeholder="搜索服务或联系人" style="width: 240px" />
        <el-select v-model="query.status" clearable placeholder="订单状态" style="width: 160px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="query.page = 1; fetchList()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="orders">
        <el-table-column prop="serviceTitle" label="服务" min-width="150" />
        <el-table-column prop="customerName" label="联系人" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="appointmentTime" label="预约时间" width="150" />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-dropdown>
              <el-button link type="primary">修改状态</el-button>
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

@media (max-width: 768px) {
  .toolbar {
    align-items: stretch;

    :deep(.el-input),
    :deep(.el-select),
    :deep(.el-button) {
      width: 100% !important;
    }
  }
}
</style>
