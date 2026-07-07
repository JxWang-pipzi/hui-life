<script setup>
const props = defineProps({
  current: {
    type: String,
    required: true,
  },
})

const tabs = [
  { key: 'dashboard', text: '工作台', icon: 'home', url: '/pages/merchant/index' },
  { key: 'orders', text: '订单', icon: 'calendar', url: '/pages/merchant/orders' },
  { key: 'services', text: '服务', icon: 'list', url: '/pages/merchant/services' },
  { key: 'reviews', text: '评价', icon: 'star', url: '/pages/merchant/reviews' },
]

function switchTab(item) {
  if (item.key === props.current) return
  uni.redirectTo({ url: item.url })
}
</script>

<template>
  <view class="merchant-tabbar">
    <view
      v-for="item in tabs"
      :key="item.key"
      class="tab-item"
      :class="{ active: current === item.key }"
      @click="switchTab(item)"
    >
      <uni-icons :type="item.icon" size="21" :color="current === item.key ? '#1f7a5c' : '#6b7280'" />
      <text>{{ item.text }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.merchant-tabbar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 10rpx 12rpx calc(10rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -8rpx 24rpx rgba(15, 23, 42, 0.08);
}

.tab-item {
  display: grid;
  gap: 4rpx;
  justify-items: center;
  color: #6b7280;
  font-size: 22rpx;
}

.tab-item.active {
  color: #1f7a5c;
  font-weight: 900;
}
</style>
