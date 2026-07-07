import { request } from './request'

const categories = [
  { label: '家政保洁', value: 'cleaning', icon: 'home' },
  { label: '维修清洗', value: 'repair', icon: 'gear' },
  { label: '摄影拍摄', value: 'photo', icon: 'camera' },
  { label: '兴趣课程', value: 'course', icon: 'compose' },
  { label: '美容护理', value: 'beauty', icon: 'heart' },
]

const statusMap = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  canceled: '已取消',
}

export function getCategories() {
  return Promise.resolve(categories)
}

export function login(data) {
  return request('/auth/login', { method: 'POST', data })
}

export function register(data) {
  return request('/auth/register', { method: 'POST', data })
}

export function getProfile() {
  return request('/auth/profile')
}

export function getHotServices() {
  return request('/services/hot')
}

export async function getServices(params = {}) {
  const result = await request('/services', { data: { ...params, page: 1, pageSize: 50 } })
  return result.list
}

export function getServiceDetail(id) {
  return request(`/services/${id}`)
}

export async function getServiceReviews(serviceId) {
  const result = await request('/reviews', { data: { serviceId, page: 1, pageSize: 10 } })
  return result.list
}

export function getAddresses() {
  return request('/addresses')
}

export function createBooking(data) {
  return request('/orders', { method: 'POST', data })
}

export async function getOrders(status = '') {
  const result = await request('/orders', { data: { page: 1, pageSize: 50 } })
  return status ? result.list.filter((item) => item.status === status) : result.list
}

export function cancelOrder(id) {
  return request(`/orders/${id}/cancel`, { method: 'PUT' })
}

export function createOrderReview(id, data) {
  return request(`/orders/${id}/review`, { method: 'POST', data })
}

export function getCoupons() {
  return request('/coupons')
}

export function receiveCoupon(id) {
  return request(`/coupons/${id}/receive`, { method: 'POST' })
}

export function getAnnouncements(scene = '') {
  const query = scene ? `?scene=${encodeURIComponent(scene)}` : ''
  return request(`/announcements${query}`)
}

export function applyMerchant(data) {
  return request('/merchant/applications', { method: 'POST', data })
}

export function getMerchantProfile() {
  return request('/merchant/profile')
}

export function getMerchantDashboard() {
  return request('/merchant/dashboard')
}

export function getMerchantServices() {
  return request('/merchant/services')
}

export async function getMerchantOrders() {
  const result = await request('/merchant/orders', { data: { page: 1, pageSize: 50 } })
  return result.list
}

export function updateMerchantOrderStatus(id, status) {
  return request(`/merchant/orders/${id}`, { method: 'PUT', data: { status } })
}

export function getMerchantReviews() {
  return request('/merchant/reviews')
}

export function replyMerchantReview(id, reply) {
  return request(`/merchant/reviews/${id}/reply`, { method: 'PUT', data: { reply } })
}

export function getStatusText(status) {
  return statusMap[status] || status
}
