<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  ArrowRight,
  Bell,
  Brush,
  Camera,
  Check,
  Clock,
  Discount,
  House,
  Monitor,
  Setting,
  Star,
} from '@element-plus/icons-vue'
import ServiceCard from '@/components/ServiceCard.vue'
import { getAnnouncements } from '@/api/operation'
import { getHotServices } from '@/api/service'

const hotServices = ref([])
const announcements = ref([])
const activeScene = ref('cleaning')
const heroStyle = ref({ '--pointer-x': '58%', '--pointer-y': '34%' })
let revealObserver

const categories = [
  {
    name: '家政保洁',
    value: 'cleaning',
    icon: House,
    desc: '全屋保洁、开荒清洁、定期维护',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85',
    metric: '98%',
    metricLabel: '准时上门',
  },
  {
    name: '维修清洗',
    value: 'repair',
    icon: Setting,
    desc: '水电小修、空调清洗、家电养护',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=85',
    metric: '2h',
    metricLabel: '预约确认',
  },
  {
    name: '摄影拍摄',
    value: 'photo',
    icon: Camera,
    desc: '证件照、形象照、活动跟拍',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85',
    metric: '24h',
    metricLabel: '成片交付',
  },
  {
    name: '兴趣课程',
    value: 'course',
    icon: Monitor,
    desc: '少儿编程、艺术体验、成长课程',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85',
    metric: '1v1',
    metricLabel: '课前沟通',
  },
  {
    name: '美容护理',
    value: 'beauty',
    icon: Brush,
    desc: '美甲护理、到店体验、预约上门',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85',
    metric: '7d',
    metricLabel: '补修保障',
  },
]

const stats = [
  { value: '5+', label: '精选服务品类' },
  { value: '2600+', label: '累计服务预约' },
  { value: '4.8', label: '用户综合评分' },
  { value: '7d', label: '服务售后保障' },
]

const advantages = [
  {
    icon: Check,
    title: '服务标准透明',
    desc: '项目范围、服务价格、保障规则在预约前完整展示。',
  },
  {
    icon: Clock,
    title: '节点状态可追踪',
    desc: '预约、确认、完成、评价、售后都沉淀在订单流程里。',
  },
  {
    icon: Star,
    title: '评价反哺运营',
    desc: '真实反馈帮助用户决策，也帮助平台持续优化服务供给。',
  },
]

const steps = [
  { title: '选择服务', desc: '按场景浏览保洁、维修、摄影、课程与护理项目。' },
  { title: '确认时间', desc: '选择方便的上门时段，补充地址和服务要求。' },
  { title: '专员跟进', desc: '平台确认预约信息，服务人员按约定时间上门。' },
  { title: '售后保障', desc: '完成后可评价体验，遇到问题可继续申请售后。' },
]

const activeCategory = computed(() => categories.find((item) => item.value === activeScene.value) || categories[0])

function updateHeroPointer(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  heroStyle.value = {
    '--pointer-x': `${((event.clientX - rect.left) / rect.width) * 100}%`,
    '--pointer-y': `${((event.clientY - rect.top) / rect.height) * 100}%`,
  }
}

function bindRevealMotion() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.18 },
  )

  document.querySelectorAll('.motion-item').forEach((item) => revealObserver.observe(item))
}

onMounted(async () => {
  const [hotResult, noticeResult] = await Promise.allSettled([getHotServices(), getAnnouncements({ scene: 'home' })])
  hotServices.value = hotResult.status === 'fulfilled' ? hotResult.value : []
  announcements.value = noticeResult.status === 'fulfilled' ? noticeResult.value : []
  requestAnimationFrame(bindRevealMotion)
})

onUnmounted(() => {
  revealObserver?.disconnect()
})
</script>

