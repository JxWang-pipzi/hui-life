<script setup>
import { reactive, ref } from 'vue'
import { Bell, Delete, Edit, Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatusTag from '@/components/StatusTag.vue'
import { createAnnouncement, deleteAnnouncement, getAdminAnnouncements, updateAnnouncement } from '@/api/operation'
import { required } from '@/utils/validate'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const editingId = ref(null)
const list = ref([])
const total = ref(0)
const query = reactive({ keyword: '', status: '', page: 1, pageSize: 8 })
const form = reactive({ title: '', content: '', scene: 'home', status: 'published', sort: 0 })

const rules = {
  title: [required('请输入公告标题')],
  content: [required('请输入公告内容')],
  scene: [required('请选择展示场景')],
  status: [required('请选择状态')],
}

async function fetchList() {
  loading.value = true
  try {
    const result = await getAdminAnnouncements(query)
    list.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

function resetForm() {
  editingId.value = null
  Object.assign(form, { title: '', content: '', scene: 'home', status: 'published', sort: 0 })
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
    if (editingId.value) await updateAnnouncement(editingId.value, form)
    else await createAnnouncement(form)
    ElMessage.success('公告已保存')
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
}

async function remove(row) {
  await ElMessageBox.confirm(`确认删除公告「${row.title}」吗？`, '删除公告', { type: 'warning' })
  await deleteAnnouncement(row.id)
  ElMessage.success('公告已删除')
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
      <h1 class="page-title">公告管理</h1>
      <el-button type="primary" :icon="Plus" @click="openCreate">新增公告</el-button>
    </div>
    <div class="panel">
      <div class="toolbar">
        <el-input v-model="query.keyword" clearable placeholder="搜索标题或内容" style="width: 240px" />
        <el-select v-model="query.status" clearable placeholder="状态" style="width: 140px">
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="query.page = 1; fetchList()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="list">
        <el-table-column label="标题" min-width="180">
          <template #default="{ row }">
            <el-icon class="table-icon"><Bell /></el-icon>
            {{ row.title }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="260" />
        <el-table-column prop="scene" label="场景" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><StatusTag :status="row.status" /></template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑公告' : '新增公告'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="标题" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="内容" prop="content"><el-input v-model="form.content" type="textarea" :rows="4" /></el-form-item>
        <div class="form-grid">
          <el-form-item label="场景" prop="scene">
            <el-select v-model="form.scene" class="full">
              <el-option label="首页" value="home" />
              <el-option label="优惠券" value="coupon" />
              <el-option label="订单" value="order" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" class="full">
              <el-option label="已发布" value="published" />
              <el-option label="草稿" value="draft" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" class="full" :min="0" />
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
}

.full {
  width: 100%;
}

.table-icon {
  margin-right: 6px;
  color: #1f7a5c;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
</style>
