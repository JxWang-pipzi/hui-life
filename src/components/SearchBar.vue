<script setup>
defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
})

const model = defineModel({
  type: Object,
  required: true,
})

defineEmits(['search', 'reset'])
</script>

<template>
  <div class="search-bar">
    <el-input v-model="model.keyword" clearable placeholder="搜索服务名称或说明" @keyup.enter="$emit('search')" />
    <el-select v-model="model.category" clearable placeholder="服务分类">
      <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-select v-model="model.sort" clearable placeholder="排序">
      <el-option label="价格从低到高" value="priceAsc" />
      <el-option label="销量从高到低" value="salesDesc" />
    </el-select>
    <el-button type="primary" @click="$emit('search')">查询</el-button>
    <el-button @click="$emit('reset')">重置</el-button>
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 160px 160px auto auto;
  gap: 12px;
  margin-bottom: 18px;
}

@media (max-width: 860px) {
  .search-bar {
    grid-template-columns: 1fr;
  }
}
</style>
