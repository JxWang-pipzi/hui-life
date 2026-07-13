<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import { getServices } from '@/api/service'

const route = useRoute()
const loading = ref(false)
const services = ref([])
const total = ref(0)
const query = reactive({
  keyword: '',
  category: route.query.category || '',
  sort: '',
  page: 1,
  pageSize: 8,
})

const categories = [
  { label: '家政保洁', value: 'cleaning' },
  { label: '维修清洗', value: 'repair' },
  { label: '摄影拍摄', value: 'photo' },
  { label: '兴趣课程', value: 'course' },
  { label: '美容护理', value: 'beauty' },
]

async function fetchServices() {
  loading.value = true
  try {
    const result = await getServices(query)
    services.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  query.page = 1
  fetchServices()
}

function handleReset() {
  query.keyword = ''
  query.category = ''
  query.sort = ''
  query.page = 1
  fetchServices()
}

onMounted(fetchServices)
</script>

<template>
  <section class="list-hero">
    <div class="page-container list-hero-inner">
      <div>
        <p>Service Directory</p>
        <h1>选择专业服务，安排更从容的生活。</h1>
        <span>价格、评分与预约量清晰展示，找到合适服务后即可在线预约。</span>
      </div>
      <div class="hero-metric"><strong>5+</strong><span>精选服务品类</span></div>
    </div>
  </section>

  <div class="page-container list-page">
    <div class="filter-panel">
      <div class="filter-head">
        <strong>筛选服务</strong><span>共 {{ total }} 项结果</span>
      </div>
      <SearchBar
        v-model="query"
        :categories="categories"
        @search="handleSearch"
        @reset="handleReset"
      />
    </div>

    <el-skeleton v-if="loading" :rows="6" animated />
    <el-empty v-else-if="services.length === 0" description="暂无服务" />
    <div v-else class="service-grid">
      <ServiceCard v-for="item in services" :key="item.id" :service="item" />
    </div>

    <div class="pagination">
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.pageSize"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="fetchServices"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-page {
  padding: 34px 0 72px;
}

.list-hero {
  color: #fff;
  background:
    linear-gradient(105deg, rgba(5, 7, 12, 0.96), rgba(15, 118, 110, 0.72)),
    url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=85')
      center/cover;
}

.list-hero-inner {
  display: flex;
  gap: 32px;
  align-items: flex-end;
  justify-content: space-between;
  min-height: 330px;
  padding: 70px 0 54px;

  p {
    margin: 0 0 10px;
    color: #5eead4;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
  }
  h1 {
    max-width: 720px;
    margin: 0;
    font-size: 48px;
    line-height: 1.12;
  }
  > div > span {
    display: block;
    max-width: 650px;
    margin-top: 18px;
    color: rgba(255, 255, 255, 0.74);
    line-height: 1.7;
  }
}

.hero-metric {
  min-width: 170px;
  padding: 22px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(16px);

  strong,
  span {
    display: block;
  }
  strong {
    font-size: 38px;
  }
  span {
    margin-top: 6px;
    color: #ccfbf1;
  }
}

.filter-panel {
  padding: 22px;
  margin-bottom: 28px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.06);
}

.filter-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  strong {
    color: #0f172a;
    font-size: 18px;
  }
  span {
    color: #64748b;
  }
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 960px) {
  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .list-hero-inner {
    min-height: 280px;
    padding: 48px 0 36px;
  }
  .list-hero-inner h1 {
    font-size: 34px;
  }
  .hero-metric {
    display: none;
  }
  .filter-panel {
    padding: 16px;
  }
  .service-grid {
    grid-template-columns: 1fr;
  }
}
</style>
