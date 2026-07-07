import request from '@/utils/request'

export function getPermissions() {
  return request.get('/admin/permissions')
}

export function getRoles(params) {
  return request.get('/admin/roles', { params })
}

export function createRole(data) {
  return request.post('/admin/roles', data)
}

export function updateRole(id, data) {
  return request.put(`/admin/roles/${id}`, data)
}

export function deleteRole(id) {
  return request.delete(`/admin/roles/${id}`)
}

export function getOperationLogs(params) {
  return request.get('/admin/logs', { params })
}
