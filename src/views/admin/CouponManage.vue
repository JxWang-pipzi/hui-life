<script setup>
import { reactive, ref } from 'vue'
import { Delete, Discount, Edit, Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatusTag from '@/components/StatusTag.vue'
import { createCoupon, deleteCoupon, getAdminCoupons, updateCoupon } from '@/api/operation'
import { required } from '@/utils/validate'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const editingId = ref(null)
const list = ref([])
const total = ref(0)
const query = reactive({ keyword: '', status: '', page: 1, pageSize: 8 })
const form = reactive({
  title: '',
  thresholdAmount: 0,
  discountAmount: 10,
  category: '',
  startAt: '',
  endAt: '',
  stock: 100,
  status: 'enabled',
})

const rules = {
  title: [required('请输入优惠券名称')],
  discountAmount: [required('请输入优惠金额')],
  startAt: [required('请选择开始时间')],
  endAt: [required('请选择结束时间')],
}

async function fetchList() {
  loading.value = true
  try {
    const result = await getAdminCoupons(query)
    list.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

function resetForm() {
  editingId.value = null
  Object.assign(form, { title: '', thresholdAmount: 0, discountAmount: 10, category: '', startAt: '', endAt: '', stock: 100, status: 'enabled' })
  formRef.value?.clearValidate()
}

function openCreate() {
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

async function save() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (editingId.value) await updateCoupon(editingId.value, form)
    else await createCoupon(form)
    ElMessage.success('优惠券已保存')
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
}

async function remove(row) {
  await ElMessageBox.confirm(`确认删除优惠券「${row.title}」吗？`, '删除优惠券', { type: 'warning' })
  await deleteCoupon(row.id)
  ElMessage.success('优惠券已删除')
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
    <div class="page-head">
      <h1 class="page-title">优惠券管理</h1>
      <el-button type="primary" :icon="Plus" @click="openCreate">新增优惠券</el-button>
    </div>
    <div class="panel">
      <div class="toolbar">
        <el-input v-model="query.keyword" clearable placeholder="搜索优惠券名称" style="width: 240px" />
        <el-select v-model="query.status" clearable placeholder="状态" style="width: 140px">
          <el-option label="启用" value="enabled" />
          <el-option label="禁用" value="disabled" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="query.page = 1; fetchList()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="名称" min-width="180">
          <template #default="{ row }">
            <el-icon class="table-icon"><Discount /></el-icon>
            {{ row.title }}
          </template>
        </el-table-column>
        <el-table-column label="门槛/优惠" width="140">
          <template #default="{ row }">满 {{ row.thresholdAmount }} 减 {{ row.discountAmount }}</template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="stock" label="库存" width="90" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><StatusTag :status="row.status" /></template>
        </el-table-column>
        <el-table-column label="有效期" min-width="220">
          <template #default="{ row }">{{ row.startAt }} 至 {{ row.endAt }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="Edit" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" :icon="Delete" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="query.page" background layout="prev, pager, next" :total="total" :page-size="query.pageSize" @current-change="fetchList" />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑优惠券' : '新增优惠券'" width="640px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="名称" prop="title"><el-input v-model="form.title" /></el-form-item>
        <div class="form-grid">
          <el-form-item label="使用门槛">
            <el-input-number v-model="form.thresholdAmount" class="full" :min="0" />
          </el-form-item>
          <el-form-item label="优惠金额" prop="discountAmount">
            <el-input-number v-model="form.discountAmount" class="full" :min="1" />
          </el-form-item>
          <el-form-item label="库存">
            <el-input-number v-model="form.stock" class="full" :min="0" />
          </el-form-item>
        </div>
        <div class="form-grid">
          <el-form-item label="分类">
            <el-input v-model="form.category" placeholder="cleaning / repair 等" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" class="full">
              <el-option label="启用" value="enabled" />
              <el-option label="禁用" value="disabled" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-grid">
          <el-form-item label="开始时间" prop="startAt">
            <el-date-picker v-model="form.startAt" class="full" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
          <el-form-item label="结束时间" prop="endAt">
            <el-date-picker v-model="form.endAt" class="full" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.page-head,
.form-grid {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.form-grid {
  align-items: flex-start;

  :deep(.el-form-item) {
    flex: 1;
  }
}

.full {
  width: 100%;
}

.table-icon {
  margin-right: 6px;
  color: #e35d2f;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
</style>
