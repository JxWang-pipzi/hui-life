<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)
const form = reactive({
  role: 'user',
  username: '',
  password: '',
  name: '',
  phone: '',
  providerName: '',
  businessCategory: 'cleaning',
  licenseNo: '',
  address: '',
  desc: '',
})

const categoryOptions = [
  { label: '家政保洁', value: 'cleaning' },
  { label: '维修清洗', value: 'repair' },
  { label: '摄影拍摄', value: 'photo' },
  { label: '兴趣课程', value: 'course' },
  { label: '美容护理', value: 'beauty' },
]

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
}

async function handleRegister() {
  await formRef.value.validate()
  loading.value = true
  try {
    await userStore.register(form)
    ElMessage.success(form.role === 'merchant' ? '注册成功，商家资料待审核' : '注册成功')
    router.push('/')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>创建账号</h1>
      <p>普通用户可直接预约服务；商家注册后需要平台审核，审核通过后进入商家版。</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="注册身份">
          <el-radio-group v-model="form.role" class="role-group">
            <el-radio-button label="user">普通用户</el-radio-button>
            <el-radio-button label="merchant">商家</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>

        <template v-if="form.role === 'merchant'">
          <el-form-item label="商家名称">
            <el-input v-model="form.providerName" placeholder="默认使用姓名生成" />
          </el-form-item>
          <el-form-item label="经营类目">
            <el-select v-model="form.businessCategory">
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="资质编号">
            <el-input v-model="form.licenseNo" placeholder="可注册后补充" />
          </el-form-item>
          <el-form-item label="经营地址">
            <el-input v-model="form.address" placeholder="可注册后补充" />
          </el-form-item>
        </template>

        <div class="button-stack">
          <el-button type="primary" :loading="loading" @click="handleRegister">注册</el-button>
          <el-button plain @click="$router.push('/login')">已有账号，去登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  box-sizing: border-box;
  padding: 28px;
  background:
    linear-gradient(135deg, rgba(31, 122, 92, 0.94), rgba(18, 53, 43, 0.84)),
    url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80')
      center/cover;
}

.auth-card {
  width: min(460px, 100%);
  max-height: calc(100vh - 56px);
  padding: 30px;
  overflow: auto;
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

.role-group,
:deep(.el-select) {
  width: 100%;
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
</style>
