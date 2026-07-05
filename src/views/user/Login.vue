<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)
const form = reactive({
  username: 'user',
  password: '123456',
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  await formRef.value.validate()
  loading.value = true
  try {
    await userStore.login(form)
    ElMessage.success('登录成功')
    router.push(route.query.redirect || '/')
  } finally {
    loading.value = false
  }
}

function fillAdmin() {
  form.username = 'admin'
  form.password = '123456'
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>惠生活登录</h1>
      <p>普通用户：user / 123456，管理员：admin / 123456</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password @keyup.enter="handleLogin" />
        </el-form-item>
        <el-button type="primary" :loading="loading" class="submit" @click="handleLogin">登录</el-button>
        <el-button class="submit" @click="fillAdmin">填入管理员账号</el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 20px;
  background:
    linear-gradient(135deg, rgba(31, 122, 92, 0.94), rgba(18, 53, 43, 0.84)),
    url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80')
      center/cover;
}

.login-card {
  width: min(420px, 100%);
  padding: 30px;
  background: #fff;
  border-radius: 8px;

  h1 {
    margin: 0 0 8px;
  }

  p {
    margin: 0 0 22px;
    color: #6b7280;
    line-height: 1.6;
  }
}

.submit {
  width: 100%;
  margin: 8px 0 0;
}
</style>
