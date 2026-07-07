<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
  color: {
    type: String,
    default: '#1f7a5c',
  },
  bgColor: {
    type: String,
    default: '#e9f7f1',
  },
  size: {
    type: [Number, String],
    default: 58,
  },
  fontSize: {
    type: [Number, String],
    default: 26,
  },
  radius: {
    type: [Number, String],
    default: 16,
  },
})

const iconText = {
  home: '家',
  cleaning: '洁',
  repair: '修',
  photo: '摄',
  course: '课',
  beauty: '美',
  wallet: '券',
  notification: '告',
  calendar: '单',
  order: '单',
  person: '商',
  merchant: '商',
  compose: '入',
  help: '售',
  search: '搜',
  dashboard: '台',
  services: '服',
  list: '服',
  reviews: '评',
  star: '评',
  default: '惠',
}

function unit(value) {
  return typeof value === 'number' ? `${value}rpx` : value
}
</script>

<template>
  <view
    class="app-icon"
    :style="{
      width: unit(size),
      height: unit(size),
      color,
      backgroundColor: bgColor,
      borderRadius: unit(radius),
      fontSize: unit(fontSize),
    }"
  >
    <text>{{ iconText[type] || iconText.default }}</text>
  </view>
</template>

<style scoped lang="scss">
.app-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  line-height: 1;
}

.app-icon text {
  line-height: 1;
}
</style>
