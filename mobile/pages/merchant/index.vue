<script setup>
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import MerchantTabbar from '../../components/MerchantTabbar.vue'
import { getMerchantDashboard, getMerchantOrders, getMerchantProfile, getMerchantServices, getStatusText } from '../../api/mock'

const loading = ref(true)
const denied = ref(false)
const profile = ref(null)
const dashboard = ref(null)
const orders = ref([])
const services = ref([])

const pendingOrders = computed(() => orders.value.filter((item) => item.status === 'pending').slice(0, 3))
const enabledServices = computed(() => services.value.filter((item) => item.status === 'enabled').slice(0, 3))

async function loadDashboard() {
  loading.value = true
  denied.value = false
  try {
    profile.value = await getMerchantProfile()
    const [dashboardResult, orderResult, serviceResult] = await Promise.all([
      getMerchantDashboard(),
      getMerchantOrders(),
      getMerchantServices(),
    ])
    dashboard.value = dashboardResult
    orders.value = orderResult
    services.value = serviceResult
  } catch {
    denied.value = true
  } finally {
    loading.value = false
  }
}

function goMerchantLogin() {
  uni.navigateTo({ url: '/pages/login/index?role=merchant' })
}

function backToCustomer() {
  uni.switchTab({ url: '/pages/profile/index' })
}

function goOrders() {
  uni.redirectTo({ url: '/pages/merchant/orders' })
}

function goServices() {
  uni.redirectTo({ url: '/pages/merchant/services' })
}

onShow(loadDashboard)
</script>

<template>
  <view class="page merchant-page">
    <view v-if="loading" class="card empty">加载商家数据中...</view>

    <view v-else-if="denied" class="card denied-card">
      <uni-icons type="locked" size="34" color="#f59e0b" />
      <text class="denied-title">{{ profile && profile.status === 'pending' ? '商家资料待审核' : '当前账号还不是商家' }}</text>
      <text class="muted">
        {{ profile && profile.status === 'pending' ? '平台审核通过后即可使用商家版接单、维护服务和查看评价。' : '商家版需要入驻审核和商家权限。你可以提交入驻申请，或使用商家账号正式登录。' }}
      </text>
      <view class="button-row">
        <button plain class="action-button" @click="uni.navigateTo({ url: '/pages/merchant/apply' })">申请入驻</button>
        <button class="primary-button action-button" @click="goMerchantLogin">商家登录</button>
      </view>
    </view>

    <template v-else>
      <view class="merchant-hero card">
        <view>
          <text class="eyebrow">商家工作台</text>
          <text class="merchant-name">{{ (dashboard && dashboard.merchant && dashboard.merchant.providerName) || (profile && profile.providerName) }}</text>
          <text class="muted">{{ (dashboard && dashboard.merchant && dashboard.merchant.address) || (profile && profile.address) }}</text>
        </view>
        <button plain size="mini" @click="backToCustomer">用户版</button>
      </view>

      <view class="stats-grid">
        <view class="stat-card card">
          <text class="num">{{ dashboard.serviceCount }}</text>
          <text class="muted">在售服务</text>
        </view>
        <view class="stat-card card">
          <text class="num">{{ dashboard.orderCount }}</text>
          <text class="muted">累计订单</text>
        </view>
        <view class="stat-card card">
          <text class="num">{{ dashboard.pendingCount }}</text>
          <text class="muted">待确认</text>
        </view>
        <view class="stat-card card">
          <text class="num">{{ dashboard.rating || '-' }}</text>
          <text class="muted">综合评分</text>
        </view>
      </view>

      <view class="section">
        <view class="section-head">
          <text class="section-title">待处理订单</text>
          <text class="link" @click="goOrders">全部订单</text>
        </view>
        <view v-if="pendingOrders.length === 0" class="card empty">暂无待确认订单</view>
        <view v-else class="list">
          <view v-for="item in pendingOrders" :key="item.id" class="card order-card" @click="goOrders">
            <view class="row">
              <text class="item-title">{{ item.serviceTitle }}</text>
              <text class="status">{{ getStatusText(item.status) }}</text>
            </view>
            <text class="muted">{{ item.customerName }} ｜ {{ item.appointmentTime }}</text>
            <text class="address">{{ item.address }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-head">
          <text class="section-title">在售服务</text>
          <text class="link" @click="goServices">全部服务</text>
        </view>
        <view v-if="enabledServices.length === 0" class="card empty">暂无上架服务</view>
        <view v-else class="service-list">
          <view v-for="item in enabledServices" :key="item.id" class="service-card card" @click="goServices">
            <image :src="item.cover" mode="aspectFill" />
            <view class="service-body">
              <view class="row">
                <text class="item-title">{{ item.title }}</text>
                <text class="price">¥{{ item.price }}</text>
              </view>
              <text class="muted service-desc">{{ item.desc }}</text>
              <view class="row">
                <text class="muted">已约 {{ item.sales }}</text>
                <text class="score">{{ item.rating }} 分</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <MerchantTabbar current="dashboard" />
    </template>
  </view>
</template>

<style scoped lang="scss">
.merchant-page {
  padding-bottom: 150rpx;
}

.merchant-hero,
.row,
.section-head,
.button-row {
  display: flex;
  gap: 16rpx;
  align-items: center;
  justify-content: space-between;
}

.merchant-hero button,
.button-row button {
  margin: 0;
}

.eyebrow,
.merchant-name,
.item-title {
  display: block;
  font-weight: 900;
}

.eyebrow {
  color: #1f7a5c;
  font-size: 24rpx;
}

.merchant-name {
  margin: 8rpx 0;
  font-size: 38rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-top: 18rpx;
}

.stat-card {
  text-align: center;
}

.num {
  display: block;
  margin-bottom: 8rpx;
  color: #1f7a5c;
  font-size: 42rpx;
  font-weight: 900;
}

.section {
  margin-top: 28rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 900;
}

.link {
  color: #1f7a5c;
}

.list {
  display: grid;
  gap: 16rpx;
  margin-top: 16rpx;
}

.service-list {
  display: grid;
  gap: 16rpx;
  margin-top: 16rpx;
}

.service-card {
  display: flex;
  gap: 18rpx;
}

.service-card image {
  flex-shrink: 0;
  width: 160rpx;
  height: 132rpx;
  border-radius: 14rpx;
}

.service-body {
  display: grid;
  flex: 1;
  gap: 8rpx;
  min-width: 0;
}

.service-desc {
  display: -webkit-box;
  overflow: hidden;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.order-card {
  display: grid;
  gap: 12rpx;
}

.status {
  padding: 6rpx 12rpx;
  color: #92400e;
  font-size: 22rpx;
  background: #fef3c7;
  border-radius: 999rpx;
}

.address {
  color: #374151;
  line-height: 1.5;
}

.price,
.score {
  color: #e35d2f;
  font-weight: 900;
}

.score {
  color: #f59e0b;
}

.empty,
.denied-card {
  color: #6b7280;
  text-align: center;
}

.denied-card {
  display: grid;
  gap: 18rpx;
  justify-items: center;
  margin-top: 120rpx;
}

.denied-title {
  color: #1f2937;
  font-size: 36rpx;
  font-weight: 900;
}

.button-row {
  width: 100%;
  margin-top: 10rpx;
}

.action-button {
  flex: 1;
  height: 76rpx;
  border-radius: 999rpx;
}
</style>
