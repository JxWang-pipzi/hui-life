<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createRole, deleteRole, getPermissions, getRoles, updateRole } from '@/api/rbac'
import { required } from '@/utils/validate'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const roles = ref([])
const permissions = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(8)
const formRef = ref()
const editingId = ref(null)
const form = reactive({
  name: '',
  code: '',
  desc: '',
  permissions: [],
})

const rules = {
  name: [required('请输入角色名称')],
  code: [required('请输入角色编码')],
  permissions: [required('请选择权限')],
}

const permissionGroups = computed(() => {
  return permissions.value.reduce((groups, item) => {
    if (!groups[item.group]) groups[item.group] = []
    groups[item.group].push(item)
    return groups
  }, {})
})

function resetForm() {
  editingId.value = null
  Object.assign(form, { name: '', code: '', desc: '', permissions: [] })
  formRef.value?.clearValidate()
}

function openCreate() {
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    code: row.code,
    desc: row.desc,
    permissions: [...row.permissions],
  })
  dialogVisible.value = true
}

async function fetchList() {
  loading.value = true
  try {
    const result = await getRoles({ page: page.value, pageSize: pageSize.value })
    roles.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

async function saveRole() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (editingId.value) {
      await updateRole(editingId.value, form)
    } else {
      await createRole(form)
    }
    ElMessage.success('角色已保存')
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
}

async function removeRole(row) {
  await ElMessageBox.confirm(`确认删除角色「${row.name}」吗？`, '删除角色', { type: 'warning' })
  await deleteRole(row.id)
  ElMessage.success('角色已删除')
  fetchList()
}

onMounted(async () => {
  permissions.value = await getPermissions()
  fetchList()
})
</script>

<template>
  <div>
    <div class="page-head">
      <h1 class="page-title">角色权限</h1>
      <el-button type="primary" @click="openCreate">新增角色</el-button>
    </div>

    <div class="panel">
      <el-table v-loading="loading" :data="roles">
        <el-table-column prop="name" label="角色名称" min-width="130" />
        <el-table-column prop="code" label="角色编码" min-width="140" />
        <el-table-column prop="desc" label="说明" min-width="220" />
        <el-table-column label="权限" min-width="260">
          <template #default="{ row }">
            <div class="permission-tags">
              <el-tag v-for="code in row.permissions.slice(0, 4)" :key="code" size="small">
                {{ permissions.find((item) => item.code === code)?.name || code }}
              </el-tag>
              <span v-if="row.permissions.length > 4" class="muted">+{{ row.permissions.length - 4 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" :disabled="[1, 4].includes(row.id)" @click="removeRole(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="fetchList"
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑角色' : '新增角色'" width="680px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="form-grid">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="如：运营专员" />
          </el-form-item>
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="form.code" placeholder="如：operator" />
          </el-form-item>
        </div>
        <el-form-item label="角色说明">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="说明角色职责和使用范围" />
        </el-form-item>
        <el-form-item label="权限配置" prop="permissions">
          <div class="permission-groups">
            <div v-for="(items, group) in permissionGroups" :key="group" class="permission-group">
              <strong>{{ group }}</strong>
              <el-checkbox-group v-model="form.permissions">
                <el-checkbox v-for="item in items" :key="item.code" :label="item.code" :value="item.code">
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveRole">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.permission-tags,
.form-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.form-grid {
  align-items: flex-start;

  :deep(.el-form-item) {
    flex: 1;
  }
}

.permission-groups {
  display: grid;
  width: 100%;
  gap: 14px;
}

.permission-group {
  padding: 14px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  strong {
    display: block;
    margin-bottom: 10px;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

@media (max-width: 640px) {
  .page-head,
  .form-grid {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
