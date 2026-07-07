<script setup>
import { onMounted, ref } from 'vue'
import { Bell, Brush, Camera, Discount, House, Monitor, Setting } from '@element-plus/icons-vue'
import ServiceCard from '@/components/ServiceCard.vue'
import { getAnnouncements } from '@/api/operation'
import { getHotServices } from '@/api/service'

const hotServices = ref([])
const announcements = ref([])
const categories = [
  { name: '家政保洁', value: 'cleaning', icon: House },
  { name: '维修清洗', value: 'repair', icon: Setting },
  { name: '摄影拍摄', value: 'photo', icon: Camera },
  { name: '兴趣课程', value: 'course', icon: Monitor },
  { name: '美容护理', value: 'beauty', icon: Brush },
]

onMounted(async () => {
  const [hotResult, noticeResult] = await Promise.all([getHotServices(), getAnnouncements({ scene: 'home' })])
  hotServices.value = hotResult
  announcements.value = noticeResult
})
</script>

<template>
  <section class="hero">
    <div class="page-container hero-inner">
      <div class="hero-copy">
        <p class="eyebrow">本地生活服务预约</p>
        <h1>把保洁、维修、课程预约做成一个完整前端项目</h1>
        <p>
          覆盖页面开发、接口联调、登录鉴权、表单校验、后台管理、移动端适配和工程化流程。
        </p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="$router.push('/services')">立即预约</el-button>
          <el-button :icon="Discount" size="large" @click="$router.push('/coupons')">领取优惠券</el-button>
        </div>
      </div>
    </div>
  </section>

  <section v-if="announcements.length" class="page-container notice-section">
    <div class="notice-strip">
      <el-icon><Bell /></el-icon>
      <span v-for="item in announcements.slice(0, 2)" :key="item.id">{{ item.title }}</span>
    </div>
  </section>

  <section class="page-container section">
    <h2 class="section-title">服务分类</h2>
    <div class="category-grid">
      <router-link v-for="item in categories" :key="item.value" :to="`/services?category=${item.value}`" class="category-item">
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.name }}</span>
        <small>查看服务</small>
      </router-link>
    </div>
  </section>

  <section class="page-container section">
    <div class="section-head">
      <h2 class="section-title">热门服务</h2>
      <router-link to="/services">查看全部</router-link>
    </div>
    <div class="service-grid">
      <ServiceCard v-for="item in hotServices" :key="item.id" :service="item" />
    </div>
  </section>

  <section class="page-container section feature-band">
    <div>
      <strong>工程化练习点</strong>
      <p>Git 分支、Vite 环境变量、Axios 拦截器、Mock 接口、路由权限、ESLint/Prettier。</p>
    </div>
    <div>
      <strong>业务开发练习点</strong>
      <p>搜索筛选、分页、弹窗、表单校验、状态标签、图片上传、订单状态流转。</p>
    </div>
    <div>
      <strong>加分项练习点</strong>
      <p>移动端适配、路由懒加载、图片懒加载、ECharts 数据统计、基础性能优化。</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  color: #fff;
  background:
    linear-gradient(90deg, rgba(14, 58, 44, 0.92), rgba(31, 122, 92, 0.6)),
    url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80')
      center/cover;
}

.hero-inner {
  display: flex;
  align-items: center;
  min-height: 430px;
}

.hero-copy {
  max-width: 680px;

  h1 {
    margin: 8px 0 18px;
    font-size: 46px;
    line-height: 1.15;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.86);
    font-size: 18px;
    line-height: 1.7;
  }
}

.eyebrow {
  color: #bbf7d0 !important;
  font-weight: 700;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.section {
  padding: 34px 0;
}

.notice-section {
  padding-top: 18px;
}

.notice-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  color: #166534;
  background: #dcfce7;
  border-radius: 8px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  .el-icon {
    color: #1f7a5c;
    font-size: 28px;
  }

  span {
    font-size: 18px;
    font-weight: 700;
  }

  small {
    color: #1f7a5c;
  }
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.feature-band {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  > div {
    padding: 20px;
    background: #e9f7f1;
    border-radius: 8px;
  }

  p {
    margin: 10px 0 0;
    color: #4b5563;
    line-height: 1.6;
  }
}

@media (max-width: 960px) {
  .service-grid,
  .feature-band {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-inner {
    min-height: 390px;
  }

  .hero-copy h1 {
    font-size: 30px;
  }

  .hero-copy p {
    font-size: 15px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .category-grid,
  .service-grid,
  .feature-band {
    grid-template-columns: 1fr;
  }
}
</style>
