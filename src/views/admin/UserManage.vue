<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import StatusTag from '@/components/StatusTag.vue'
import { getUsers, updateUserStatus } from '@/api/user'

const loading = ref(false)
const users = ref([])
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

fetchUsers()
</script>

<template>
  <div>
    <h1 class="page-title">用户管理</h1>
    <div class="panel">
      <el-table v-loading="loading" :data="users">
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="username" label="账号" min-width="120" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            {{ row.role === 'admin' ? '管理员' : '普通用户' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" :disabled="row.role === 'admin'" @click="toggleStatus(row)">
              {{ row.status === 'enabled' ? '禁用' : '启用' }}
            </el-button>
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
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}
</style>
