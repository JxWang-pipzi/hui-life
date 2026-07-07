<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import UploadImage from '@/components/UploadImage.vue'
import { createMerchantService, getMerchantServices, updateMerchantService } from '@/api/merchant'
import { required } from '@/utils/validate'

const loading = ref(false)
const dialogVisible = ref(false)
const editingId = ref(null)
const services = ref([])
const formRef = ref()
const form = reactive({
  title: '',
  category: 'cleaning',
  categoryName: '家政保洁',
  price: 99,
  desc: '',
  cover: '',
  status: 'enabled',
})

const categories = {
  cleaning: '家政保洁',
  repair: '维修清洗',
  photo: '摄影拍摄',
  course: '兴趣课程',
  beauty: '美容护理',
}

const rules = {
  title: [required('请输入服务名称')],
  price: [required('请输入价格')],
  desc: [required('请输入服务说明')],
}

async function fetchList() {
  loading.value = true
  try {
    services.value = await getMerchantServices()
  } finally {
    loading.value = false
  }
}

function resetForm(row = {}) {
  Object.assign(form, {
    title: row.title || '',
    category: row.category || 'cleaning',
    categoryName: row.categoryName || '家政保洁',
    price: row.price || 99,
    desc: row.desc || '',
    cover: row.cover || '',
    status: row.status || 'enabled',
  })
}

function openCreate() {
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  resetForm(row)
  dialogVisible.value = true
}

async function submitForm() {
  await formRef.value.validate()
  form.categoryName = categories[form.category]
  if (editingId.value) {
    await updateMerchantService(editingId.value, form)
    ElMessage.success('服务已更新')
  } else {
    await createMerchantService(form)
    ElMessage.success('服务已新增')
  }
  dialogVisible.value = false
  fetchList()
}

fetchList()
</script>

<template>
  <div>
    <h1 class="page-title">服务维护</h1>
    <div class="panel">
      <div class="toolbar">
        <el-button type="success" @click="openCreate">新增服务</el-button>
      </div>

      <el-table v-loading="loading" :data="services">
        <el-table-column prop="title" label="服务名称" min-width="160" />
        <el-table-column prop="categoryName" label="分类" width="110" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="90" />
        <el-table-column prop="rating" label="评分" width="90" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'enabled' ? 'success' : 'info'">
              {{ row.status === 'enabled' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
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
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio-button label="enabled">上架</el-radio-button>
            <el-radio-button label="disabled">下架</el-radio-button>
          </el-radio-group>
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
