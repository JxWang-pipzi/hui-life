<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getMerchantReviews, replyMerchantReview } from '@/api/merchant'

const loading = ref(false)
const replyVisible = ref(false)
const currentReview = ref(null)
const replyText = ref('')
const reviews = ref([])

async function fetchList() {
  loading.value = true
  try {
    reviews.value = await getMerchantReviews()
  } finally {
    loading.value = false
  }
}

function openReply(row) {
  currentReview.value = row
  replyText.value = row.merchantReply || ''
  replyVisible.value = true
}

async function submitReply() {
  if (!replyText.value.trim()) {
    ElMessage.warning('请填写回复内容')
    return
  }
  await replyMerchantReview(currentReview.value.id, replyText.value)
  ElMessage.success('回复已提交')
  replyVisible.value = false
  fetchList()
}

fetchList()
</script>

<template>
  <div>
    <h1 class="page-title">评价反馈</h1>
    <div class="panel">
      <el-table v-loading="loading" :data="reviews">
        <el-table-column prop="serviceTitle" label="服务" min-width="150" />
        <el-table-column prop="userName" label="用户" width="110" />
        <el-table-column label="评分" width="180">
          <template #default="{ row }">
            <el-rate :model-value="row.rating" disabled />
          </template>
        </el-table-column>
        <el-table-column label="标签" width="220">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" class="tag" type="success">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容" min-width="260" />
        <el-table-column label="商家回复" min-width="240">
          <template #default="{ row }">
            <span v-if="row.merchantReply">{{ row.merchantReply }}</span>
            <el-tag v-else type="warning">未回复</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="评价时间" width="150" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openReply(row)">{{ row.merchantReply ? '修改回复' : '回复' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="replyVisible" title="回复评价" width="520px">
      <el-alert title="回复会展示给用户，请保持清晰、礼貌，并说明后续处理方式。" type="info" :closable="false" />
      <el-input v-model="replyText" type="textarea" :rows="5" class="reply-input" placeholder="请输入商家回复" />
      <template #footer>
        <el-button @click="replyVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">提交回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.tag {
  margin-right: 6px;
}

.reply-input {
  margin-top: 16px;
}
</style>
