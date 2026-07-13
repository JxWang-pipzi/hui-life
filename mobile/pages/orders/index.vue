<script setup>
import { onShow } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import { cancelOrder, createOrderReview, getOrders, getStatusText } from '../../api/mock'

const orders = ref([])
const activeStatus = ref('')
const reviewVisible = ref(false)
const currentOrder = ref(null)
const reviewForm = reactive({
  rating: 5,
  tags: [],
  content: '',
})
const filters = [
  { label: '全部', value: '' },
  { label: '待确认', value: 'pending' },
  { label: '已确认', value: 'confirmed' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'canceled' },
]
const reviewTags = ['准时', '服务专业', '沟通顺畅', '价格透明']

async function fetchOrders() {
  orders.value = await getOrders(activeStatus.value)
}

function changeStatus(value) {
  activeStatus.value = value
  fetchOrders()
}

function contactService(order) {
  uni.showModal({
    title: order.providerName || '联系服务商',
    content: `服务商电话：${order.providerPhone || '400-800-0000'}\n可直接拨打沟通上门时间、地址变更和服务要求。`,
    confirmText: '拨打',
    cancelText: '关闭',
    success: (result) => {
      if (!result.confirm) return
      uni.makePhoneCall({
        phoneNumber: order.providerPhone || '4008000000',
        fail: () => {
          uni.showToast({ title: '当前环境不支持拨号', icon: 'none' })
        },
      })
    },
  })
}

function handleCancel(order) {
  uni.showModal({
    title: '取消预约',
    content: `确认取消「${order.serviceTitle}」吗？`,
    success: async (result) => {
      if (!result.confirm) return
      await cancelOrder(order.id)
      uni.showToast({ title: '已取消' })
      fetchOrders()
    },
  })
}

function openReview(order) {
  currentOrder.value = order
  reviewForm.rating = 5
  reviewForm.tags = []
  reviewForm.content = ''
  reviewVisible.value = true
}

function setRating(value) {
  reviewForm.rating = value
}

function toggleTag(tag) {
  if (reviewForm.tags.includes(tag)) {
    reviewForm.tags = reviewForm.tags.filter((item) => item !== tag)
    return
  }
  reviewForm.tags.push(tag)
}

async function submitReview() {
  if (!reviewForm.content.trim()) {
    uni.showToast({ title: '请填写评价内容', icon: 'none' })
    return
  }
  await createOrderReview(currentOrder.value.id, {
    rating: reviewForm.rating,
    tags: reviewForm.tags,
    content: reviewForm.content,
  })
  uni.showToast({ title: '评价已提交' })
  reviewVisible.value = false
  fetchOrders()
}

onShow(fetchOrders)
</script>

<template>
  <view class="page">
    <view class="orders-hero">
      <text>ORDER CENTER</text>
      <text>服务进度，一目了然</text>
      <view>
        <strong>{{ orders.length }}</strong><small>当前订单</small><strong>7天</strong><small>售后保障</small>
      </view>
    </view>
    <scroll-view scroll-x class="filter-scroll">
      <view class="filter-row">
        <view
          v-for="item in filters"
          :key="item.value"
          class="filter-pill"
          :class="{ active: activeStatus === item.value }"
          @click="changeStatus(item.value)"
        >
          {{ item.label }}
        </view>
      </view>
    </scroll-view>

    <view v-if="orders.length === 0" class="empty card">暂无订单</view>
    <view v-else class="order-list">
      <view v-for="item in orders" :key="item.id" class="order-card card">
        <view class="order-head">
          <view class="title-row">
            <uni-icons type="calendar" size="18" color="#1f7a5c" />
            <text class="title">{{ item.serviceTitle }}</text>
          </view>
          <text class="status" :class="item.status">{{ getStatusText(item.status) }}</text>
        </view>
        <view class="info-row">
          <view class="label-with-icon">
            <uni-icons type="calendar" size="15" color="#6b7280" />
            <text class="label">预约时间</text>
          </view>
          <text>{{ item.appointmentTime }}</text>
        </view>
        <view class="info-row">
          <view class="label-with-icon">
            <uni-icons type="location" size="15" color="#6b7280" />
            <text class="label">服务地址</text>
          </view>
          <text>{{ item.address }}</text>
        </view>
        <view class="provider-row">
          <view>
            <text class="provider-name">{{ item.providerName }}</text>
            <text class="provider-phone">{{ item.providerPhone }}</text>
          </view>
          <view v-if="item.reviewRating" class="mini-score">
            <uni-icons
              v-for="star in 5"
              :key="star"
              :type="star <= item.reviewRating ? 'star-filled' : 'star'"
              size="13"
              :color="star <= item.reviewRating ? '#f59e0b' : '#d1d5db'"
            />
            <text>{{ item.reviewRating }} 分</text>
          </view>
        </view>
        <view class="actions">
          <button plain size="mini" @click="contactService(item)">联系服务商</button>
          <button
            v-if="['pending', 'confirmed'].includes(item.status)"
            plain
            size="mini"
            @click="handleCancel(item)"
          >
            取消
          </button>
          <button
            v-if="item.status === 'completed' && item.reviewStatus !== 'done'"
            class="primary-button"
            size="mini"
            @click="openReview(item)"
          >
            去评价
          </button>
          <button v-else-if="item.reviewStatus === 'done'" plain disabled size="mini">
            已评价
          </button>
        </view>
      </view>
    </view>

    <view v-if="reviewVisible" class="review-mask">
      <view class="review-panel">
        <view class="review-head">
          <view>
            <text class="review-title">评价服务</text>
            <text class="muted">{{ currentOrder && currentOrder.serviceTitle }}</text>
          </view>
          <uni-icons type="closeempty" size="24" color="#6b7280" @click="reviewVisible = false" />
        </view>
        <view class="rating-row">
          <uni-icons
            v-for="star in 5"
            :key="star"
            :type="star <= reviewForm.rating ? 'star-filled' : 'star'"
            size="34"
            :color="star <= reviewForm.rating ? '#f59e0b' : '#d1d5db'"
            @click="setRating(star)"
          />
          <text>{{ reviewForm.rating }} 分</text>
        </view>
        <view class="tag-row">
          <text
            v-for="tag in reviewTags"
            :key="tag"
            class="review-tag"
            :class="{ active: reviewForm.tags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </text>
        </view>
        <textarea
          v-model="reviewForm.content"
          class="review-input"
          placeholder="说说这次服务体验，比如准时、专业、沟通是否顺畅"
        />
        <button class="primary-button submit-review" @click="submitReview">提交评价</button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.orders-hero {
  display: grid;
  gap: 8rpx;
  padding: 34rpx 30rpx;
  margin-bottom: 22rpx;
  color: #fff;
  background:
    radial-gradient(circle at 90% 12%, rgba(94, 234, 212, 0.28), transparent 34%),
    linear-gradient(135deg, #07111f, #0f766e);
  border-radius: 30rpx;
  box-shadow: 0 20rpx 48rpx rgba(15, 23, 42, 0.15);

  > text:first-child {
    color: #5eead4;
    font-size: 19rpx;
    font-weight: 900;
    letter-spacing: 2rpx;
  }
  > text:nth-child(2) {
    font-size: 40rpx;
    font-weight: 900;
  }
  > view {
    display: grid;
    grid-template-columns: auto 1fr auto 1fr;
    gap: 12rpx;
    align-items: center;
    margin-top: 18rpx;
    padding-top: 18rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.16);
  }
  strong {
    font-size: 28rpx;
  }
  small {
    color: rgba(255, 255, 255, 0.62);
    font-size: 21rpx;
  }
}

