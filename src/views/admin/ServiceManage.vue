<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import UploadImage from '@/components/UploadImage.vue'
import { createService, deleteService, getAdminServices, updateService } from '@/api/service'
import { required } from '@/utils/validate'

const loading = ref(false)
const dialogVisible = ref(false)
const editingId = ref(null)
const tableData = ref([])
const total = ref(0)
const query = reactive({
  keyword: '',
  page: 1,
  pageSize: 8,
})
const formRef = ref()
const form = reactive({
  title: '',
  category: 'cleaning',
  categoryName: '家政保洁',
  price: '',
  desc: '',
  cover: '',
})

const rules = {
  title: [required('请输入服务名称')],
  price: [required('请输入价格')],
  desc: [required('请输入服务说明')],
}

const categories = {
  cleaning: '家政保洁',
  repair: '维修清洗',
  photo: '摄影拍摄',
  course: '兴趣课程',
  beauty: '美容护理',
}

async function fetchList() {
  loading.value = true
  try {
    const result = await getAdminServices(query)
    tableData.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  Object.assign(form, {
    title: '',
    category: 'cleaning',
    categoryName: '家政保洁',
    price: '',
    desc: '',
    cover: '',
  })
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

async function submitForm() {
  await formRef.value.validate()
  form.categoryName = categories[form.category]
  if (editingId.value) {
    await updateService(editingId.value, form)
    ElMessage.success('服务更新成功')
  } else {
    await createService(form)
    ElMessage.success('服务新增成功')
  }
  dialogVisible.value = false
  fetchList()
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除「${row.title}」吗？`, '提示', { type: 'warning' })
  await deleteService(row.id)
  ElMessage.success('删除成功')
  fetchList()
}

fetchList()
</script>

<template>
  <div>
    <h1 class="page-title">服务管理</h1>
    <div class="panel">
      <div class="toolbar">
        <el-input v-model="query.keyword" clearable placeholder="搜索服务" style="width: 260px" />
        <el-button type="primary" @click="query.page = 1; fetchList()">查询</el-button>
        <el-button @click="query.keyword = ''; query.page = 1; fetchList()">重置</el-button>
        <el-button type="success" @click="openCreate">新增服务</el-button>
      </div>

      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="title" label="服务名称" min-width="160" />
        <el-table-column prop="categoryName" label="分类" width="110" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="rating" label="评分" width="100" />
        <el-table-column label="操作" width="170" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑服务' : '新增服务'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="服务名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="服务分类">
          <el-select v-model="form.category">
            <el-option v-for="(label, value) in categories" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="1" />
        </el-form-item>
        <el-form-item label="图片">
          <UploadImage v-model="form.cover" />
        </el-form-item>
        <el-form-item label="服务说明" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
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
