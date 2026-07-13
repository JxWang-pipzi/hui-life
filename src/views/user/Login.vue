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
    const fallback = userStore.isMerchant
      ? '/merchant/dashboard'
      : userStore.isAdmin
        ? '/admin/dashboard'
        : '/'
    router.push(route.query.redirect || fallback)
  } finally {
    loading.value = false
  }
}

function fillAdmin() {
  form.username = 'admin'
  form.password = '123456'
}

function fillMerchant() {
  form.username = 'merchant_clean'
  form.password = '123456'
}
</script>

<template>
  <div class="login-page">
    <div class="login-story">
      <p>HUI LIFE PLATFORM</p>
      <h1>让每一次生活服务，都有清晰可靠的进度。</h1>
      <span>预约、确认、服务、评价和售后，一套账号完整管理。</span>
      <div class="story-stats">
        <strong>2600+</strong><span>累计服务预约</span><strong>4.8</strong><span>用户综合评分</span>
      </div>
    </div>
    <div class="login-card">
      <span class="brand-mark">惠生活 · LIFE BOOKING</span>
      <h2>欢迎回来</h2>
      <p>登录后继续管理你的服务预约与订单。</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <div class="button-stack">
          <el-button type="primary" :loading="loading" @click="handleLogin">登录</el-button>
          <el-button plain @click="fillAdmin">填入管理员账号</el-button>
          <el-button plain @click="fillMerchant">填入商家账号</el-button>
          <el-button text @click="$router.push('/register')">没有账号，去注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(420px, 0.7fr);
  gap: 80px;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 7vw;
  background:
    linear-gradient(135deg, rgba(31, 122, 92, 0.94), rgba(18, 53, 43, 0.84)),
    url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80')
      center/cover;
}

.login-story {
  max-width: 680px;
  color: #fff;

  p {
    margin: 0 0 14px;
    color: #5eead4;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.12em;
  }
  h1 {
    margin: 0;
    font-size: clamp(42px, 5vw, 70px);
    line-height: 1.08;
  }
  > span {
    display: block;
    max-width: 560px;
    margin-top: 24px;
    color: rgba(255, 255, 255, 0.76);
    font-size: 18px;
    line-height: 1.8;
  }
}

.story-stats {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  margin-top: 36px;
  padding-top: 26px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);

  strong {
    font-size: 28px;
  }
  span {
    color: rgba(255, 255, 255, 0.66);
  }
}

.login-card {
  width: min(420px, 100%);
  padding: 38px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 16px;
  box-shadow: 0 34px 90px rgba(5, 15, 25, 0.28);
  backdrop-filter: blur(22px);

  h2 {
    margin: 0 0 8px;
    font-size: 32px;
  }

  p {
    margin: 0 0 22px;
    color: #6b7280;
    line-height: 1.6;
  }
}

.brand-mark {
  display: block;
  margin-bottom: 22px;
  color: #0f766e;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.button-stack {
  display: grid;
  gap: 10px;
  margin-top: 8px;

  .el-button {
    width: 100%;
    height: 40px;
    margin: 0;
  }
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 32px 20px;
  }
  .login-story {
    display: none;
  }
  .login-card {
    margin: 0 auto;
  }
}
</style>
