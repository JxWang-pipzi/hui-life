<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const statusMap = {
  pending: { text: '待确认', type: 'warning' },
  confirmed: { text: '已确认', type: 'primary' },
  completed: { text: '已完成', type: 'success' },
  canceled: { text: '已取消', type: 'info' },
  none: { text: '无', type: 'info' },
  submitted: { text: '已提交', type: 'warning' },
  processing: { text: '处理中', type: 'primary' },
  resolved: { text: '已解决', type: 'success' },
  rejected: { text: '已驳回', type: 'danger' },
  published: { text: '已发布', type: 'success' },
  draft: { text: '草稿', type: 'info' },
  enabled: { text: '启用', type: 'success' },
  disabled: { text: '禁用', type: 'danger' },
}
</script>

<template>
  <el-tag :type="statusMap[props.status]?.type || 'info'">
    {{ statusMap[props.status]?.text || props.status }}
  </el-tag>
</template>
