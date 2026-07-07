<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getAnnouncements } from '../../api/mock'

const notices = ref([])
const scene = ref('')

async function fetchNotices() {
  notices.value = await getAnnouncements(scene.value)
}

onLoad((options) => {
  scene.value = options.scene || ''
  fetchNotices()
})
</script>

<template>
  <view class="page notice-page">
    <view class="notice-head">
      <view>
        <text class="title">公告消息</text>
        <text class="muted">服务时段、优惠活动、售后规则都在这里。</text>
      </view>
      <uni-icons type="notification-filled" size="38" color="#1f7a5c" />
    </view>

    <view v-if="notices.length === 0" class="empty-card">暂无公告</view>
    <view v-else class="notice-list">
      <view v-for="item in notices" :key="item.id" class="notice-card">
        <view class="notice-icon">
          <uni-icons type="sound" size="20" color="#1f7a5c" />
        </view>
        <view>
          <text class="notice-title">{{ item.title }}</text>
          <text class="notice-content">{{ item.content }}</text>
          <text class="muted">{{ item.createdAt }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.notice-head,
.notice-card {
  display: flex;
  gap: 18rpx;
  align-items: center;
  padding: 28rpx;
  background: #fff;
  border-radius: 18rpx;
}

.title {
  display: block;
  margin-bottom: 8rpx;
  font-size: 38rpx;
  font-weight: 900;
}

.notice-list {
  display: grid;
  gap: 18rpx;
  margin-top: 22rpx;
}

.notice-card {
  align-items: flex-start;
}

.notice-icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 58rpx;
  height: 58rpx;
  background: #e9f7f1;
  border-radius: 50%;
}

.notice-title {
  display: block;
  font-size: 31rpx;
  font-weight: 800;
}

.notice-content {
  display: block;
  margin: 10rpx 0;
  color: #4b5563;
  line-height: 1.6;
}

.empty-card {
  padding: 36rpx;
  margin-top: 22rpx;
  color: #6b7280;
  text-align: center;
  background: #fff;
  border-radius: 18rpx;
}
</style>
