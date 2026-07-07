<script setup>
import { reactive } from 'vue'
import { applyMerchant } from '../../api/mock'

const categories = [
  { label: '家政保洁', value: 'cleaning' },
  { label: '维修清洗', value: 'repair' },
  { label: '摄影拍摄', value: 'photo' },
  { label: '兴趣课程', value: 'course' },
  { label: '美容护理', value: 'beauty' },
]

const form = reactive({
  providerName: '',
  contactName: '',
  phone: '',
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

async function submitApply() {
  const required = ['providerName', 'contactName', 'phone', 'licenseNo', 'address', 'desc']
  if (required.some((key) => !form[key].trim())) {
    uni.showToast({ title: '请完善入驻资料', icon: 'none' })
    return
  }
  await applyMerchant(form)
  uni.showModal({
    title: '提交成功',
    content: '入驻申请已提交，平台审核通过后即可使用商家版接单。',
    showCancel: false,
    success: () => uni.navigateBack(),
  })
}
</script>

<template>
  <view class="page">
    <view class="hero card">
      <view>
        <text class="eyebrow">商家入驻</text>
        <text class="title">成为平台服务商</text>
        <text class="muted">提交经营资料后，平台审核通过即可使用商家版管理服务、订单和评价。</text>
      </view>
      <uni-icons type="compose" size="34" color="#1f7a5c" />
    </view>

    <view class="form-card card">
      <view class="field">
        <text class="label">商家名称</text>
        <input v-model="form.providerName" placeholder="例如：绿萝家政服务中心" />
      </view>
      <view class="field">
        <text class="label">联系人</text>
        <input v-model="form.contactName" placeholder="请输入联系人姓名" />
      </view>
      <view class="field">
        <text class="label">联系电话</text>
        <input v-model="form.phone" type="number" placeholder="请输入手机号或客服电话" />
      </view>
      <view class="field">
        <text class="label">经营类目</text>
        <picker :range="categories" range-key="label" @change="pickCategory">
          <view class="picker-value">
            <text>{{ categoryLabel(form.businessCategory) }}</text>
            <uni-icons type="right" size="16" color="#9ca3af" />
          </view>
        </picker>
      </view>
      <view class="field">
        <text class="label">资质编号</text>
        <input v-model="form.licenseNo" placeholder="营业执照或从业资质编号" />
      </view>
      <view class="field">
        <text class="label">经营地址</text>
        <input v-model="form.address" placeholder="请输入门店或办公地址" />
      </view>
      <view class="field">
        <text class="label">服务介绍</text>
        <textarea v-model="form.desc" placeholder="说明服务范围、人员资质、交付保障等" />
      </view>
    </view>

    <button class="primary-button submit-button" @click="submitApply">提交入驻申请</button>
  </view>
</template>

<style scoped lang="scss">
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.eyebrow,
.title {
  display: block;
}

.eyebrow {
  color: #1f7a5c;
  font-size: 24rpx;
  font-weight: 800;
}

.title {
  margin: 8rpx 0;
  font-size: 38rpx;
  font-weight: 900;
}

.form-card {
  display: grid;
  gap: 22rpx;
}

.field {
  display: grid;
  gap: 10rpx;
}

.label {
  font-weight: 800;
}

input,
textarea,
.picker-value {
  width: 100%;
  box-sizing: border-box;
  padding: 18rpx;
  background: #f8fafc;
  border-radius: 14rpx;
}

textarea {
  min-height: 180rpx;
}

.picker-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.submit-button {
  margin-top: 24rpx;
}
</style>
