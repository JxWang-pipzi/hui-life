import request from '@/utils/request'

export function getMerchantDashboard() {
  return request.get('/merchant/dashboard')
}

export function getMerchantProfile() {
  return request.get('/merchant/profile')
}

export function getMerchantServices() {
  return request.get('/merchant/services')
}

export function createMerchantService(data) {
  return request.post('/merchant/services', data)
}

export function updateMerchantService(id, data) {
  return request.put(`/merchant/services/${id}`, data)
}

export function getMerchantOrders(params) {
  return request.get('/merchant/orders', { params })
}

export function updateMerchantOrderStatus(id, status) {
  return request.put(`/merchant/orders/${id}`, { status })
}

export function getMerchantReviews() {
  return request.get('/merchant/reviews')
}

export function replyMerchantReview(id, reply) {
  return request.put(`/merchant/reviews/${id}/reply`, { reply })
}

export function getMerchantAfterSales(params) {
  return request.get('/merchant/after-sales', { params })
}

export function updateMerchantAfterSale(id, data) {
  return request.put(`/merchant/after-sales/${id}`, data)
}
