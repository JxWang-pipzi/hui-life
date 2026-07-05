import request from '@/utils/request'

export function getUsers(params) {
  return request.get('/admin/users', { params })
}

export function updateUserStatus(id, status) {
  return request.put(`/admin/users/${id}`, { status })
}

export function getAdminStats() {
  return request.get('/admin/stats')
}
