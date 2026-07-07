<script setup>
import { reactive, ref } from 'vue'
import { register } from '../../api/mock'

const role = ref('user')
const merchantFieldsVisible = ref(false)
const categories = [
  { label: '家政保洁', value: 'cleaning' },
  { label: '维修清洗', value: 'repair' },
  { label: '摄影拍摄', value: 'photo' },
  { label: '兴趣课程', value: 'course' },
  { label: '美容护理', value: 'beauty' },
]
const form = reactive({
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

function pickCategory(event) {
  form.businessCategory = categories[Number(event.detail.value)].value
}

function categoryLabel(value) {
  const matched = categories.find((item) => item.value === value)
  return (matched && matched.label) || '请选择类目'
}

function setRole(value) {
  role.value = value
  merchantFieldsVisible.value = value === 'merchant'
}

async function submitRegister() {
  const required = ['username', 'password', 'name', 'phone']
  if (required.some((key) => !form[key].trim())) {
    uni.showToast({ title: '请完善注册信息', icon: 'none' })
    return
  }
  const result = await register({ ...form, role: role.value })
  uni.setStorageSync('token', result.token)
  uni.setStorageSync('userInfo', result.user)
  uni.showToast({ title: role.value === 'merchant' ? '注册成功，待审核' : '注册成功' })
  if (role.value === 'merchant') {
    uni.redirectTo({ url: '/pages/merchant/index' })
    return
  }
  uni.switchTab({ url: '/pages/profile/index' })
}
</script>

<template>
  <view class="page register-page">
    <view class="auth-card card">
      <text class="eyebrow">{{ role === 'merchant' ? '商家注册' : '用户注册' }}</text>
      <text class="title">创建惠生活账号</text>
      <text class="muted">用户可预约服务，商家注册后进入审核流程。</text>

      <view class="mode-row">
        <view class="mode-pill" :class="{ active: role === 'user' }" @click="setRole('user')">用户</view>
        <view class="mode-pill" :class="{ active: role === 'merchant' }" @click="setRole('merchant')">商家</view>
      </view>

      <view class="field">
        <text>账号</text>
        <input v-model="form.username" placeholder="请输入账号" />
      </view>
      <view class="field">
        <text>密码</text>
        <input v-model="form.password" password placeholder="请输入密码" />
      </view>
      <view class="field">
        <text>姓名</text>
        <input v-model="form.name" placeholder="请输入姓名" />
      </view>
      <view class="field">
        <text>手机号</text>
        <input v-model="form.phone" type="number" placeholder="请输入手机号" />
      </view>

      <view v-if="role === 'merchant'" class="merchant-extra">
        <view class="collapse-head" @click="merchantFieldsVisible = !merchantFieldsVisible">
          <view>
            <text class="collapse-title">商家资质信息</text>
            <text class="muted">可先注册，审核前再补充也可以</text>
          </view>
          <uni-icons :type="merchantFieldsVisible ? 'top' : 'bottom'" size="18" color="#6b7280" />
        </view>

        <view v-if="merchantFieldsVisible" class="merchant-fields">
          <view class="field">
            <text>商家名称</text>
            <input v-model="form.providerName" placeholder="默认使用姓名生成" />
          </view>
          <view class="field">
            <text>经营类目</text>
            <picker :range="categories" range-key="label" @change="pickCategory">
              <view class="picker-value">
                <text>{{ categoryLabel(form.businessCategory) }}</text>
                <uni-icons type="right" size="16" color="#9ca3af" />
              </view>
            </picker>
          </view>
          <view class="field">
            <text>资质编号</text>
            <input v-model="form.licenseNo" placeholder="可注册后补充" />
          </view>
          <view class="field">
            <text>经营地址</text>
            <input v-model="form.address" placeholder="可注册后补充" />
          </view>
        </view>
      </view>

      <view class="button-stack">
        <button class="primary-button auth-button" @click="submitRegister">注册</button>
        <button class="auth-button secondary" @click="uni.navigateTo({ url: '/pages/login/index' })">已有账号，去登录</button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  padding: 28rpx 28rpx 48rpx;
  overflow-x: hidden;
  background:
    linear-gradient(135deg, rgba(14, 58, 44, 0.9), rgba(31, 122, 92, 0.72)),
    url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80') center/cover;
}

.auth-card {
  display: grid;
  gap: 16rpx;
  box-sizing: border-box;
  width: 100%;
  padding: 24rpx;
  overflow: hidden;
}

.eyebrow,
.title {
  display: block;
}

.eyebrow {
  color: #1f7a5c;
  font-weight: 900;
}

.title {
  font-size: 38rpx;
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
  background: #1f7a5c;
}

.field {
  display: grid;
  gap: 8rpx;
  font-weight: 800;
}

input,
.picker-value {
  box-sizing: border-box;
  width: 100%;
  height: 72rpx;
  padding: 0 20rpx;
  font-weight: 400;
  line-height: 72rpx;
  background: #f8fafc;
  border-radius: 14rpx;
}

.merchant-extra {
  padding: 18rpx;
  background: #f8fafc;
  border-radius: 14rpx;
}

.collapse-head {
  display: flex;
  gap: 16rpx;
  align-items: center;
  justify-content: space-between;
}

.collapse-title {
  display: block;
  margin-bottom: 4rpx;
  font-weight: 900;
}

.merchant-fields {
  display: grid;
  gap: 14rpx;
  margin-top: 16rpx;
}

.picker-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.button-stack {
  display: grid;
  gap: 16rpx;
  margin-top: 8rpx;
}

.auth-button {
  width: 100%;
  height: 76rpx;
  padding: 0;
  margin: 0;
  line-height: 76rpx;
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
</style>
