<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createOrder } from '@/api/order'
import { getServiceDetail } from '@/api/service'
import { phoneRule, required } from '@/utils/validate'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const service = ref(null)
const form = reactive({
  customerName: '',
  phone: '',
  address: '',
  appointmentTime: '',
  remark: '',
})

const rules = {
  customerName: [required('请输入联系人')],
  phone: [phoneRule()],
  address: [required('请输入服务地址')],
  appointmentTime: [required('请选择预约时间')],
}

async function submitOrder() {
  await formRef.value.validate()
  loading.value = true
  try {
    await createOrder({
      ...form,
      serviceId: route.params.id,
    })
    ElMessage.success('预约提交成功')
    router.push('/my-orders')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  service.value = await getServiceDetail(route.params.id)
})
</script>

<template>
  <div class="page-container order-page">
    <h1 class="page-title">提交预约</h1>
    <div class="order-grid">
      <div class="panel">
        <h2 class="section-title">预约信息</h2>
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
          <el-form-item label="联系人" prop="customerName">
            <el-input v-model="form.customerName" placeholder="请输入联系人姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="服务地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入详细地址" />
          </el-form-item>
          <el-form-item label="预约时间" prop="appointmentTime">
            <el-date-picker
              v-model="form.appointmentTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm"
              placeholder="请选择预约时间"
              class="full"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" :rows="4" placeholder="可填写上门要求或补充说明" />
          </el-form-item>
          <el-button type="primary" :loading="loading" @click="submitOrder">提交预约</el-button>
        </el-form>
      </div>

      <div class="panel service-summary" v-if="service">
        <img :src="service.cover" :alt="service.title" loading="lazy" />
        <h3>{{ service.title }}</h3>
        <p>{{ service.desc }}</p>
        <strong>¥{{ service.price }}</strong>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-page {
  padding: 28px 0 44px;
}

.order-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 20px;
}

.full {
  width: 100%;
}

.service-summary {
  align-self: start;

  img {
    width: 100%;
    height: 210px;
    object-fit: cover;
    border-radius: 8px;
  }

  h3 {
    margin: 14px 0 8px;
  }

  p {
    color: #6b7280;
    line-height: 1.6;
  }

  strong {
    color: #e35d2f;
    font-size: 26px;
  }
}

@media (max-width: 768px) {
  .order-grid {
    grid-template-columns: 1fr;
  }
}
</style>
