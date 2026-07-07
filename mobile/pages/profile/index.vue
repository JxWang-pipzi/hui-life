<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import { getProfile } from '../../api/mock'

const userInfo = ref(null)
const menus = [
  { title: '优惠券中心', desc: '领取可用优惠券', icon: 'wallet', url: '/pages/coupons/index' },
  { title: '公告消息', desc: '查看服务提醒和活动', icon: 'notification', url: '/pages/notices/index' },
  { title: '服务预约', desc: '快速查找附近服务', icon: 'search', tab: '/pages/services/index' },
  { title: '我的订单', desc: '查看订单和售后进度', icon: 'calendar', tab: '/pages/orders/index' },
  { title: '商家版工作台', desc: '接单、服务和评价管理', icon: 'compose', url: '/pages/merchant/index' },
  { title: '商家入驻', desc: '提交资料成为服务商', icon: 'person', url: '/pages/merchant/apply' },
  { title: '售后规则', desc: '复查、返工、退款协商说明', icon: 'help', url: '/pages/notices/index?scene=order' },
]

async function fetchProfile() {
  const token = uni.getStorageSync('token')
  if (!token) {
    userInfo.value = null
    return
  }
  try {
    userInfo.value = await getProfile()
    uni.setStorageSync('userInfo', userInfo.value)
  } catch {
    userInfo.value = null
  }
}

function openMenu(item) {
  if (item.tab) {
    uni.switchTab({ url: item.tab })
    return
  }
  uni.navigateTo({ url: item.url })
}

function goLogin(role = 'user') {
  uni.navigateTo({ url: `/pages/login/index?role=${role}` })
}

function logout() {
  uni.removeStorageSync('token')
  uni.removeStorageSync('userInfo')
  userInfo.value = null
  uni.showToast({ title: '已退出' })
}

onShow(fetchProfile)
</script>

<template>
  <view class="page">
    <view v-if="!userInfo" class="login-card card">
      <view>
        <text class="name">暂未登录</text>
        <text class="muted">登录后查看订单、优惠券和商家工作台</text>
      </view>
      <view class="login-actions">
        <button class="login-button primary" @click="goLogin('user')">用户登录</button>
        <button class="login-button secondary" @click="goLogin('merchant')">商家登录</button>
      </view>
    </view>

    <view v-else class="profile-card card">
      <view class="avatar">惠</view>
      <view>
        <view class="profile-title">
          <text class="name">{{ userInfo.name }}</text>
          <uni-icons type="person" size="18" color="#1f7a5c" />
        </view>
        <text class="muted">{{ userInfo.phone }} ｜ {{ userInfo.roles && userInfo.roles.map((item) => item.name).join('、') }}</text>
      </view>
      <button plain size="mini" @click="logout">退出</button>
    </view>

    <view v-if="userInfo" class="stats card">
      <view>
        <text class="num">2</text>
        <text class="muted">订单</text>
      </view>
      <view>
        <text class="num">1</text>
        <text class="muted">评价</text>
      </view>
      <view>
        <text class="num">1</text>
        <text class="muted">售后</text>
      </view>
      <view>
        <text class="num">2</text>
        <text class="muted">优惠券</text>
      </view>
    </view>

    <view class="menu card">
      <view v-for="item in menus" :key="item.title" class="menu-item" @click="openMenu(item)">
        <AppIcon :type="item.icon" :size="58" :font-size="24" />
        <view>
          <text class="menu-title">{{ item.title }}</text>
          <text class="muted">{{ item.desc }}</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.profile-card,
.login-card {
  display: flex;
  gap: 22rpx;
  align-items: center;
  justify-content: space-between;
}

.profile-title {
  display: flex;
  gap: 8rpx;
  align-items: center;
}

.login-actions {
  display: grid;
  gap: 10rpx;
  width: 180rpx;

  button {
    margin: 0;
  }
}

.login-button {
  width: 100%;
  height: 58rpx;
  padding: 0;
  font-size: 24rpx;
  line-height: 58rpx;
  border-radius: 999rpx;
}

.login-button::after {
  border: 0;
}

.login-button.primary {
  color: #fff;
  background: #1f7a5c;
}

.login-button.secondary {
  color: #1f7a5c;
  background: #e9f7f1;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104rpx;
  height: 104rpx;
  color: #fff;
  font-size: 42rpx;
  font-weight: 800;
  background: #1f7a5c;
  border-radius: 50%;
}

.name,
.num,
.menu-title {
  display: block;
  font-weight: 800;
}

.name {
  margin-bottom: 8rpx;
  font-size: 34rpx;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-top: 18rpx;
  text-align: center;
}

.num {
  margin-bottom: 6rpx;
  color: #1f7a5c;
  font-size: 40rpx;
}

.menu {
  display: grid;
  gap: 2rpx;
  margin-top: 18rpx;
}

.menu-item {
  display: flex;
  gap: 16rpx;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 0;
  border-bottom: 1rpx solid #e5e7eb;
}

.menu-item > view:nth-child(2) {
  flex: 1;
}

.menu-item:last-child {
  border-bottom: 0;
}

.menu-title {
  margin-bottom: 8rpx;
  font-size: 30rpx;
}

.menu-arrow {
  color: #9ca3af;
  font-size: 44rpx;
}
</style>