.order-list {
  display: grid;
  gap: 18rpx;
}

.filter-scroll {
  margin-bottom: 24rpx;
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
  background: #0f766e;
  box-shadow: 0 10rpx 24rpx rgba(15, 118, 110, 0.2);
}

.order-card {
  display: grid;
  gap: 18rpx;
  border-radius: 24rpx;
}

.order-head,
.info-row,
.title-row,
.label-with-icon,
.actions {
  display: flex;
  gap: 16rpx;
  align-items: center;
  justify-content: space-between;
}

.title-row,
.label-with-icon {
  justify-content: flex-start;
}

.title {
  font-size: 32rpx;
  font-weight: 800;
}

.status {
  padding: 8rpx 14rpx;
  color: #6b7280;
  font-size: 24rpx;
  background: #f3f4f6;
  border-radius: 999rpx;
}

.status.pending {
  color: #92400e;
  background: #fef3c7;
}

.status.completed {
  color: #166534;
  background: #dcfce7;
}

.status.canceled {
  color: #6b7280;
  background: #f3f4f6;
}

.label {
  flex-shrink: 0;
  color: #6b7280;
}

.info-row {
  align-items: flex-start;
  line-height: 1.5;
}

.provider-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 16rpx;
  background: #f8fafc;
  border-radius: 14rpx;
}

.provider-name,
.provider-phone {
  display: block;
}

.provider-name {
  font-weight: 800;
}

.provider-phone {
  margin-top: 4rpx;
  color: #6b7280;
  font-size: 24rpx;
}

.mini-score {
  display: flex;
  gap: 2rpx;
  align-items: center;
  color: #f59e0b;
  font-size: 22rpx;
  font-weight: 800;
}

.actions {
  justify-content: flex-end;

  button {
    margin: 0;
  }
}

.empty {
  color: #6b7280;
  text-align: center;
}

.review-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  background: rgba(15, 23, 42, 0.42);
}

.review-panel {
  width: 100%;
  padding: 28rpx 28rpx calc(28rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-radius: 28rpx 28rpx 0 0;
}

.review-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.review-title {
  display: block;
  margin-bottom: 6rpx;
  font-size: 34rpx;
  font-weight: 900;
}

.rating-row {
  display: flex;
  gap: 10rpx;
  align-items: center;
  margin-top: 28rpx;

  text {
    margin-left: 10rpx;
    color: #f59e0b;
    font-weight: 800;
  }
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 24rpx;
}

.review-tag {
  padding: 12rpx 22rpx;
  color: #4b5563;
  background: #f3f4f6;
  border-radius: 999rpx;
}

.review-tag.active {
  color: #166534;
  background: #dcfce7;
}

.review-input {
  width: 100%;
  min-height: 180rpx;
  padding: 18rpx;
  margin-top: 24rpx;
  background: #f8fafc;
  border-radius: 16rpx;
}

.submit-review {
  margin-top: 24rpx;
}
</style>
