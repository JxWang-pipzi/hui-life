<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getServiceDetail, getServiceReviews } from '../../api/mock'

const service = ref(null)
const reviews = ref([])

function roundedRating(value) {
  return Math.round(Number(value || 0))
}

function contactProvider() {
  uni.showModal({
    title: service.value.providerName || '联系服务商',
    content: `服务商电话：${service.value.providerPhone || '400-800-0000'}\n可先确认服务范围、上门时间和额外需求。`,
    confirmText: '拨打',
    cancelText: '关闭',
    success: (result) => {
      if (!result.confirm) return
      uni.makePhoneCall({
        phoneNumber: service.value.providerPhone || '4008000000',
        fail: () => {
          uni.showToast({ title: '当前环境不支持拨号', icon: 'none' })
        },
      })
    },
  })
}

function goBooking(packageItem = null) {
  const query = [`id=${service.value.id}`]
  if (packageItem) {
    query.push(`packageName=${encodeURIComponent(packageItem.name)}`)
    query.push(`price=${packageItem.price}`)
  }
  uni.navigateTo({
    url: `/pages/services/booking?${query.join('&')}`,
  })
}

onLoad(async (options) => {
  service.value = await getServiceDetail(options.id)
  reviews.value = await getServiceReviews(options.id)
})
</script>

<template>
  <view v-if="service" class="detail-page">
    <image class="cover" :src="service.cover" mode="aspectFill" />
    <view class="content">
      <view class="card service-card">
        <view class="title-row">
          <view class="icon-title">
            <uni-icons type="star" size="22" color="#f59e0b" />
            <text class="title">{{ service.title }}</text>
          </view>
          <text class="tag">{{ service.categoryName }}</text>
        </view>
        <text class="desc">{{ service.desc }}</text>
        <view class="rating-summary">
          <view class="stars">
            <uni-icons
              v-for="star in 5"
              :key="star"
              :type="star <= roundedRating(service.rating) ? 'star-filled' : 'star'"
              size="16"
              :color="star <= roundedRating(service.rating) ? '#f59e0b' : '#d1d5db'"
            />
            <text class="score-text">{{ service.rating }} 分</text>
          </view>
          <text class="muted">已约 {{ service.sales }} 次</text>
        </view>
        <view class="provider-card">
          <view>
            <text class="provider-name">{{ service.providerName }}</text>
            <text class="provider-phone">{{ service.providerPhone }}</text>
          </view>
          <button plain size="mini" @click="contactProvider">联系</button>
        </view>
        <view class="meta">
          <text class="price">¥{{ service.price }} 起</text>
        </view>
      </view>

      <view class="card">
        <text class="section-title">服务保障</text>
        <view class="guarantees">
          <view v-for="item in service.guarantee" :key="item" class="guarantee-item">
            <uni-icons type="checkmarkempty" size="16" color="#166534" />
            <text>{{ item }}</text>
          </view>
        </view>
      </view>

      <view class="card">
        <text class="section-title">套餐选择</text>
        <view class="package-list">
          <view v-for="item in service.packages" :key="item.name" class="package-card" @click="goBooking(item)">
            <view>
              <text class="package-name">{{ item.name }}</text>
              <text class="muted">{{ item.duration }}</text>
            </view>
            <text class="package-price">¥{{ item.price }}</text>
          </view>
        </view>
      </view>

      <view class="card">
        <text class="section-title">用户评价</text>
        <view v-if="reviews.length === 0" class="empty">暂无评价</view>
        <view v-else>
          <view v-for="item in reviews" :key="item.id" class="review">
            <view class="review-head">
              <text class="package-name">{{ item.userName }}</text>
              <view class="stars">
                <uni-icons
                  v-for="star in 5"
                  :key="star"
                  :type="star <= item.rating ? 'star-filled' : 'star'"
                  size="14"
                  :color="star <= item.rating ? '#f59e0b' : '#d1d5db'"
                />
                <text class="score">{{ item.rating }} 分</text>
              </view>
            </view>
            <view v-if="item.tags && item.tags.length" class="review-tags">
              <text v-for="tag in item.tags" :key="tag" class="review-tag">{{ tag }}</text>
            </view>
            <text class="desc">{{ item.content }}</text>
            <text class="review-time">{{ item.createdAt }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-bar">
      <view>
        <text class="muted">到手价</text>
        <text class="price">¥{{ service.price }} 起</text>
      </view>
      <button plain class="contact-button" @click="contactProvider">联系服务商</button>
      <button class="primary-button" @click="goBooking()">立即预约</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.detail-page {
  min-height: 100vh;
  padding-bottom: 140rpx;
  background: #f5f7fb;
}

.cover {
  width: 100%;
  height: 430rpx;
}

.content {
  display: grid;
  gap: 18rpx;
  padding: 24rpx;
  margin-top: -42rpx;
}

.service-card {
  position: relative;
}

.title-row,
.icon-title,
.meta,
.rating-summary,
.stars,
.provider-card,
.package-card,
.review-head,
.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.icon-title {
  justify-content: flex-start;
}

.rating-summary {
  margin-top: 16rpx;
}

.stars {
  justify-content: flex-start;
  gap: 4rpx;
}

.score-text,
.score {
  margin-left: 6rpx;
  color: #f59e0b;
  font-weight: 800;
}

.provider-card {
  padding: 18rpx;
  margin-top: 18rpx;
  background: #f8fafc;
  border-radius: 14rpx;

  button {
    margin: 0;
  }
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

.title {
  font-size: 40rpx;
  font-weight: 800;
}

.tag,
.guarantee-item {
  padding: 8rpx 14rpx;
  color: #166534;
  font-size: 24rpx;
  background: #dcfce7;
  border-radius: 999rpx;
}

.guarantee-item {
  display: flex;
  gap: 6rpx;
  align-items: center;
}

.desc {
  display: block;
  margin-top: 14rpx;
  color: #4b5563;
  line-height: 1.7;
}

.price,
.package-price {
  color: #e35d2f;
  font-size: 36rpx;
  font-weight: 800;
}

.section-title,
.package-name {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
}

.guarantees {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 18rpx;
}

.package-list {
  display: grid;
  gap: 14rpx;
  margin-top: 18rpx;
}

.package-card {
  padding: 20rpx;
  background: #f8fafc;
  border-radius: 14rpx;
}

.review {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #e5e7eb;
}

.review:last-child {
  border-bottom: 0;
}

.empty {
  margin-top: 18rpx;
  color: #6b7280;
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 14rpx;
}

.review-tag {
  padding: 6rpx 12rpx;
  color: #166534;
  font-size: 22rpx;
  background: #dcfce7;
  border-radius: 999rpx;
}

.review-time {
  display: block;
  margin-top: 10rpx;
  color: #9ca3af;
  font-size: 22rpx;
}

.bottom-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -8rpx 24rpx rgba(15, 23, 42, 0.08);

  button {
    width: 220rpx;
    margin: 0;
  }
}

.contact-button {
  color: #1f7a5c;
}
</style>
