import { request } from './request'
import {
  addresses,
  announcements,
  categories,
  coupons,
  getMerchantDashboardFallback,
  merchantProfile,
  orders,
  reviews,
  services,
} from './local-data'

const statusMap = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  canceled: '已取消',
}

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

async function withFallback(task, fallback) {
  try {
    return await task()
  } catch (error) {
    console.warn('[惠生活] 接口不可用，使用本地兜底数据', error)
    return typeof fallback === 'function' ? fallback() : clone(fallback)
  }
}

export function getCategories() {
  return Promise.resolve(clone(categories))
}

export function login(data) {
  return withFallback(() => request('/auth/login', { method: 'POST', data }), () => ({
    token: `local-${data.role || 'user'}-token`,
    user: {
      id: data.role === 'merchant' ? 6 : 2,
      username: data.username,
      name: data.role === 'merchant' ? '保洁商家' : '普通用户',
      role: data.role === 'merchant' ? 'merchant' : 'user',
    },
  }))
}

export function register(data) {
  return withFallback(() => request('/auth/register', { method: 'POST', data }), () => ({
    id: Date.now(),
    username: data.username,
    name: data.name,
    role: data.role || 'user',
  }))
}

export function getProfile() {
  return withFallback(() => request('/auth/profile'), {
    id: 2,
    username: 'user',
    name: '普通用户',
    role: 'user',
    phone: '13800000002',
  })
}

export function getHotServices() {
  return withFallback(() => request('/services/hot'), () => clone(services.slice(0, 5)))
}

export async function getServices(params = {}) {
  const result = await withFallback(() => request('/services', { data: { ...params, page: 1, pageSize: 50 } }), () => {
    let list = clone(services)
    if (params.category) list = list.filter((item) => item.category === params.category)
    if (params.keyword) list = list.filter((item) => item.title.includes(params.keyword) || item.desc.includes(params.keyword))
    return { list }
  })
  return result.list
}

export function getServiceDetail(id) {
  return withFallback(() => request(`/services/${id}`), () => clone(services.find((item) => String(item.id) === String(id)) || services[0]))
}

export async function getServiceReviews(serviceId) {
  const result = await withFallback(() => request('/reviews', { data: { serviceId, page: 1, pageSize: 10 } }), () => ({
    list: clone(reviews.filter((item) => String(item.serviceId) === String(serviceId))),
  }))
  return result.list
}

export function getAddresses() {
  return withFallback(() => request('/addresses'), addresses)
}

export function createBooking(data) {
  return withFallback(() => request('/orders', { method: 'POST', data }), () => ({ id: Date.now(), ...data, status: 'pending' }))
}

export async function getOrders(status = '') {
  const result = await withFallback(() => request('/orders', { data: { page: 1, pageSize: 50 } }), { list: orders })
  return status ? result.list.filter((item) => item.status === status) : result.list
}

export function cancelOrder(id) {
  return withFallback(() => request(`/orders/${id}/cancel`, { method: 'PUT' }), () => ({ id, status: 'canceled' }))
}

export function createOrderReview(id, data) {
  return withFallback(() => request(`/orders/${id}/review`, { method: 'POST', data }), () => ({ id, ...data }))
}

export function getCoupons() {
  return withFallback(() => request('/coupons'), coupons)
}

export function receiveCoupon(id) {
  return withFallback(() => request(`/coupons/${id}/receive`, { method: 'POST' }), () => ({ id, received: true }))
}

export function getAnnouncements(scene = '') {
  const query = scene ? `?scene=${encodeURIComponent(scene)}` : ''
  return withFallback(() => request(`/announcements${query}`), () => {
    const list = scene ? announcements.filter((item) => item.scene === scene) : announcements
    return clone(list)
  })
}

export function applyMerchant(data) {
  return withFallback(() => request('/merchant/applications', { method: 'POST', data }), () => ({ id: Date.now(), status: 'pending', ...data }))
}

export function getMerchantProfile() {
  return withFallback(() => request('/merchant/profile'), merchantProfile)
}

export function getMerchantDashboard() {
  return withFallback(() => request('/merchant/dashboard'), getMerchantDashboardFallback)
}

export function getMerchantServices() {
  return withFallback(() => request('/merchant/services'), () => clone(services))
}

export async function getMerchantOrders() {
  const result = await withFallback(() => request('/merchant/orders', { data: { page: 1, pageSize: 50 } }), { list: orders })
  return result.list
}

export function updateMerchantOrderStatus(id, status) {
  return withFallback(() => request(`/merchant/orders/${id}`, { method: 'PUT', data: { status } }), () => ({ id, status }))
}

export function getMerchantReviews() {
  return withFallback(() => request('/merchant/reviews'), reviews)
}

export function replyMerchantReview(id, reply) {
  return withFallback(() => request(`/merchant/reviews/${id}/reply`, { method: 'PUT', data: { reply } }), () => ({ id, merchantReply: reply }))
}

export function getStatusText(status) {
  return statusMap[status] || status
}
