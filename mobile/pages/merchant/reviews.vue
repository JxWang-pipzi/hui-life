<script setup>
import { onShow } from '@dcloudio/uni-app'
import { computed, reactive, ref } from 'vue'
import MerchantTabbar from '../../components/MerchantTabbar.vue'
import { getMerchantReviews, replyMerchantReview } from '../../api/mock'

const loading = ref(true)
const reviews = ref([])
const replyVisible = ref(false)
const currentReview = ref(null)
const replyForm = reactive({
  content: '',
})

const averageRating = computed(() => {
  if (reviews.value.length === 0) return '-'
  const total = reviews.value.reduce((sum, item) => sum + Number(item.rating || 0), 0)
  return (total / reviews.value.length).toFixed(1)
})

async function fetchReviews() {
  loading.value = true
  try {
    reviews.value = await getMerchantReviews()
  } finally {
    loading.value = false
  }
}

function openReply(item) {
  currentReview.value = item
  replyForm.content = item.merchantReply || ''
  replyVisible.value = true
}

async function submitReply() {
  if (!replyForm.content.trim()) {
    uni.showToast({ title: '请填写回复内容', icon: 'none' })
    return
  }
  await replyMerchantReview(currentReview.value.id, replyForm.content)
  uni.showToast({ title: '回复成功' })
  replyVisible.value = false
  fetchReviews()
}

onShow(fetchReviews)
</script>

<template>
  <view class="page merchant-page">
    <view class="page-head">
      <view>
        <text class="eyebrow">商家评价</text>
        <text class="page-title">服务反馈</text>
      </view>
      <text class="muted">{{ reviews.length }} 条</text>
    </view>

    <view class="summary-card card">
      <text class="num">{{ averageRating }}</text>
      <view>
        <text class="summary-title">综合评分</text>
        <text class="muted">来自当前商家全部服务评价</text>
      </view>
    </view>

    <view v-if="loading" class="card empty">加载评价中...</view>
    <view v-else-if="reviews.length === 0" class="card empty">暂无评价</view>
    <view v-else class="list">
      <view v-for="item in reviews" :key="item.id" class="review-card card">
        <view class="row">
          <view>
            <text class="item-title">{{ item.userName }}</text>
            <text class="muted">{{ item.serviceTitle }}</text>
          </view>
          <text class="score">{{ item.rating }} 分</text>
        </view>
        <view class="stars">
          <uni-icons
            v-for="star in 5"
            :key="star"
            :type="star <= item.rating ? 'star-filled' : 'star'"
            size="15"
            :color="star <= item.rating ? '#f59e0b' : '#d1d5db'"
          />
        </view>
        <view v-if="item.tags && item.tags.length" class="tag-row">
          <text v-for="tag in item.tags" :key="tag" class="review-tag">{{ tag }}</text>
        </view>
        <text class="content">{{ item.content }}</text>
        <view v-if="item.merchantReply" class="reply-box">
          <text class="reply-title">商家回复</text>
          <text class="reply-content">{{ item.merchantReply }}</text>
          <text class="time">{{ item.repliedAt }}</text>
        </view>
        <button v-else plain size="mini" class="reply-button" @click="openReply(item)">回复评价</button>
        <text class="time">{{ item.createdAt }}</text>
      </view>
    </view>

    <view v-if="replyVisible" class="reply-mask">
      <view class="reply-panel">
        <view class="reply-head">
          <view>
            <text class="reply-panel-title">回复评价</text>
            <text class="muted">{{ currentReview && currentReview.serviceTitle }} ｜ {{ currentReview && currentReview.userName }}</text>
          </view>
          <uni-icons type="closeempty" size="24" color="#6b7280" @click="replyVisible = false" />
        </view>
        <textarea v-model="replyForm.content" class="reply-input" placeholder="感谢反馈、说明处理结果或补充服务承诺" />
        <button class="primary-button submit-button" @click="submitReply">提交回复</button>
      </view>
    </view>

    <MerchantTabbar current="reviews" />
  </view>
</template>

<style scoped lang="scss">
.merchant-page {
  padding-bottom: 150rpx;
}

.page-head,
.summary-card,
.row,
.stars {
  display: flex;
  gap: 16rpx;
  align-items: center;
  justify-content: space-between;
}

.eyebrow,
.page-title,
.item-title,
.summary-title {
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

.summary-card {
  justify-content: flex-start;
  margin: 24rpx 0;
}

.num {
  display: grid;
  place-items: center;
  width: 108rpx;
  height: 108rpx;
  color: #fff;
  font-size: 40rpx;
  font-weight: 900;
  background: #1f7a5c;
  border-radius: 50%;
}

.list {
  display: grid;
  gap: 16rpx;
}

.review-card {
  display: grid;
  gap: 14rpx;
}

.item-title {
  margin-bottom: 6rpx;
  font-size: 30rpx;
}

.score {
  color: #f59e0b;
  font-weight: 900;
}

.stars {
  justify-content: flex-start;
  gap: 4rpx;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.review-tag {
  padding: 6rpx 12rpx;
  color: #166534;
  font-size: 22rpx;
  background: #dcfce7;
  border-radius: 999rpx;
}

.content {
  color: #374151;
  line-height: 1.6;
}

.time {
  color: #9ca3af;
  font-size: 22rpx;
}

.reply-box {
  display: grid;
  gap: 8rpx;
  padding: 16rpx;
  background: #f8fafc;
  border-radius: 14rpx;
}

.reply-title {
  color: #1f7a5c;
  font-weight: 900;
}

.reply-content {
  color: #374151;
  line-height: 1.6;
}

.reply-button {
  width: 168rpx;
  height: 62rpx;
  margin: 0;
  border-radius: 999rpx;
}

.reply-mask {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: flex-end;
  background: rgba(15, 23, 42, 0.42);
}

.reply-panel {
  width: 100%;
  padding: 28rpx 28rpx calc(28rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-radius: 28rpx 28rpx 0 0;
}

.reply-head {
  display: flex;
  gap: 16rpx;
  align-items: center;
  justify-content: space-between;
}

.reply-panel-title {
  display: block;
  margin-bottom: 6rpx;
  font-size: 34rpx;
  font-weight: 900;
}

.reply-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 190rpx;
  padding: 18rpx;
  margin-top: 24rpx;
  background: #f8fafc;
  border-radius: 16rpx;
}

.submit-button {
  margin-top: 24rpx;
}

.empty {
  color: #6b7280;
  text-align: center;
}
</style>
