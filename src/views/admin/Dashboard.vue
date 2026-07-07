<script setup>
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { getAdminStats } from '@/api/user'

echarts.use([LineChart, PieChart, GridComponent, TooltipComponent, CanvasRenderer])

const stats = ref(null)
const trendRef = ref()
const categoryRef = ref()
let trendChart = null
let categoryChart = null

function renderCharts() {
  if (!stats.value) return

  trendChart = echarts.init(trendRef.value)
  trendChart.setOption({
    tooltip: {},
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: { type: 'value' },
    series: [{ name: '预约量', type: 'line', smooth: true, data: stats.value.trend, areaStyle: {} }],
    grid: { left: 40, right: 20, bottom: 30, top: 35 },
  })

  categoryChart = echarts.init(categoryRef.value)
  categoryChart.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        data: stats.value.categories,
      },
    ],
  })
}

function resizeCharts() {
  trendChart?.resize()
  categoryChart?.resize()
}

onMounted(async () => {
  stats.value = await getAdminStats()
  await nextTick()
  renderCharts()
  window.addEventListener('resize', resizeCharts)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  trendChart?.dispose()
  categoryChart?.dispose()
})
</script>

<template>
  <div>
    <h1 class="page-title">数据概览</h1>
    <div v-if="stats" class="stats-grid">
      <div class="stat-card">
        <span>服务数量</span>
        <strong>{{ stats.serviceCount }}</strong>
      </div>
      <div class="stat-card">
        <span>用户数量</span>
        <strong>{{ stats.userCount }}</strong>
      </div>
      <div class="stat-card">
        <span>订单数量</span>
        <strong>{{ stats.orderCount }}</strong>
      </div>
      <div class="stat-card">
        <span>待确认</span>
        <strong>{{ stats.pendingCount }}</strong>
      </div>
      <div class="stat-card">
        <span>用户评价</span>
        <strong>{{ stats.reviewCount }}</strong>
      </div>
      <div class="stat-card">
        <span>待处理售后</span>
        <strong>{{ stats.afterSalePendingCount }}</strong>
      </div>
      <div class="stat-card">
        <span>角色数量</span>
        <strong>{{ stats.roleCount }}</strong>
      </div>
      <div class="stat-card">
        <span>操作日志</span>
        <strong>{{ stats.logCount }}</strong>
      </div>
      <div class="stat-card">
        <span>公告数量</span>
        <strong>{{ stats.announcementCount }}</strong>
      </div>
      <div class="stat-card">
        <span>优惠券数量</span>
        <strong>{{ stats.couponCount }}</strong>
      </div>
    </div>

    <div class="chart-grid">
      <div class="panel">
        <h2 class="section-title">近 7 日预约趋势</h2>
        <div ref="trendRef" class="chart"></div>
      </div>
      <div class="panel">
        <h2 class="section-title">服务分类占比</h2>
        <div ref="categoryRef" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  span {
    color: #6b7280;
  }

  strong {
    display: block;
    margin-top: 10px;
    font-size: 30px;
  }
}

.chart-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
}

.chart {
  height: 320px;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .chart-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid,
  .chart-grid {
    grid-template-columns: 1fr;
  }
}
</style>
