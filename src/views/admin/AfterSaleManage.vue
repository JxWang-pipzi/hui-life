<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import StatusTag from '@/components/StatusTag.vue'
import { getAdminAfterSales, updateAfterSale } from '@/api/order'
import { required } from '@/utils/validate'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const records = ref([])
const total = ref(0)
const currentRecord = ref(null)
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
  { label: '已提交', value: 'submitted' },
  { label: '处理中', value: 'processing' },
  { label: '已解决', value: 'resolved' },
  { label: '已驳回', value: 'rejected' },
]

const rules = {
  status: [required('请选择处理状态')],
  solution: [required('请输入处理说明')],
}

async function fetchList() {
  loading.value = true
  try {
    const result = await getAdminAfterSales(query)
    records.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

function openProcess(row) {
  currentRecord.value = row
  form.status = row.status === 'submitted' ? 'processing' : row.status
  form.solution = row.solution || ''
  dialogVisible.value = true
}

async function submitProcess() {
  await formRef.value.validate()
  saving.value = true
  try {
    await updateAfterSale(currentRecord.value.id, form)
    ElMessage.success('售后状态已更新')
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
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
        <el-select v-model="query.status" clearable placeholder="处理状态" style="width: 160px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="query.page = 1; fetchList()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="records">
        <el-table-column prop="serviceTitle" label="服务" min-width="150" />
        <el-table-column prop="userName" label="用户" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="reason" label="问题描述" min-width="240" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openProcess(row)">处理</el-button>
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

    <el-dialog v-model="dialogVisible" title="售后处理" width="560px">
      <div v-if="currentRecord" class="record-summary">
        <strong>{{ currentRecord.serviceTitle }}</strong>
        <p>{{ currentRecord.reason }}</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="处理状态" prop="status">
          <el-select v-model="form.status" class="full">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理说明" prop="solution">
          <el-input v-model="form.solution" type="textarea" :rows="4" placeholder="填写回访、复查、退款或驳回原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submitProcess">保存</el-button>
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

.full {
  width: 100%;
}

.record-summary {
  padding: 12px;
  margin-bottom: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  p {
    margin: 8px 0 0;
    color: #4b5563;
    line-height: 1.6;
  }
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
