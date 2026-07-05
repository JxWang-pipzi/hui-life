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
  <div class="page-container list-page">
    <h1 class="page-title">服务预约</h1>
    <SearchBar v-model="query" :categories="categories" @search="handleSearch" @reset="handleReset" />

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
  padding: 28px 0 44px;
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
  .service-grid {
    grid-template-columns: 1fr;
  }
}
</style>