<template>
  <section class="hero" :style="heroStyle" @pointermove="updateHeroPointer">
    <div class="hero-light" aria-hidden="true"></div>
    <div class="page-container hero-inner">
      <div class="hero-copy motion-item is-visible">
        <p class="eyebrow">惠生活服务预约平台</p>
        <h1>专业生活服务，准时预约到家。</h1>
        <p class="hero-desc">
          惠生活整合保洁、维修清洗、摄影拍摄、兴趣课程与美容护理服务，价格透明、流程清晰，让每一次上门服务都更省心。
        </p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="$router.push('/services')">
            立即预约
            <el-icon class="button-icon"><ArrowRight /></el-icon>
          </el-button>
          <el-button size="large" @click="$router.push('/services?category=cleaning')">探索服务</el-button>
        </div>
      </div>

      <div class="product-stage motion-item is-visible" aria-label="官网预约交互预览">
        <div class="device-shell">
          <div class="device-toolbar">
            <span></span>
            <span></span>
            <span></span>
            <strong>惠生活预约</strong>
          </div>
          <div class="device-screen">
            <img :src="activeCategory.image" :alt="activeCategory.name" />
            <div class="screen-overlay">
              <span>精选服务</span>
              <h2>{{ activeCategory.name }}</h2>
              <p>{{ activeCategory.desc }}</p>
            </div>
          </div>
          <div class="device-panel">
            <div>
              <span>{{ activeCategory.metricLabel }}</span>
              <strong>{{ activeCategory.metric }}</strong>
            </div>
            <el-button type="primary" @click="$router.push(`/services?category=${activeCategory.value}`)">
              预约
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section v-if="announcements.length" class="page-container notice-section motion-item">
    <div class="notice-strip">
      <el-icon><Bell /></el-icon>
      <span v-for="item in announcements.slice(0, 2)" :key="item.id">{{ item.title }}</span>
    </div>
  </section>

  <section class="page-container stats-section motion-item" aria-label="平台数据">
    <div v-for="item in stats" :key="item.label" class="stat-item">
      <strong>{{ item.value }}</strong>
      <span>{{ item.label }}</span>
    </div>
  </section>

  <section id="services" class="immersive-section">
    <div class="page-container section-grid">
      <div class="section-copy motion-item">
        <p class="section-kicker">Service Scenes</p>
        <h2>从家庭清洁到品质护理，按真实生活场景选择服务。</h2>
        <p>
          每个服务项目都展示价格、评分、预约量和服务保障。用户可以先了解内容，再进入详情页提交预约。
        </p>
        <router-link to="/services" class="text-link">进入全部服务</router-link>
      </div>

      <div class="showcase motion-item">
        <div class="showcase-visual">
          <img :src="activeCategory.image" :alt="activeCategory.name" />
          <div class="showcase-chip">
            <strong>{{ activeCategory.metric }}</strong>
            <span>{{ activeCategory.metricLabel }}</span>
          </div>
        </div>
        <div class="showcase-tabs" role="list" aria-label="服务分类">
          <button
            v-for="item in categories"
            :key="item.value"
            type="button"
            :class="{ active: activeScene === item.value }"
            @click="activeScene = item.value"
            @mouseenter="activeScene = item.value"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="service-band">
    <div class="page-container section">
      <div class="section-head motion-item">
        <div>
          <p class="section-kicker">Popular Services</p>
          <h2 class="section-title">热门预约</h2>
        </div>
        <router-link to="/services" class="text-link">查看更多</router-link>
      </div>
      <div class="service-grid motion-item">
        <ServiceCard v-for="item in hotServices" :key="item.id" :service="item" />
      </div>
    </div>
  </section>

  <section id="process" class="page-container section process-section">
    <div class="section-head motion-item">
      <div>
        <p class="section-kicker">Booking Flow</p>
        <h2 class="section-title">四步完成预约，服务进度清楚可查</h2>
      </div>
    </div>
    <div class="step-grid motion-item">
      <div v-for="(item, index) in steps" :key="item.title" class="step-item">
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </div>
    </div>
  </section>

  <section id="guarantee" class="guarantee-section">
    <div class="page-container guarantee-inner">
      <div class="guarantee-copy motion-item">
        <p class="section-kicker">Service Promise</p>
        <h2>看得清服务内容，也追得上每一步进度。</h2>
        <p>
          惠生活把服务项目、预约时间、上门地址、订单状态和售后反馈集中管理，减少反复沟通，让用户更放心。
        </p>
        <el-button type="primary" size="large" @click="$router.push('/services')">
          开始预约
          <el-icon class="button-icon"><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="advantage-list motion-item">
        <div v-for="item in advantages" :key="item.title" class="advantage-item">
          <el-icon><component :is="item.icon" /></el-icon>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="page-container cta-inner motion-item">
      <div>
        <p class="section-kicker">Ready To Book</p>
        <h2>选择需要的服务，预约一个更轻松的生活日程。</h2>
      </div>
      <div class="cta-actions">
        <el-button type="primary" size="large" @click="$router.push('/services')">立即预约</el-button>
        <el-button :icon="Discount" size="large" @click="$router.push('/coupons')">领取优惠</el-button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  min-height: 680px;
  color: #fff;
  background:
    radial-gradient(circle at 74% 38%, rgba(241, 245, 249, 0.92) 0, rgba(241, 245, 249, 0.58) 24%, transparent 48%),
    radial-gradient(circle at 18% 18%, rgba(20, 184, 166, 0.22), transparent 30%),
    linear-gradient(135deg, #05070c 0%, #111827 46%, #334155 72%, #f8fafc 100%);
}

