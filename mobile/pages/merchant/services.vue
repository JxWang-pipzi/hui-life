<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import MerchantTabbar from '../../components/MerchantTabbar.vue'
import { getMerchantServices } from '../../api/mock'

const loading = ref(true)
const services = ref([])

async function fetchServices() {
  loading.value = true
  try {
    services.value = await getMerchantServices()
  } finally {
    loading.value = false
  }
}

onShow(fetchServices)
</script>

<template>
  <view class="page merchant-page">
    <view class="page-head">
      <view>
        <text class="eyebrow">商家服务</text>
        <text class="page-title">服务维护</text>
      </view>
      <text class="muted">{{ services.length }} 项</text>
    </view>

    <view class="tip-card card">
      <uni-icons type="info" size="20" color="#1f7a5c" />
      <text>移动端用于快速查看服务表现；新增和编辑服务可在 Web 商家后台完成。</text>
    </view>

    <view v-if="loading" class="card empty">加载服务中...</view>
    <view v-else-if="services.length === 0" class="card empty">暂无服务</view>
    <view v-else class="list">
      <view v-for="item in services" :key="item.id" class="service-card card">
        <image :src="item.cover" mode="aspectFill" />
        <view class="service-body">
          <view class="row">
            <text class="item-title">{{ item.title }}</text>
            <text class="status" :class="item.status">{{ item.status === 'enabled' ? '上架' : '下架' }}</text>
          </view>
          <text class="desc">{{ item.desc }}</text>
          <view class="meta">
            <text class="price">¥{{ item.price }} 起</text>
            <text class="muted">已约 {{ item.sales }}</text>
          </view>
          <view class="stars">
            <uni-icons
              v-for="star in 5"
              :key="star"
              :type="star <= Math.round(item.rating) ? 'star-filled' : 'star'"
              size="14"
              :color="star <= Math.round(item.rating) ? '#f59e0b' : '#d1d5db'"
            />
            <text>{{ item.rating }} 分</text>
          </view>
        </view>
      </view>
    </view>

    <MerchantTabbar current="services" />
  </view>
</template>

<style scoped lang="scss">
.merchant-page {
  padding-bottom: 150rpx;
}

.page-head,
.tip-card,
.row,
.meta,
.stars {
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

.tip-card {
  justify-content: flex-start;
  margin: 24rpx 0;
  color: #4b5563;
  line-height: 1.5;
}

.list {
  display: grid;
  gap: 16rpx;
}

.service-card {
  display: flex;
  gap: 18rpx;
}

.service-card image {
  flex-shrink: 0;
  width: 170rpx;
  height: 150rpx;
  border-radius: 14rpx;
}

.service-body {
  display: grid;
  flex: 1;
  gap: 10rpx;
  min-width: 0;
}

.item-title {
  font-size: 30rpx;
}

.desc {
  display: -webkit-box;
  overflow: hidden;
  color: #6b7280;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.status {
  flex-shrink: 0;
  padding: 6rpx 12rpx;
  color: #166534;
  font-size: 22rpx;
  background: #dcfce7;
  border-radius: 999rpx;
}

.status.disabled {
  color: #6b7280;
  background: #f3f4f6;
}

.price {
  color: #e35d2f;
  font-size: 30rpx;
  font-weight: 900;
}

.stars {
  justify-content: flex-start;
  gap: 4rpx;
  color: #f59e0b;
  font-size: 22rpx;
  font-weight: 800;
}

.empty {
  color: #6b7280;
  text-align: center;
}
</style>
