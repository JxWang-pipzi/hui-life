import request from '@/utils/request'

export function getServices(params) {
  return request.get('/services', { params })
}

export function getHotServices() {
  return request.get('/services/hot')
}

export function getServiceDetail(id) {
  return request.get(`/services/${id}`)
}

export function getServiceReviews(params) {
  return request.get('/reviews', { params })
}

export function getAdminServices(params) {
  return request.get('/admin/services', { params })
}

export function createService(data) {
  return request.post('/admin/services', data)
}

export function updateService(id, data) {
  return request.put(`/admin/services/${id}`, data)
}

export function deleteService(id) {
  return request.delete(`/admin/services/${id}`)
}
