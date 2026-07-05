<script setup>
const model = defineModel({
  type: String,
  default: '',
})

function handleMockUpload() {
  model.value =
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80'
}
</script>

<template>
  <div class="upload-box">
    <el-input v-model="model" placeholder="图片 URL，可手动粘贴" />
    <el-button @click="handleMockUpload">模拟上传</el-button>
  </div>
</template>

<style scoped lang="scss">
.upload-box {
  display: flex;
  gap: 10px;
}
</style>
