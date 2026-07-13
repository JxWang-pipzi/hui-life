<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import { login } from '../../api/mock'

const mode = ref('user')
const form = reactive({
  username: 'user',
  password: '123456',
})

function fillUser() {
  mode.value = 'user'
  form.username = 'user'
  form.password = '123456'
}

function fillMerchant() {
  mode.value = 'merchant'
  form.username = 'merchant_clean'
  form.password = '123456'
}

async function submitLogin() {
  if (!form.username.trim() || !form.password.trim()) {
    uni.showToast({ title: '请输入账号和密码', icon: 'none' })
    return
  }
  const result = await login(form)
  if (mode.value === 'merchant' && result.user.role !== 'merchant') {
    uni.showToast({ title: '当前账号不是商家账号', icon: 'none' })
    return
  }
  uni.setStorageSync('token', result.token)
  uni.setStorageSync('userInfo', result.user)
  uni.showToast({ title: '登录成功' })
  if (result.user.role === 'merchant') {
    uni.redirectTo({ url: '/pages/merchant/index' })
    return
  }
  uni.switchTab({ url: '/pages/profile/index' })
}

onLoad((options) => {
  if (options.role === 'merchant') fillMerchant()
  if (options.role === 'user') fillUser()
})
</script>

<template>
  <view class="page login-page">
    <view class="login-card card">
      <view class="brand-lockup"><text>惠生活</text><small>LIFE BOOKING</small></view>
      <text class="eyebrow">{{ mode === 'merchant' ? '商家登录' : '用户登录' }}</text>
      <text class="title">欢迎使用惠生活</text>
      <text class="muted">用户预约服务，商家接单经营。不同角色登录后进入对应功能。</text>

      <view class="mode-row">
        <view class="mode-pill" :class="{ active: mode === 'user' }" @click="fillUser">用户</view>
        <view class="mode-pill" :class="{ active: mode === 'merchant' }" @click="fillMerchant">
          商家
        </view>
      </view>

      <view class="field">
        <text>账号</text>
        <input v-model="form.username" placeholder="请输入账号" />
      </view>
      <view class="field">
        <text>密码</text>
        <input v-model="form.password" password placeholder="请输入密码" />
      </view>
      <view class="button-stack">
        <button class="primary-button auth-button" @click="submitLogin">登录</button>
        <button
          class="auth-button secondary"
          @click="uni.navigateTo({ url: '/pages/register/index' })"
        >
          没有账号，去注册
        </button>
      </view>
      <text class="hint">
        {{ mode === 'merchant' ? '商家示例：merchant_clean / 123456' : '用户示例：user / 123456' }}
      </text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  padding: 40rpx 32rpx;
  background:
    linear-gradient(145deg, rgba(5, 12, 23, 0.96), rgba(15, 118, 110, 0.7)),
    url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80')
      center/cover;
}

.login-card {
  display: grid;
  gap: 20rpx;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  padding: 36rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.72);
  border-radius: 30rpx;
  box-shadow: 0 30rpx 80rpx rgba(5, 15, 25, 0.3);
}

.brand-lockup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #e2e8f0;

  text {
    color: #0f172a;
    font-size: 32rpx;
    font-weight: 900;
  }
  small {
    color: #0f766e;
    font-size: 18rpx;
    font-weight: 900;
    letter-spacing: 2rpx;
  }
}

.eyebrow,
.title,
.hint {
  display: block;
}

.eyebrow {
  color: #1f7a5c;
  font-weight: 900;
}

.title {
  font-size: 44rpx;
  font-weight: 900;
}

.mode-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
  padding: 8rpx;
  background: #f3f4f6;
  border-radius: 999rpx;
}

.mode-pill {
  padding: 16rpx;
  color: #6b7280;
  text-align: center;
  border-radius: 999rpx;
}

.mode-pill.active {
  color: #fff;
  background: #0f766e;
}

.field {
  display: grid;
  gap: 10rpx;
  font-weight: 800;

  input {
    box-sizing: border-box;
    width: 100%;
    height: 78rpx;
    padding: 0 20rpx;
    font-weight: 400;
    line-height: 78rpx;
    background: #f8fafc;
    border-radius: 14rpx;
  }
}

.button-stack {
  display: grid;
  gap: 16rpx;
  margin-top: 8rpx;
}

.auth-button {
  width: 100%;
  height: 82rpx;
  padding: 0;
  margin: 0;
  line-height: 82rpx;
  border-radius: 999rpx;
}

.auth-button::after {
  border: 0;
}

.auth-button.secondary {
  color: #1f2937;
  background: #fff;
  border: 1rpx solid #1f2937;
}

.hint {
  color: #6b7280;
  text-align: center;
}
</style>
