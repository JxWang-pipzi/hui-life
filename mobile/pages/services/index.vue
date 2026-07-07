<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import { getCategories, getServices } from '../../api/mock'

const categories = ref([])
const services = ref([])
const query = reactive({
  keyword: '',
  category: '',
})

async function fetchServices() {
  services.value = await getServices(query)
}

function selectCategory(value) {
  query.category = query.category === value ? '' : value
  fetchServices()
}

function submitSearch() {
  fetchServices()
}

function bookService(item) {
  uni.navigateTo({
    url: `/pages/services/detail?id=${item.id}`,
  })
}

function handleCategoryEvent(value) {
  query.category = value
  fetchServices()
}

onMounted(async () => {
  categories.value = await getCategories()
  await fetchServices()
  uni.$on('selectCategory', handleCategoryEvent)
})

onBeforeUnmount(() => {
  uni.$off('selectCategory', handleCategoryEvent)
})
</script>

<template>
  <view class="page">
    <view class="search-card card">
      <input v-model="query.keyword" placeholder="搜索保洁、维修、课程" confirm-type="search" @confirm="submitSearch" />
      <button class="primary-button" @click="submitSearch">搜索</button>
    </view>

    <scroll-view scroll-x class="category-scroll">
      <view class="category-row">
        <view
          v-for="item in categories"
          :key="item.value"
          class="category-pill"
          :class="{ active: query.category === item.value }"
          @click="selectCategory(item.value)"
        >
          <AppIcon
            :type="item.value"
            :size="36"
            :font-size="18"
            radius="50%"
            :color="query.category === item.value ? '#fff' : '#1f7a5c'"
            :bg-color="query.category === item.value ? 'rgba(255,255,255,0.18)' : '#e9f7f1'"
          />
          {{ item.label }}
        </view>
      </view>
    </scroll-view>

    <view v-if="services.length === 0" class="empty card">暂无匹配服务</view>
    <view v-else class="service-list">
      <view v-for="item in services" :key="item.id" class="service-card card">
        <image :src="item.cover" mode="aspectFill" />
        <view class="service-body">
          <view class="service-head">
            <view class="service-title-row">
              <uni-icons type="star" size="16" color="#f59e0b" />
              <text class="service-title">{{ item.title }}</text>
            </view>
            <text class="tag">{{ item.categoryName }}</text>
          </view>
          <text class="muted desc">{{ item.desc }}</text>
          <view class="meta">
            <view>
              <text class="price">¥{{ item.price }}</text>
              <text class="muted"> 已约 {{ item.sales }}</text>
            </view>
            <button class="primary-button mini-button" @click="bookService(item)">详情</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.search-card {
  display: flex;
  gap: 16rpx;
  align-items: center;

  input {
    flex: 1;
    height: 72rpx;
    padding: 0 20rpx;
    background: #f5f7fb;
    border-radius: 999rpx;
  }

  button {
    width: 148rpx;
    margin: 0;
    font-size: 28rpx;
  }
}

.category-scroll {
  margin: 24rpx 0;
  white-space: nowrap;
}

.category-row {
  display: flex;
  gap: 16rpx;
}

.category-pill {
  display: inline-flex;
  gap: 6rpx;
  align-items: center;
  padding: 14rpx 24rpx;
  color: #4b5563;
  background: #fff;
  border-radius: 999rpx;
}

.category-pill.active {
  color: #fff;
  background: #1f7a5c;
}

.service-list {
  display: grid;
  gap: 18rpx;
}

.service-card {
  display: flex;
  gap: 20rpx;

  image {
    width: 190rpx;
    height: 180rpx;
    border-radius: 14rpx;
  }
}

.service-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12rpx;
}

.service-head,
.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.service-title {
  font-size: 30rpx;
  font-weight: 800;
}

.service-title-row {
  display: flex;
  gap: 6rpx;
  align-items: center;
}

.tag {
  flex-shrink: 0;
  padding: 6rpx 12rpx;
  color: #166534;
  font-size: 22rpx;
  background: #dcfce7;
  border-radius: 999rpx;
}

.desc {
  line-height: 1.5;
}

.price {
  color: #e35d2f;
  font-size: 34rpx;
  font-weight: 800;
}

.mini-button {
  width: 132rpx;
  margin: 0;
  font-size: 26rpx;
}

.empty {
  color: #6b7280;
  text-align: center;
}
</style>
