<script setup>
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import MerchantTabbar from '../../components/MerchantTabbar.vue'
import { getMerchantOrders, getStatusText, updateMerchantOrderStatus } from '../../api/mock'

const loading = ref(true)
const activeStatus = ref('')
const orders = ref([])
const filters = [
  { label: '全部', value: '' },
  { label: '待确认', value: 'pending' },
  { label: '已确认', value: 'confirmed' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'canceled' },
]

const visibleOrders = computed(() =>
  activeStatus.value ? orders.value.filter((item) => item.status === activeStatus.value) : orders.value,
)

async function fetchOrders() {
  loading.value = true
  try {
    orders.value = await getMerchantOrders()
  } finally {
    loading.value = false
  }
}

function callCustomer(order) {
  uni.makePhoneCall({
    phoneNumber: order.phone,
    fail: () => uni.showToast({ title: '当前环境不支持拨号', icon: 'none' }),
  })
}

async function changeStatus(order, status) {
  await updateMerchantOrderStatus(order.id, status)
  uni.showToast({ title: '订单已更新' })
  fetchOrders()
}

onShow(fetchOrders)
</script>

<template>
  <view class="page merchant-page">
    <view class="page-head">
      <view>
        <text class="eyebrow">商家订单</text>
        <text class="page-title">接单与履约</text>
      </view>
      <text class="muted">{{ visibleOrders.length }} 单</text>
    </view>

    <scroll-view scroll-x class="filter-scroll">
      <view class="filter-row">
        <view
          v-for="item in filters"
          :key="item.value"
          class="filter-pill"
          :class="{ active: activeStatus === item.value }"
          @click="activeStatus = item.value"
        >
          {{ item.label }}
        </view>
      </view>
    </scroll-view>

    <view v-if="loading" class="card empty">加载订单中...</view>
    <view v-else-if="visibleOrders.length === 0" class="card empty">暂无订单</view>
    <view v-else class="list">
      <view v-for="item in visibleOrders" :key="item.id" class="order-card card">
        <view class="row">
          <text class="item-title">{{ item.serviceTitle }}</text>
          <text class="status" :class="item.status">{{ getStatusText(item.status) }}</text>
        </view>
        <view class="info-row">
          <text class="label">联系人</text>
          <text>{{ item.customerName }} {{ item.phone }}</text>
        </view>
        <view class="info-row">
          <text class="label">预约时间</text>
          <text>{{ item.appointmentTime }}</text>
        </view>
        <view class="info-row">
          <text class="label">服务地址</text>
          <text>{{ item.address }}</text>
        </view>
        <view class="button-row">
          <button plain size="mini" class="action-button" @click="callCustomer(item)">联系客户</button>
          <button
            v-if="item.status === 'pending'"
            size="mini"
            class="primary-button action-button"
            @click="changeStatus(item, 'confirmed')"
          >
            确认接单
          </button>
          <button
            v-if="item.status === 'confirmed'"
            size="mini"
            class="primary-button action-button"
            @click="changeStatus(item, 'completed')"
          >
            完成服务
          </button>
          <button
            v-if="['pending', 'confirmed'].includes(item.status)"
            plain
            size="mini"
            class="action-button"
            @click="changeStatus(item, 'canceled')"
          >
            取消
          </button>
        </view>
      </view>
    </view>

    <MerchantTabbar current="orders" />
  </view>
</template>

<style scoped lang="scss">
.merchant-page {
  padding-bottom: 150rpx;
}

.page-head,
.row,
.info-row,
.button-row {
  display: flex;
  gap: 16rpx;
  align-items: center;
  justify-content: space-between;
}

.eyebrow,
.page-title,
.item-title {
  display: block;
  font-weight: 900;
}

.eyebrow {
  color: #1f7a5c;
  font-size: 24rpx;
}

.page-title {
  margin-top: 6rpx;
  font-size: 38rpx;
}

.filter-scroll {
  margin: 24rpx 0;
  white-space: nowrap;
}

.filter-row {
  display: flex;
  gap: 16rpx;
}

.filter-pill {
  display: inline-flex;
  padding: 14rpx 24rpx;
  color: #4b5563;
  background: #fff;
  border-radius: 999rpx;
}

.filter-pill.active {
  color: #fff;
  background: #1f7a5c;
}

.list {
  display: grid;
  gap: 16rpx;
}

.order-card {
  display: grid;
  gap: 16rpx;
}

.item-title {
  font-size: 30rpx;
}

.status {
  flex-shrink: 0;
  padding: 6rpx 12rpx;
  color: #6b7280;
  font-size: 22rpx;
  background: #f3f4f6;
  border-radius: 999rpx;
}

.status.pending {
  color: #92400e;
  background: #fef3c7;
}

.status.confirmed {
  color: #1d4ed8;
  background: #dbeafe;
}

.status.completed {
  color: #166534;
  background: #dcfce7;
}

.label {
  flex-shrink: 0;
  color: #6b7280;
}

.info-row {
  align-items: flex-start;
  line-height: 1.5;
}

.button-row {
  justify-content: flex-end;
}

.action-button {
  min-width: 150rpx;
  height: 62rpx;
  margin: 0;
  border-radius: 999rpx;
}

.empty {
  color: #6b7280;
  text-align: center;
}
</style>
