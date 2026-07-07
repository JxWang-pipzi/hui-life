<script setup>
import { onMounted, ref } from 'vue'
import { getAnnouncements, getCategories, getCoupons, getHotServices, receiveCoupon } from '../../api/mock'

const categories = ref([])
const hotServices = ref([])
const coupons = ref([])
const notices = ref([])
const featureModules = [
  { title: '领券中心', desc: '先领券再下单', icon: 'wallet', color: '#e35d2f', url: '/pages/coupons/index' },
  { title: '公告消息', desc: '服务提醒', icon: 'notification', color: '#1f7a5c', url: '/pages/notices/index' },
  { title: '我的订单', desc: '查看进度', icon: 'calendar', color: '#2563eb', tab: '/pages/orders/index' },
  { title: '商家入驻', desc: '开通接单', icon: 'person', color: '#0f766e', url: '/pages/merchant/apply' },
  { title: '售后说明', desc: '处理规则', icon: 'help', color: '#7c3aed', url: '/pages/notices/index?scene=order' },
]

function goServices(category = '') {
  uni.switchTab({
    url: '/pages/services/index',
    success() {
      if (category) {
        uni.$emit('selectCategory', category)
      }
    },
  })
}

function goDetail(item) {
  uni.navigateTo({
    url: `/pages/services/detail?id=${item.id}`,
  })
}

function goModule(item) {
  if (item.tab) {
    uni.switchTab({ url: item.tab })
    return
  }
  uni.navigateTo({ url: item.url })
}

async function handleReceiveCoupon(item) {
  if (item.received) return
  await receiveCoupon(item.id)
  uni.showToast({ title: '领取成功' })
  coupons.value = await getCoupons()
}

onMounted(async () => {
  const token = uni.getStorageSync('token')
  const [categoryResult, hotResult, couponResult, noticeResult] = await Promise.all([
    getCategories(),
    getHotServices(),
    token ? getCoupons().catch(() => []) : Promise.resolve([]),
    getAnnouncements('home'),
  ])
  categories.value = categoryResult
  hotServices.value = hotResult
  coupons.value = couponResult
  notices.value = noticeResult
})
</script>

