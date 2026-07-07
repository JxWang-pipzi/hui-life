<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createAddress, deleteAddress, getAddresses, updateAddress } from '@/api/address'
import { phoneRule, required } from '@/utils/validate'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const addresses = ref([])
const editingId = ref(null)
const form = reactive({
  contactName: '',
  phone: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
})

const rules = {
  contactName: [required('请输入联系人')],
  phone: [phoneRule()],
  city: [required('请输入城市')],
  district: [required('请输入区县')],
  detail: [required('请输入详细地址')],
}

function resetForm() {
  editingId.value = null
  Object.assign(form, {
    contactName: '',
    phone: '',
    city: '',
    district: '',
    detail: '',
    isDefault: addresses.value.length === 0,
  })
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

async function fetchList() {
  loading.value = true
  try {
    addresses.value = await getAddresses()
  } finally {
    loading.value = false
  }
}

async function saveAddress() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (editingId.value) {
      await updateAddress(editingId.value, form)
    } else {
      await createAddress(form)
    }
    ElMessage.success('地址已保存')
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
}

async function removeAddress(row) {
  await ElMessageBox.confirm('确认删除这个地址吗？', '删除地址', { type: 'warning' })
  await deleteAddress(row.id)
  ElMessage.success('地址已删除')
  fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="page-container address-page">
    <div class="page-head">
      <h1 class="page-title">地址管理</h1>
      <el-button type="primary" @click="openCreate">新增地址</el-button>
    </div>

    <div class="panel">
      <el-skeleton v-if="loading" :rows="4" animated />
      <el-empty v-else-if="addresses.length === 0" description="暂无常用地址" />
      <div v-else class="address-list">
        <div v-for="item in addresses" :key="item.id" class="address-card">
          <div>
            <div class="address-title">
              <strong>{{ item.contactName }}</strong>
              <span>{{ item.phone }}</span>
              <el-tag v-if="item.isDefault" size="small" type="success">默认</el-tag>
            </div>
            <p>{{ item.city }}{{ item.district }}{{ item.detail }}</p>
          </div>
          <div class="card-actions">
            <el-button link type="primary" @click="openEdit(item)">编辑</el-button>
            <el-button link type="danger" @click="removeAddress(item)">删除</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑地址' : '新增地址'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="form.contactName" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <div class="form-grid">
          <el-form-item label="城市" prop="city">
            <el-input v-model="form.city" placeholder="如：上海市" />
          </el-form-item>
          <el-form-item label="区县" prop="district">
            <el-input v-model="form.district" placeholder="如：浦东新区" />
          </el-form-item>
        </div>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="form.detail" placeholder="街道、小区、门牌号" />
        </el-form-item>
        <el-checkbox v-model="form.isDefault">设为默认地址</el-checkbox>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.address-page {
  padding: 28px 0 44px;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.address-list {
  display: grid;
  gap: 14px;
}

.address-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  p {
    margin: 8px 0 0;
    color: #4b5563;
  }
}

.address-title,
.card-actions,
.form-grid {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-grid {
  align-items: flex-start;

  :deep(.el-form-item) {
    flex: 1;
  }
}

@media (max-width: 640px) {
  .page-head,
  .address-card,
  .form-grid {
    flex-direction: column;
    align-items: stretch;
  }

  .card-actions {
    justify-content: flex-end;
  }
}
</style>
