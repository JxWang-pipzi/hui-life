<script setup>
import { reactive, ref } from 'vue'
import { getOperationLogs } from '@/api/rbac'

const loading = ref(false)
const logs = ref([])
const total = ref(0)
const query = reactive({
  keyword: '',
  page: 1,
  pageSize: 8,
})

async function fetchList() {
  loading.value = true
  try {
    const result = await getOperationLogs(query)
    logs.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

function reset() {
  query.keyword = ''
  query.page = 1
  fetchList()
}

fetchList()
</script>

<template>
  <div>
    <h1 class="page-title">操作日志</h1>
    <div class="panel">
      <div class="toolbar">
        <el-input v-model="query.keyword" clearable placeholder="搜索操作人、动作或对象" style="width: 260px" />
        <el-button type="primary" @click="query.page = 1; fetchList()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="logs">
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="action" label="动作" width="140" />
        <el-table-column prop="target" label="对象" min-width="180" />
        <el-table-column prop="detail" label="详情" min-width="240" />
        <el-table-column prop="createdAt" label="时间" width="170" />
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
    :deep(.el-button) {
      width: 100% !important;
    }
  }
}
</style>
