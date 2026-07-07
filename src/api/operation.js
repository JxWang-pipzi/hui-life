import request from '@/utils/request'

export function getAnnouncements(params) {
  return request.get('/announcements', { params })
}

export function getCoupons() {
  return request.get('/coupons')
}

export function receiveCoupon(id) {
  return request.post(`/coupons/${id}/receive`)
}

export function getMyCoupons() {
  return request.get('/my-coupons')
}

export function getAdminAnnouncements(params) {
  return request.get('/admin/announcements', { params })
}

export function createAnnouncement(data) {
  return request.post('/admin/announcements', data)
}

export function updateAnnouncement(id, data) {
  return request.put(`/admin/announcements/${id}`, data)
}

export function deleteAnnouncement(id) {
  return request.delete(`/admin/announcements/${id}`)
}

export function getAdminCoupons(params) {
  return request.get('/admin/coupons', { params })
}

export function createCoupon(data) {
  return request.post('/admin/coupons', data)
}

export function updateCoupon(id, data) {
  return request.put(`/admin/coupons/${id}`, data)
}

export function deleteCoupon(id) {
  return request.delete(`/admin/coupons/${id}`)
}
