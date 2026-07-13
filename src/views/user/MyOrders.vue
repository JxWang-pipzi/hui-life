<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatusTag from '@/components/StatusTag.vue'
import { cancelOrder, createAfterSale, createOrderReview, getMyOrders } from '@/api/order'
import { required } from '@/utils/validate'

const loading = ref(false)
const submitting = ref(false)
const orders = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(8)
const currentOrder = ref(null)
const reviewVisible = ref(false)
const afterSaleVisible = ref(false)
const reviewFormRef = ref()
const afterSaleFormRef = ref()
const reviewForm = reactive({
  rating: 5,
  content: '',
  tags: [],
})
const afterSaleForm = reactive({
  reason: '',
})

const reviewRules = {
  rating: [required('请选择评分')],
  content: [required('请输入评价内容')],
}

const afterSaleRules = {
  reason: [required('请输入售后原因')],
}

async function fetchOrders() {
  loading.value = true
  try {
    const result = await getMyOrders({ page: page.value, pageSize: pageSize.value })
    orders.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

async function handleCancel(row) {
  await ElMessageBox.confirm('确认取消这个预约吗？', '取消预约', { type: 'warning' })
  await cancelOrder(row.id)
  ElMessage.success('预约已取消')
  fetchOrders()
}

function openReview(row) {
  currentOrder.value = row
  Object.assign(reviewForm, { rating: 5, content: '', tags: [] })
  reviewVisible.value = true
}

async function submitReview() {
  await reviewFormRef.value.validate()
  submitting.value = true
  try {
    await createOrderReview(currentOrder.value.id, reviewForm)
    ElMessage.success('评价已提交')
    reviewVisible.value = false
    fetchOrders()
  } finally {
    submitting.value = false
  }
}

function openAfterSale(row) {
  currentOrder.value = row
  afterSaleForm.reason = ''
  afterSaleVisible.value = true
}

async function submitAfterSale() {
  await afterSaleFormRef.value.validate()
  submitting.value = true
  try {
    await createAfterSale(currentOrder.value.id, afterSaleForm)
    ElMessage.success('售后申请已提交')
    afterSaleVisible.value = false
    fetchOrders()
  } finally {
    submitting.value = false
  }
}

function canCancel(row) {
  return ['pending', 'confirmed'].includes(row.status)
}

function canReview(row) {
  return row.status === 'completed' && row.reviewStatus !== 'done'
}

function canApplyAfterSale(row) {
  return (
    ['confirmed', 'completed'].includes(row.status) &&
    (!row.afterSaleStatus || row.afterSaleStatus === 'none')
  )
}
</script>

<template>
  <div class="page-container orders-page">
    <div class="orders-head">
      <div>
        <p>Order Center</p>
        <h1>我的订单</h1>
        <span>预约状态、服务进度和售后记录集中管理。</span>
      </div>
      <div class="order-count">
        <strong>{{ total }}</strong><span>全部订单</span>
      </div>
    </div>
    <div class="panel">
      <el-table v-loading="loading" :data="orders">
        <el-table-column prop="serviceTitle" label="服务" min-width="160" />
        <el-table-column prop="appointmentTime" label="预约时间" min-width="150" />
        <el-table-column prop="address" label="地址" min-width="220" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="售后" width="110">
          <template #default="{ row }">
            <StatusTag :status="row.afterSaleStatus || 'none'" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button v-if="canCancel(row)" link type="primary" @click="handleCancel(row)">
              取消
            </el-button>
            <el-button v-if="canReview(row)" link type="success" @click="openReview(row)">
              评价
            </el-button>
            <el-button
              v-if="canApplyAfterSale(row)"
              link
              type="warning"
              @click="openAfterSale(row)"
            >
              售后
            </el-button>
            <span v-if="!canCancel(row) && !canReview(row) && !canApplyAfterSale(row)" class="muted">暂无操作</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="mobile-orders">
        <div v-for="item in orders" :key="item.id" class="order-card">
          <div class="card-head">
            <strong>{{ item.serviceTitle }}</strong>
            <StatusTag :status="item.status" />
          </div>
          <p>{{ item.appointmentTime }}</p>
          <p>{{ item.address }}</p>
          <div class="card-meta">
            <span>售后：</span>
            <StatusTag :status="item.afterSaleStatus || 'none'" />
          </div>
          <div class="card-actions">
            <el-button v-if="canCancel(item)" size="small" @click="handleCancel(item)">
              取消预约
            </el-button>
            <el-button v-if="canReview(item)" size="small" type="success" @click="openReview(item)">
              评价
            </el-button>
            <el-button
              v-if="canApplyAfterSale(item)"
              size="small"
              type="warning"
              @click="openAfterSale(item)"
            >
              申请售后
            </el-button>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="fetchOrders"
        />
      </div>
    </div>

    <el-dialog v-model="reviewVisible" title="订单评价" width="520px">
      <el-form ref="reviewFormRef" :model="reviewForm" :rules="reviewRules" label-position="top">
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="reviewForm.rating" />
        </el-form-item>
        <el-form-item label="服务标签">
          <el-checkbox-group v-model="reviewForm.tags">
            <el-checkbox label="准时" value="准时" />
            <el-checkbox label="服务专业" value="服务专业" />
            <el-checkbox label="沟通顺畅" value="沟通顺畅" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input
            v-model="reviewForm.content"
            type="textarea"
            :rows="4"
            placeholder="说说本次服务体验"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitReview">提交评价</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="afterSaleVisible" title="申请售后" width="520px">
      <el-form
        ref="afterSaleFormRef"
        :model="afterSaleForm"
        :rules="afterSaleRules"
        label-position="top"
      >
        <el-form-item label="问题描述" prop="reason">
          <el-input
            v-model="afterSaleForm.reason"
            type="textarea"
            :rows="5"
            placeholder="请描述需要复核、返工或退款协商的问题"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="afterSaleVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitAfterSale">
          提交申请
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.orders-page {
  padding: 44px 0 72px;
}

.orders-head {
  display: flex;
  gap: 24px;
  align-items: flex-end;
  justify-content: space-between;
  padding: 32px;
  margin-bottom: 24px;
  color: #fff;
  background: linear-gradient(135deg, #07111f, #0f766e);
  border-radius: 16px;

  p {
    margin: 0 0 8px;
    color: #5eead4;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
  }
  h1 {
    margin: 0;
    font-size: 36px;
  }
  > div > span {
    display: block;
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.72);
  }
}

.order-count {
  min-width: 130px;
  padding: 18px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;

  strong {
    display: block;
    font-size: 32px;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.mobile-orders {
  display: none;
}

.order-card {
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;

  p {
    margin: 8px 0 0;
    color: #6b7280;
  }
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.card-meta,
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.card-actions {
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .orders-head {
    align-items: flex-start;
    padding: 24px;
  }
  .order-count {
    display: none;
  }
  :deep(.el-table) {
    display: none;
  }

  .mobile-orders {
    display: block;
  }
}
</style>
