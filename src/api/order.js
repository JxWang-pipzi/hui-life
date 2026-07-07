import request from '@/utils/request'

export function getMyOrders(params) {
  return request.get('/orders', { params })
}

export function createOrder(data) {
  return request.post('/orders', data)
}

export function cancelOrder(id) {
  return request.put(`/orders/${id}/cancel`)
}

export function createOrderReview(id, data) {
  return request.post(`/orders/${id}/review`, data)
}

export function createAfterSale(id, data) {
  return request.post(`/orders/${id}/after-sales`, data)
}

export function getAdminOrders(params) {
  return request.get('/admin/orders', { params })
}

export function updateOrderStatus(id, status) {
  return request.put(`/admin/orders/${id}`, { status })
}

export function getAdminAfterSales(params) {
  return request.get('/admin/after-sales', { params })
}

export function updateAfterSale(id, data) {
  return request.put(`/admin/after-sales/${id}`, data)
}