.hero::before {
  position: absolute;
  inset: 0;
  content: '';
  background:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(90deg, #000 0%, transparent 72%);
}

.hero-light {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(20, 184, 166, 0.24), transparent 30%);
  mix-blend-mode: screen;
  transition: background 0.16s ease;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(390px, 0.78fr);
  gap: 68px;
  align-items: center;
  min-height: 680px;
  padding: 76px 0 64px;
}

.hero-copy {
  max-width: 700px;

  h1 {
    margin: 12px 0 20px;
    font-size: 64px;
    line-height: 1.05;
  }
}

.eyebrow,
.section-kicker {
  margin: 0;
  color: #14b8a6;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero-desc {
  max-width: 620px;
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 19px;
  line-height: 1.8;
}

.hero-actions,
.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.button-icon {
  margin-left: 6px;
}

.product-stage {
  perspective: 1400px;
}

.device-shell {
  overflow: hidden;
  color: #111827;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 34px 90px rgba(15, 23, 42, 0.24);
  backdrop-filter: blur(22px);
  transform: rotateY(-8deg) rotateX(5deg);
  transition: transform 0.26s ease;
}

.device-shell:hover {
  transform: rotateY(-2deg) rotateX(1deg) translateY(-6px);
}

.device-toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);

  span {
    width: 10px;
    height: 10px;
    background: #d1d5db;
    border-radius: 999px;
  }

  strong {
    margin-left: auto;
    color: #64748b;
    font-size: 12px;
  }
}

.device-screen {
  position: relative;
  height: 430px;
  background: #111827;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.04);
    transition: transform 0.5s ease;
  }
}

.device-shell:hover .device-screen img {
  transform: scale(1.08);
}

.screen-overlay {
  position: absolute;
  right: 18px;
  bottom: 18px;
  left: 18px;
  padding: 18px;
  color: #fff;
  background: rgba(5, 7, 12, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(16px);

  span {
    color: #99f6e4;
    font-size: 12px;
    font-weight: 800;
  }

  h2 {
    margin: 6px 0;
    font-size: 30px;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.74);
    line-height: 1.6;
  }
}

.device-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px;
  background: rgba(255, 255, 255, 0.92);

  span,
  strong {
    display: block;
  }

  span {
    color: #64748b;
    font-size: 13px;
    font-weight: 700;
  }

  strong {
    margin-top: 4px;
    color: #111827;
    font-size: 28px;
  }
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
  color: #0f766e;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 40px 0 20px;
}

.stat-item {
  min-height: 132px;
  padding: 24px;
  color: #fff;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    background: #0f172a;
  }

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 38px;
    line-height: 1;
  }

  span {
    margin-top: 12px;
    color: #cbd5e1;
    font-weight: 700;
  }
}

.immersive-section {
  padding: 92px 0;
  background: #f8fafc;
}

.section-grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.62fr) minmax(0, 1fr);
  gap: 64px;
  align-items: center;
}

.section-copy {
  h2 {
    margin: 10px 0 16px;
    color: #0f172a;
    font-size: 42px;
    line-height: 1.14;
  }

  p:not(.section-kicker) {
    margin: 0 0 22px;
    color: #64748b;
    font-size: 17px;
    line-height: 1.8;
  }
}

.text-link {
  color: #0f766e;
  font-weight: 800;
}

.showcase {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: 18px;
  align-items: stretch;
  min-height: 480px;
}

.showcase-visual {
  position: relative;
  overflow: hidden;
  height: 480px;
  min-height: 480px;
  background: #111827;
  border-radius: 8px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 0;
    object-fit: cover;
    transition:
      transform 0.48s ease,
      filter 0.48s ease;
  }

  &:hover img {
    filter: saturate(1.08) contrast(1.05);
    transform: scale(1.06);
  }
}

.showcase-chip {
  position: absolute;
  right: 18px;
  bottom: 18px;
  min-width: 150px;
  padding: 16px;
  color: #fff;
  background: rgba(15, 23, 42, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  backdrop-filter: blur(16px);

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 34px;
    line-height: 1;
  }

  span {
    margin-top: 8px;
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 700;
  }
}

.showcase-tabs {
  display: grid;
  gap: 10px;
  grid-template-rows: repeat(5, 1fr);
}

