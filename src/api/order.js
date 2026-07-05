import request from '@/utils/request'

export function getMyOrders(params) {
  return request.get('/orders', { params })
}

export function createOrder(data) {
  return request.post('/orders', data)
}

export function getAdminOrders(params) {
  return request.get('/admin/orders', { params })
}

export function updateOrderStatus(id, status) {
  return request.put(`/admin/orders/${id}`, { status })
}
