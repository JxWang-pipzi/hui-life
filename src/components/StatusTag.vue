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
  enabled: { text: '启用', type: 'success' },
  disabled: { text: '禁用', type: 'danger' },
}
</script>

<template>
  <el-tag :type="statusMap[props.status]?.type || 'info'">
    {{ statusMap[props.status]?.text || props.status }}
  </el-tag>
</template>
