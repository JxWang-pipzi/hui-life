<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getCoupons, receiveCoupon } from '../../api/mock'

const coupons = ref([])

async function fetchCoupons() {
  coupons.value = await getCoupons()
}

async function handleReceive(item) {
  if (item.received || item.stock <= 0) return
  await receiveCoupon(item.id)
  uni.showToast({ title: '领取成功' })
  fetchCoupons()
}

onShow(fetchCoupons)
</script>

<template>
  <view class="page coupon-page">
    <view class="summary-card">
      <view>
        <text class="summary-title">优惠券中心</text>
        <text class="summary-desc">先领券再预约，适合练习运营模块和真实接口联调。</text>
      </view>
      <uni-icons type="wallet-filled" size="40" color="#e35d2f" />
    </view>

    <view class="coupon-list">
      <view v-for="item in coupons" :key="item.id" class="coupon-card" @click="handleReceive(item)">
        <view class="coupon-left">
          <text>¥{{ item.discountAmount }}</text>
          <small>满 {{ item.thresholdAmount }} 可用</small>
        </view>
        <view class="coupon-main">
          <text class="coupon-title">{{ item.title }}</text>
          <text class="muted">适用分类：{{ item.category || '全部服务' }}</text>
          <text class="muted">有效期：{{ item.startAt }} 至 {{ item.endAt }}</text>
        </view>
        <view class="coupon-status" :class="{ disabled: item.received || item.stock <= 0 }">
          {{ item.received ? '已领取' : item.stock <= 0 ? '已领完' : '立即领取' }}
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.summary-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 34rpx;
  color: #fff;
  background:
    radial-gradient(circle at 90% 10%, rgba(94, 234, 212, 0.32), transparent 36%),
    linear-gradient(135deg, #07111f, #0f766e);
  border-radius: 30rpx;
  box-shadow: 0 20rpx 48rpx rgba(15, 23, 42, 0.16);
}

.summary-title {
  display: block;
  font-size: 42rpx;
  font-weight: 900;
}

.summary-desc {
  display: block;
  margin-top: 12rpx;
  color: rgba(255, 255, 255, 0.86);
  line-height: 1.6;
}

.coupon-list {
  display: grid;
  gap: 18rpx;
  margin-top: 24rpx;
}

.coupon-card {
  display: grid;
  grid-template-columns: 160rpx minmax(0, 1fr);
  gap: 18rpx;
  padding: 22rpx;
  background: #fff;
  border: 1rpx solid #e2e8f0;
  border-radius: 24rpx;
  box-shadow: 0 12rpx 36rpx rgba(15, 23, 42, 0.05);
}

.coupon-left {
  display: grid;
  place-items: center;
  color: #e35d2f;
  background: #fff1eb;
  border-radius: 16rpx;

  text {
    font-size: 44rpx;
    font-weight: 900;
  }

  small {
    font-size: 21rpx;
  }
}

.coupon-main {
  display: grid;
  gap: 8rpx;
  min-width: 0;
}

.coupon-title {
  font-size: 31rpx;
  font-weight: 800;
}

.coupon-status {
  grid-column: 1 / -1;
  padding-top: 14rpx;
  color: #e35d2f;
  font-weight: 800;
  text-align: right;
  border-top: 1rpx dashed #e5e7eb;
}

.coupon-status.disabled {
  color: #9ca3af;
}
</style>
