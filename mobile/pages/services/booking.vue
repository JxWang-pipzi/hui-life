<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, reactive, ref } from 'vue'
import { createBooking, getAddresses, getServiceDetail } from '../../api/mock'

const service = ref(null)
const addresses = ref([])
const selectedAddressId = ref(null)
const form = reactive({
  packageName: '',
  price: '',
  date: '',
  time: '',
  remark: '',
})

const selectedAddress = computed(() => addresses.value.find((item) => item.id === selectedAddressId.value))
const fullAddress = computed(() => {
  const item = selectedAddress.value
  return item ? `${item.city}${item.district}${item.detail}` : ''
})

function selectAddress(id) {
  selectedAddressId.value = id
}

async function submitBooking() {
  if (!selectedAddress.value) {
    uni.showToast({ title: '请选择服务地址', icon: 'none' })
    return
  }
  if (!form.date || !form.time) {
    uni.showToast({ title: '请选择预约时间', icon: 'none' })
    return
  }

  await createBooking({
    serviceId: service.value.id,
    customerName: selectedAddress.value.contactName,
    phone: selectedAddress.value.phone,
    appointmentTime: `${form.date} ${form.time}`,
    address: fullAddress.value,
    remark: form.remark,
  })
  uni.showToast({ title: '预约已提交' })
  setTimeout(() => {
    uni.switchTab({ url: '/pages/orders/index' })
  }, 500)
}

onLoad(async (options) => {
  service.value = await getServiceDetail(options.id)
  addresses.value = await getAddresses()
  const defaultAddress = addresses.value.find((item) => item.isDefault)
  selectedAddressId.value = (defaultAddress && defaultAddress.id) || (addresses.value[0] && addresses.value[0].id)
  const firstPackage = service.value.packages[0]
  form.packageName = options.packageName ? decodeURIComponent(options.packageName) : (firstPackage && firstPackage.name)
  form.price = options.price || service.value.price
})
</script>

<template>
  <view v-if="service" class="page booking-page">
    <view class="card">
      <text class="section-title">预约服务</text>
      <view class="service-line">
        <view class="icon-title">
          <uni-icons type="calendar" size="20" color="#1f7a5c" />
          <text>{{ service.title }}</text>
        </view>
        <text class="price">¥{{ form.price }}</text>
      </view>
      <text class="muted">{{ form.packageName }}</text>
    </view>

    <view class="card">
      <text class="section-title">服务地址</text>
      <view class="address-list">
        <view
          v-for="item in addresses"
          :key="item.id"
          class="address-card"
          :class="{ active: selectedAddressId === item.id }"
          @click="selectAddress(item.id)"
        >
          <view>
            <view class="icon-title">
              <uni-icons type="location" size="18" color="#1f7a5c" />
              <text class="address-name">{{ item.contactName }} {{ item.phone }}</text>
            </view>
            <text class="muted">{{ item.city }}{{ item.district }}{{ item.detail }}</text>
          </view>
          <text v-if="item.isDefault" class="default-tag">默认</text>
        </view>
      </view>
    </view>

    <view class="card form-card">
      <text class="section-title">预约时间</text>
      <view class="picker-row">
        <picker mode="date" @change="form.date = $event.detail.value">
          <view class="picker-box">{{ form.date || '选择日期' }}</view>
        </picker>
        <picker mode="time" @change="form.time = $event.detail.value">
          <view class="picker-box">{{ form.time || '选择时间' }}</view>
        </picker>
      </view>
      <textarea v-model="form.remark" placeholder="备注服务要求，例如家中有老人、需自带鞋套" />
    </view>

    <button class="primary-button submit-button" @click="submitBooking">提交预约</button>
  </view>
</template>

<style scoped lang="scss">
.booking-page {
  display: grid;
  gap: 18rpx;
}

.section-title,
.address-name {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
}

.service-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin: 18rpx 0 8rpx;
}

.icon-title {
  display: flex;
  gap: 8rpx;
  align-items: center;
}

.price {
  color: #e35d2f;
  font-size: 36rpx;
  font-weight: 800;
}

.address-list {
  display: grid;
  gap: 14rpx;
  margin-top: 18rpx;
}

.address-card {
  display: flex;
  justify-content: space-between;
  gap: 14rpx;
  padding: 20rpx;
  background: #f8fafc;
  border: 2rpx solid transparent;
  border-radius: 14rpx;
}

.address-card.active {
  border-color: #1f7a5c;
}

.default-tag {
  align-self: flex-start;
  padding: 6rpx 12rpx;
  color: #166534;
  font-size: 22rpx;
  background: #dcfce7;
  border-radius: 999rpx;
}

.form-card {
  display: grid;
  gap: 18rpx;
}

.picker-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.picker-box,
textarea {
  padding: 20rpx;
  background: #f8fafc;
  border-radius: 14rpx;
}

textarea {
  width: 100%;
  min-height: 180rpx;
}

.submit-button {
  margin-top: 8rpx;
}
</style>