<template>
  <view class="page home-page">
    <view class="hero">
      <text class="eyebrow">本地生活服务</text>
      <text class="title">预约保洁、维修、课程，一部手机搞定</text>
      <text class="desc">精选高频上门服务，先看服务、再领优惠、最后预约下单。</text>
      <button class="primary-button hero-button" @click="goServices()">立即预约</button>
    </view>

    <view v-if="notices.length" class="notice-bar" @click="uni.navigateTo({ url: '/pages/notices/index' })">
      <uni-icons type="sound" size="18" color="#1f7a5c" />
      <swiper class="notice-swiper" vertical circular autoplay interval="2600">
        <swiper-item v-for="item in notices" :key="item.id">
          <text>{{ item.title }}</text>
        </swiper-item>
      </swiper>
      <uni-icons type="right" size="15" color="#9ca3af" />
    </view>

    <view class="section primary-section">
      <view class="section-head">
        <view>
          <text class="section-title">热门推荐</text>
          <text class="section-subtitle">优先展示高频预约服务，用户进来先看到能下单的内容</text>
        </view>
        <text class="link" @click="goServices()">全部</text>
      </view>
      <view class="service-list">
        <view v-for="item in hotServices" :key="item.id" class="service-card card" @click="goDetail(item)">
          <image :src="item.cover" mode="aspectFill" />
          <view class="service-info">
            <view class="service-title-row">
              <uni-icons type="star" size="16" color="#f59e0b" />
              <text class="service-title">{{ item.title }}</text>
            </view>
            <text class="muted service-desc">{{ item.desc }}</text>
            <view class="meta">
              <text class="price">¥{{ item.price }}</text>
              <text class="muted">评分 {{ item.rating }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section secondary-section">
      <view class="section-head">
        <text class="section-title">服务分类</text>
        <text class="link" @click="goServices()">全部服务</text>
      </view>
      <scroll-view scroll-x class="category-scroll">
        <view class="category-row">
          <view v-for="item in categories" :key="item.value" class="category-pill" @click="goServices(item.value)">
            <view class="category-icon">
              <uni-icons :type="item.icon" size="22" color="#1f7a5c" />
            </view>
            <text>{{ item.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="section secondary-section">
      <view class="section-head">
        <text class="section-title">常用功能</text>
      </view>
      <view class="module-grid">
        <view v-for="item in featureModules" :key="item.title" class="module-card" @click="goModule(item)">
          <view class="module-icon" :style="{ backgroundColor: `${item.color}18` }">
            <uni-icons :type="item.icon" size="24" :color="item.color" />
          </view>
          <view>
            <text class="module-title">{{ item.title }}</text>
            <text class="muted">{{ item.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section secondary-section">
      <view class="section-head">
        <text class="section-title">可领优惠券</text>
        <text class="link" @click="uni.navigateTo({ url: '/pages/coupons/index' })">更多</text>
      </view>
      <view class="coupon-list">
        <view v-for="item in coupons.slice(0, 3)" :key="item.id" class="coupon-card" @click="handleReceiveCoupon(item)">
          <view class="coupon-value">
            <text>¥{{ item.discountAmount }}</text>
            <small>满 {{ item.thresholdAmount }} 可用</small>
          </view>
          <view class="coupon-info">
            <text class="coupon-title">{{ item.title }}</text>
            <text class="muted">适用分类：{{ item.category || '全部服务' }}</text>
          </view>
          <view class="coupon-action" :class="{ disabled: item.received }">{{ item.received ? '已领' : '领取' }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.hero {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 44rpx 32rpx;
  color: #fff;
  background:
    linear-gradient(135deg, rgba(14, 58, 44, 0.95), rgba(31, 122, 92, 0.72)),
    url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80') center/cover;
  border-radius: 24rpx;
}

.eyebrow {
  color: #bbf7d0;
  font-size: 24rpx;
  font-weight: 700;
}

.title {
  font-size: 44rpx;
  font-weight: 800;
  line-height: 1.25;
}

.desc {
  color: rgba(255, 255, 255, 0.86);
  font-size: 28rpx;
  line-height: 1.6;
}

.hero-button {
  width: 240rpx;
  margin: 12rpx 0 0;
  font-size: 28rpx;
}

.section {
  margin-top: 34rpx;
}

.primary-section {
  margin-top: 28rpx;
}

.secondary-section {
  margin-top: 28rpx;

  .section-title {
    color: #374151;
    font-size: 30rpx;
  }
}

.notice-bar {
  display: flex;
  gap: 12rpx;
  align-items: center;
  height: 76rpx;
  padding: 0 22rpx;
  margin-top: 20rpx;
  background: #fff;
  border-radius: 16rpx;
}

.notice-swiper {
  flex: 1;
  height: 76rpx;
  line-height: 76rpx;
}

.section-head,
.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 34rpx;
  font-weight: 800;
}

.section-subtitle {
  display: block;
  max-width: 520rpx;
  margin-top: 6rpx;
  color: #6b7280;
  font-size: 24rpx;
  line-height: 1.4;
}

.link {
  color: #1f7a5c;
}

.category-scroll {
  margin-top: 20rpx;
  white-space: nowrap;
}

.category-row {
  display: flex;
  gap: 16rpx;
}

.category-pill {
  display: inline-flex;
  gap: 12rpx;
  align-items: center;
  min-width: 188rpx;
  padding: 16rpx 20rpx;
  background: #fff;
  border-radius: 999rpx;
}

.category-icon {
  display: grid;
  place-items: center;
  width: 52rpx;
  height: 52rpx;
  background: #e9f7f1;
  border-radius: 50%;
}

.service-list {
  display: grid;
  gap: 18rpx;
  margin-top: 20rpx;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
  margin-top: 20rpx;
}

.module-card {
  display: flex;
  gap: 16rpx;
  align-items: center;
  min-width: 0;
  padding: 22rpx;
  background: #fff;
  border-radius: 16rpx;
}

.module-icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
}

.module-title {
  display: block;
  margin-bottom: 6rpx;
  font-weight: 800;
}

.coupon-list {
  display: grid;
  gap: 16rpx;
  margin-top: 20rpx;
}

.coupon-card {
  display: grid;
  grid-template-columns: 150rpx minmax(0, 1fr) 82rpx;
  gap: 16rpx;
  align-items: center;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
}

.coupon-value {
  display: grid;
  place-items: center;
  min-height: 104rpx;
  color: #e35d2f;
  background: #fff1eb;
  border-radius: 14rpx;

  text {
    font-size: 40rpx;
    font-weight: 900;
  }

  small {
    font-size: 20rpx;
  }
}

.coupon-info {
  min-width: 0;
}

.coupon-title {
  display: block;
  margin-bottom: 8rpx;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coupon-action {
  color: #e35d2f;
  font-weight: 800;
  text-align: right;
}

.coupon-action.disabled {
  color: #9ca3af;
}

.service-card {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;

  image {
    width: 180rpx;
    height: 150rpx;
    border-radius: 12rpx;
  }
}

.service-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10rpx;
}

.service-title {
  font-size: 30rpx;
  font-weight: 700;
}

.service-desc {
  display: -webkit-box;
  overflow: hidden;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.service-title-row {
  display: flex;
  gap: 6rpx;
  align-items: center;
}

.price {
  color: #e35d2f;
  font-size: 34rpx;
  font-weight: 800;
}
</style>
