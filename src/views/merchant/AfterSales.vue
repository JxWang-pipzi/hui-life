<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getMerchantAfterSales, updateMerchantAfterSale } from '@/api/merchant'

const loading = ref(false)
const dialogVisible = ref(false)
const currentRow = ref(null)
const tableData = ref([])
const total = ref(0)
const query = reactive({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 8,
})
const form = reactive({
  status: 'processing',
  solution: '',
})

const statusOptions = [
  { label: '已提交', value: 'submitted', type: 'warning' },
  { label: '处理中', value: 'processing', type: 'primary' },
  { label: '已解决', value: 'resolved', type: 'success' },
  { label: '已关闭', value: 'closed', type: 'info' },
]

function statusMeta(status) {
  return statusOptions.find((item) => item.value === status) || { label: status, type: 'info' }
}

async function fetchList() {
  loading.value = true
  try {
    const result = await getMerchantAfterSales(query)
    tableData.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

function openHandle(row) {
  currentRow.value = row
  form.status = row.status === 'submitted' ? 'processing' : row.status
  form.solution = row.solution || ''
  dialogVisible.value = true
}

async function submitHandle() {
  await updateMerchantAfterSale(currentRow.value.id, form)
  ElMessage.success('售后处理已更新')
  dialogVisible.value = false
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
    <h1 class="page-title">售后处理</h1>
    <div class="panel">
      <div class="toolbar">
        <el-input v-model="query.keyword" clearable placeholder="搜索服务、用户或手机号" style="width: 240px" />
        <el-select v-model="query.status" clearable placeholder="处理状态" style="width: 150px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="query.page = 1; fetchList()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="serviceTitle" label="服务" min-width="150" />
        <el-table-column prop="userName" label="用户" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="reason" label="售后原因" min-width="260" />
        <el-table-column prop="solution" label="处理方案" min-width="240" show-overflow-tooltip />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusMeta(row.status).type">{{ statusMeta(row.status).label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="150" />
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openHandle(row)">处理</el-button>
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

    <el-dialog v-model="dialogVisible" title="处理售后" width="560px">
      <el-form :model="form" label-position="top">
        <el-form-item label="处理状态">
          <el-select v-model="form.status">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理方案">
          <el-input v-model="form.solution" type="textarea" :rows="5" placeholder="填写复查、补修、退款协商或关闭原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
</style>