.showcase-tabs button {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  align-items: center;
  min-height: 0;
  padding: 14px;
  color: #334155;
  text-align: left;
  cursor: pointer;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition:
    color 0.18s ease,
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  .el-icon {
    color: #14b8a6;
    font-size: 22px;
  }

  span {
    font-weight: 800;
  }

  &.active,
  &:hover {
    color: #0f172a;
    transform: translateX(-4px);
    border-color: #14b8a6;
    box-shadow: 0 14px 30px rgba(20, 184, 166, 0.16);
  }
}

.section {
  padding: 72px 0;
}

.section-head {
  display: flex;
  gap: 18px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 22px;
}

.section-title {
  max-width: 740px;
  margin: 8px 0 0;
  color: #102a43;
  font-size: 34px;
  line-height: 1.25;
}

.service-band {
  background: #fff;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.process-section {
  background:
    linear-gradient(90deg, transparent 0, transparent calc(25% - 1px), #e5e7eb calc(25% - 1px), transparent 25%),
    linear-gradient(90deg, transparent 0, transparent calc(50% - 1px), #e5e7eb calc(50% - 1px), transparent 50%),
    linear-gradient(90deg, transparent 0, transparent calc(75% - 1px), #e5e7eb calc(75% - 1px), transparent 75%);
}

.step-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.step-item {
  min-height: 220px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  backdrop-filter: blur(14px);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-6px);
    border-color: #14b8a6;
  }

  span {
    color: #14b8a6;
    font-size: 28px;
    font-weight: 900;
  }

  h3 {
    margin: 34px 0 10px;
    color: #102a43;
    font-size: 20px;
  }

  p {
    margin: 0;
    color: #64748b;
    line-height: 1.7;
  }
}

.guarantee-section {
  padding: 96px 0;
  color: #fff;
  background:
    linear-gradient(135deg, rgba(5, 7, 12, 0.94), rgba(15, 23, 42, 0.84)),
    url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=85') center/cover;
}

.guarantee-inner {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 0.8fr);
  gap: 64px;
  align-items: center;
}

.guarantee-copy {
  h2 {
    max-width: 760px;
    margin: 10px 0 18px;
    font-size: 48px;
    line-height: 1.12;
  }

  p:not(.section-kicker) {
    max-width: 620px;
    margin: 0 0 26px;
    color: rgba(255, 255, 255, 0.76);
    font-size: 17px;
    line-height: 1.8;
  }
}

.advantage-list {
  display: grid;
  gap: 14px;
}

.advantage-item {
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 14px;
  align-items: start;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  backdrop-filter: blur(18px);
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateX(-4px);
    background: rgba(255, 255, 255, 0.16);
  }

  .el-icon {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    color: #5eead4;
    font-size: 24px;
    background: rgba(20, 184, 166, 0.16);
    border-radius: 8px;
  }

  h3 {
    margin: 0 0 8px;
    color: #fff;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.65;
  }
}

.cta-section {
  color: #111827;
  background: #f8fafc;
}

.cta-inner {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  padding: 68px 0;

  h2 {
    max-width: 760px;
    margin: 8px 0 0;
    font-size: 36px;
    line-height: 1.3;
  }
}

.motion-item {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.56s ease,
    transform 0.56s ease;
}

.motion-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .motion-item,
  .device-shell,
  .step-item,
  .advantage-item,
  .showcase-tabs button,
  .stat-item {
    transition: none;
  }
}

@media (max-width: 1080px) {
  .hero {
    background: #080b12;
  }

  .hero-inner,
  .section-grid,
  .guarantee-inner {
    grid-template-columns: 1fr;
  }

  .device-shell {
    transform: none;
  }

  .showcase {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .showcase-tabs {
    grid-template-columns: repeat(5, minmax(132px, 1fr));
    grid-template-rows: 76px;
    overflow-x: auto;
  }

  .service-grid,
  .step-grid,
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .hero {
    min-height: auto;
  }

  .hero-inner {
    gap: 32px;
    min-height: auto;
    padding: 48px 0;
  }

  .hero-copy h1 {
    font-size: 38px;
  }

  .hero-desc {
    font-size: 16px;
  }

  .device-screen,
  .showcase-visual,
  .showcase-visual img {
    min-height: 320px;
  }

  .device-screen,
  .showcase-visual {
    height: 320px;
  }

  .section,
  .immersive-section,
  .guarantee-section {
    padding: 42px 0;
  }

  .section-head,
  .hero-actions,
  .cta-actions,
  .cta-inner {
    align-items: stretch;
    flex-direction: column;
  }

  .section-copy h2,
  .section-title,
  .guarantee-copy h2,
  .cta-inner h2 {
    font-size: 28px;
  }

  .service-grid,
  .step-grid,
  .stats-section {
    grid-template-columns: 1fr;
  }
}
</style>
