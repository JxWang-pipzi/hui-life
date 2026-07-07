<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import StatusTag from '@/components/StatusTag.vue'
import { getRoles } from '@/api/rbac'
import { getUsers, updateUserRoles, updateUserStatus } from '@/api/user'

const loading = ref(false)
const roleDialogVisible = ref(false)
const currentUser = ref(null)
const selectedRoleIds = ref([])
const users = ref([])
const roles = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(8)

async function fetchUsers() {
  loading.value = true
  try {
    const result = await getUsers({ page: page.value, pageSize: pageSize.value })
    users.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

async function toggleStatus(row) {
  const nextStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  await updateUserStatus(row.id, nextStatus)
  ElMessage.success('用户状态已更新')
  fetchUsers()
}

function openRoleDialog(row) {
  currentUser.value = row
  selectedRoleIds.value = [...(row.roleIds || [])]
  roleDialogVisible.value = true
}

async function saveUserRoles() {
  await updateUserRoles(currentUser.value.id, selectedRoleIds.value)
  ElMessage.success('用户角色已更新')
  roleDialogVisible.value = false
  fetchUsers()
}

async function fetchRoles() {
  const result = await getRoles({ page: 1, pageSize: 50 })
  roles.value = result.list
}

onMounted(() => {
  fetchRoles()
  fetchUsers()
})
</script>

<template>
  <div>
    <h1 class="page-title">用户管理</h1>
    <div class="panel">
      <el-table v-loading="loading" :data="users">
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="username" label="账号" min-width="120" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column label="角色" min-width="180">
          <template #default="{ row }">
            <div class="role-tags">
              <el-tag v-for="item in row.roles" :key="item.id" size="small">{{ item.name }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button link type="primary" :disabled="row.role === 'admin'" @click="toggleStatus(row)">
              {{ row.status === 'enabled' ? '禁用' : '启用' }}
            </el-button>
            <el-button link type="primary" :disabled="row.id === 1" @click="openRoleDialog(row)">分配角色</el-button>
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
          @current-change="fetchUsers"
        />
      </div>
    </div>

    <el-dialog v-model="roleDialogVisible" title="分配角色" width="480px">
      <div v-if="currentUser" class="user-summary">
        <strong>{{ currentUser.name }}</strong>
        <span>{{ currentUser.username }} / {{ currentUser.phone }}</span>
      </div>
      <el-checkbox-group v-model="selectedRoleIds" class="role-checks">
        <el-checkbox v-for="item in roles" :key="item.id" :label="item.id" :value="item.id">
          {{ item.name }}
          <small>{{ item.desc }}</small>
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUserRoles">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.role-tags,
.role-checks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.role-checks {
  flex-direction: column;
  align-items: flex-start;
}

.role-checks small {
  display: block;
  margin-top: 4px;
  color: #6b7280;
}

.user-summary {
  display: grid;
  gap: 6px;
  padding: 12px;
  margin-bottom: 14px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
</style>
