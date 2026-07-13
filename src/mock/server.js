import {
  addresses,
  afterSales,
  announcements,
  coupons,
  operationLogs,
  orders,
  permissions,
  reviews,
  roles,
  services,
  userCoupons,
  users,
} from './data'

let serviceList = [...services]
let orderList = [...orders]
let userList = [...users]
let addressList = [...addresses]
let reviewList = [...reviews]
let afterSaleList = [...afterSales]
let roleList = [...roles]
let logList = [...operationLogs]
let couponList = [...coupons]
let userCouponList = [...userCoupons]

const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 240))

function ok(data = null) {
  return { code: 0, data, message: 'ok' }
}

function fail(message, code = -1) {
  return { code, data: null, message }
}

function parseBody(data) {
  if (!data) return {}
  return typeof data === 'string' ? JSON.parse(data) : data
}

function pageResult(list, page = 1, pageSize = 8) {
  const current = Number(page) || 1
  const size = Number(pageSize) || 8
  const start = (current - 1) * size
  return {
    list: list.slice(start, start + size),
    total: list.length,
    page: current,
    pageSize: size,
  }
}

function response(config, body, status = 200) {
  return {
    data: body,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config,
    request: {},
  }
}

function getPath(config) {
  return (config.url || '').replace(/^\/api/, '').split('?')[0]
}

function getUserByToken(config) {
  const token = config.headers?.Authorization?.replace('Bearer token-', '')
  return userList.find((item) => String(item.id) === token)
}

function getUserRoles(user) {
  const ids = user.roleIds || []
  return roleList.filter((role) => ids.includes(role.id))
}

function getUserPermissions(user) {
  return [...new Set(getUserRoles(user).flatMap((role) => role.permissions))]
}

function profileOf(user) {
  const { password, ...profile } = user
  const userRoles = getUserRoles(user)
  return {
    ...profile,
    roles: userRoles.map((item) => ({ id: item.id, name: item.name, code: item.code })),
    permissions: getUserPermissions(user),
  }
}

function requirePermission(config, permission) {
  const user = getUserByToken(config)
  if (!user) return response(config, fail('未登录', 401), 401)
  if (!getUserPermissions(user).includes(permission)) return response(config, fail('无权访问该功能', 403), 403)
  return null
}

function addLog(config, action, target, detail) {
  const user = getUserByToken(config)
  logList.unshift({
    id: Date.now(),
    operator: user?.name || '系统',
    action,
    target,
    detail,
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
  })
}

function filterServices(params = {}) {
  const { keyword = '', category = '', sort = '' } = params
  let list = [...serviceList]

  if (keyword) {
    list = list.filter((item) => item.title.includes(keyword) || item.desc.includes(keyword))
  }
  if (category) {
    list = list.filter((item) => item.category === category)
  }
  if (sort === 'priceAsc') {
    list.sort((a, b) => a.price - b.price)
  }
  if (sort === 'salesDesc') {
    list.sort((a, b) => b.sales - a.sales)
  }

  return list
}

function syncServiceRating(serviceId) {
  const serviceReviews = reviewList.filter((item) => item.serviceId === serviceId)
  if (!serviceReviews.length) return

  const average = serviceReviews.reduce((sum, item) => sum + Number(item.rating), 0) / serviceReviews.length
  serviceList = serviceList.map((item) =>
    item.id === serviceId ? { ...item, rating: Number(average.toFixed(1)), sales: Math.max(item.sales, serviceReviews.length) } : item,
  )
}

function couponOf(item, userId) {
  if (!item) return null
  return {
    ...item,
    received: userCouponList.some((record) => record.userId === userId && record.couponId === item.id),
  }
}

async function handle(config) {
  const path = getPath(config)
  const method = (config.method || 'get').toLowerCase()
  const params = config.params || {}
  const body = parseBody(config.data)

  if (path === '/auth/login' && method === 'post') {
    const user = userList.find((item) => item.username === body.username && item.password === body.password)
    if (!user) return response(config, fail('账号或密码错误'))
    if (user.status === 'disabled') return response(config, fail('账号已被停用'))

    return response(config, ok({ token: `token-${user.id}`, user: profileOf(user) }))
  }

  if (path === '/auth/profile' && method === 'get') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    return response(config, ok(profileOf(user)))
  }

  if (path === '/services' && method === 'get') {
    return response(config, ok(pageResult(filterServices(params), params.page, params.pageSize)))
  }

  if (path === '/services/hot' && method === 'get') {
    const list = [...serviceList].sort((a, b) => b.sales - a.sales).slice(0, 4)
    return response(config, ok(list))
  }

  if (path.startsWith('/services/') && method === 'get') {
    const id = Number(path.split('/').pop())
    const service = serviceList.find((item) => item.id === id)
    return response(config, service ? ok(service) : fail('服务不存在'))
  }

  if (path === '/reviews' && method === 'get') {
    const serviceId = Number(params.serviceId)
    let list = [...reviewList]
    if (serviceId) {
      list = list.filter((item) => item.serviceId === serviceId)
    }
    return response(config, ok(pageResult(list, params.page, params.pageSize)))
  }

  if (path === '/announcements' && method === 'get') {
    let list = announcements.filter((item) => item.status === 'published')
    if (params.scene) {
      list = list.filter((item) => item.scene === params.scene)
    }
    list.sort((a, b) => b.sort - a.sort || b.id - a.id)
    return response(config, ok(list))
  }

  if (path === '/coupons' && method === 'get') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)
    const list = couponList
      .filter((item) => item.status === 'enabled')
      .sort((a, b) => b.id - a.id)
      .map((item) => couponOf(item, user.id))
    return response(config, ok(list))
  }

  if (path.match(/^\/coupons\/\d+\/receive$/) && method === 'post') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    const id = Number(path.split('/')[2])
    const coupon = couponList.find((item) => item.id === id && item.status === 'enabled')
    if (!coupon) return response(config, fail('优惠券不存在'))
    if (userCouponList.some((item) => item.userId === user.id && item.couponId === id)) {
      return response(config, fail('已领取该优惠券'))
    }
    if (coupon.stock <= 0) return response(config, fail('优惠券已领完'))

    userCouponList.unshift({
      id: Date.now(),
      userId: user.id,
      couponId: id,
      status: 'unused',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    })
    couponList = couponList.map((item) => (item.id === id ? { ...item, stock: item.stock - 1 } : item))
    return response(config, ok(true))
  }

  if (path === '/my-coupons' && method === 'get') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)
    const list = userCouponList
      .filter((item) => item.userId === user.id)
      .map((record) => {
        const coupon = couponOf(
          couponList.find((item) => item.id === record.couponId),
          user.id,
        )
        return coupon ? { ...coupon, userCouponStatus: record.status } : null
      })
      .filter(Boolean)
    return response(config, ok(list))
  }

  if (path === '/addresses' && method === 'get') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    return response(config, ok(addressList.filter((item) => item.userId === user.id)))
  }

  if (path === '/addresses' && method === 'post') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    if (body.isDefault) {
      addressList = addressList.map((item) => (item.userId === user.id ? { ...item, isDefault: false } : item))
    }

    const next = {
      ...body,
      id: Date.now(),
      userId: user.id,
      isDefault: Boolean(body.isDefault) || !addressList.some((item) => item.userId === user.id),
    }
    addressList.unshift(next)
    return response(config, ok(next))
  }

  if (path.startsWith('/addresses/') && method === 'put') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    const id = Number(path.split('/').pop())
    const current = addressList.find((item) => item.id === id && item.userId === user.id)
    if (!current) return response(config, fail('地址不存在'))

    if (body.isDefault) {
      addressList = addressList.map((item) => (item.userId === user.id ? { ...item, isDefault: false } : item))
    }

    addressList = addressList.map((item) =>
      item.id === id && item.userId === user.id ? { ...item, ...body, id, userId: user.id } : item,
    )
    return response(config, ok(true))
  }

  if (path.startsWith('/addresses/') && method === 'delete') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    const id = Number(path.split('/').pop())
    addressList = addressList.filter((item) => !(item.id === id && item.userId === user.id))
    return response(config, ok(true))
  }

  if (path === '/orders' && method === 'get') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    const list = user.role === 'admin' ? orderList : orderList.filter((item) => item.userId === user.id)
    return response(config, ok(pageResult(list, params.page, params.pageSize)))
  }

  if (path === '/orders' && method === 'post') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    const service = serviceList.find((item) => item.id === Number(body.serviceId))
    if (!service) return response(config, fail('服务不存在'))

    const next = {
      id: Date.now(),
      serviceId: service.id,
      serviceTitle: service.title,
      userId: user.id,
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      appointmentTime: body.appointmentTime,
      status: 'pending',
      reviewStatus: 'none',
      afterSaleStatus: 'none',
      remark: body.remark || '',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    }
    orderList.unshift(next)
    return response(config, ok(next))
  }

  if (path.match(/^\/orders\/\d+\/cancel$/) && method === 'put') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    const id = Number(path.split('/')[2])
    const order = orderList.find((item) => item.id === id && item.userId === user.id)
    if (!order) return response(config, fail('订单不存在'))
    if (!['pending', 'confirmed'].includes(order.status)) return response(config, fail('当前订单状态不可取消'))

    orderList = orderList.map((item) => (item.id === id ? { ...item, status: 'canceled' } : item))
    return response(config, ok(true))
  }

  if (path.match(/^\/orders\/\d+\/review$/) && method === 'post') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    const id = Number(path.split('/')[2])
    const order = orderList.find((item) => item.id === id && item.userId === user.id)
    if (!order) return response(config, fail('订单不存在'))
    if (order.status !== 'completed') return response(config, fail('订单完成后才能评价'))
    if (order.reviewStatus === 'done') return response(config, fail('该订单已评价'))

    const next = {
      id: Date.now(),
      orderId: order.id,
      serviceId: order.serviceId,
      serviceTitle: order.serviceTitle,
      userId: user.id,
      userName: user.name,
      rating: Number(body.rating),
      content: body.content,
      tags: body.tags || [],
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    }
    reviewList.unshift(next)
    orderList = orderList.map((item) => (item.id === id ? { ...item, reviewStatus: 'done' } : item))
    syncServiceRating(order.serviceId)
    return response(config, ok(next))
  }

  if (path.match(/^\/orders\/\d+\/after-sales$/) && method === 'post') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    const id = Number(path.split('/')[2])
    const order = orderList.find((item) => item.id === id && item.userId === user.id)
    if (!order) return response(config, fail('订单不存在'))
    if (!['confirmed', 'completed'].includes(order.status)) return response(config, fail('当前订单状态不可申请售后'))
    if (order.afterSaleStatus && order.afterSaleStatus !== 'none') return response(config, fail('该订单已有售后记录'))

    const next = {
      id: Date.now(),
      orderId: order.id,
      serviceId: order.serviceId,
      serviceTitle: order.serviceTitle,
      userId: user.id,
      userName: user.name,
      phone: order.phone,
      reason: body.reason,
      status: 'submitted',
      solution: '',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    }
    afterSaleList.unshift(next)
    orderList = orderList.map((item) => (item.id === id ? { ...item, afterSaleStatus: 'submitted' } : item))
    return response(config, ok(next))
  }

  if (path === '/admin/services' && method === 'get') {
    const denied = requirePermission(config, 'service:manage')
    if (denied) return denied
    return response(config, ok(pageResult(filterServices(params), params.page, params.pageSize)))
  }

  if (path === '/admin/services' && method === 'post') {
    const denied = requirePermission(config, 'service:manage')
    if (denied) return denied
    const next = {
      ...body,
      id: Date.now(),
      price: Number(body.price),
      sales: 0,
      rating: 4.8,
      cover:
        body.cover ||
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    }
    serviceList.unshift(next)
    addLog(config, '新增服务', next.title, `新增服务价格 ¥${next.price}`)
    return response(config, ok(next))
  }

  if (path.startsWith('/admin/services/') && method === 'put') {
    const denied = requirePermission(config, 'service:manage')
    if (denied) return denied
    const id = Number(path.split('/').pop())
    const current = serviceList.find((item) => item.id === id)
    serviceList = serviceList.map((item) => (item.id === id ? { ...item, ...body, id } : item))
    addLog(config, '编辑服务', current?.title || `服务 #${id}`, '更新服务基础信息')
    return response(config, ok(true))
  }

  if (path.startsWith('/admin/services/') && method === 'delete') {
    const denied = requirePermission(config, 'service:manage')
    if (denied) return denied
    const id = Number(path.split('/').pop())
    const current = serviceList.find((item) => item.id === id)
    serviceList = serviceList.filter((item) => item.id !== id)
    addLog(config, '删除服务', current?.title || `服务 #${id}`, '从服务列表中删除')
    return response(config, ok(true))
  }

  if (path === '/admin/orders' && method === 'get') {
    const denied = requirePermission(config, 'order:manage')
    if (denied) return denied
    let list = [...orderList]
    if (params.keyword) {
      list = list.filter(
        (item) => item.serviceTitle.includes(params.keyword) || item.customerName.includes(params.keyword),
      )
    }
    if (params.status) {
      list = list.filter((item) => item.status === params.status)
    }
    return response(config, ok(pageResult(list, params.page, params.pageSize)))
  }

  if (path === '/admin/after-sales' && method === 'get') {
    const denied = requirePermission(config, 'after-sale:manage')
    if (denied) return denied
    let list = [...afterSaleList]
    if (params.keyword) {
      list = list.filter(
        (item) => item.serviceTitle.includes(params.keyword) || item.userName.includes(params.keyword) || item.phone.includes(params.keyword),
      )
    }
    if (params.status) {
      list = list.filter((item) => item.status === params.status)
    }
    return response(config, ok(pageResult(list, params.page, params.pageSize)))
  }

  if (path.startsWith('/admin/after-sales/') && method === 'put') {
    const denied = requirePermission(config, 'after-sale:manage')
    if (denied) return denied
    const id = Number(path.split('/').pop())
    const current = afterSaleList.find((item) => item.id === id)
    if (!current) return response(config, fail('售后记录不存在'))

    afterSaleList = afterSaleList.map((item) =>
      item.id === id ? { ...item, status: body.status, solution: body.solution || item.solution } : item,
    )
    orderList = orderList.map((item) => (item.id === current.orderId ? { ...item, afterSaleStatus: body.status } : item))
    addLog(config, '处理售后', `${current.serviceTitle} #${id}`, `状态更新为 ${body.status}`)
    return response(config, ok(true))
  }

  if (path.startsWith('/admin/orders/') && method === 'put') {
    const denied = requirePermission(config, 'order:manage')
    if (denied) return denied
    const id = Number(path.split('/').pop())
    const current = orderList.find((item) => item.id === id)
    orderList = orderList.map((item) => (item.id === id ? { ...item, status: body.status } : item))
    addLog(config, '修改订单状态', current?.serviceTitle || `订单 #${id}`, `状态更新为 ${body.status}`)
    return response(config, ok(true))
  }

  if (path === '/admin/users' && method === 'get') {
    const denied = requirePermission(config, 'user:manage')
    if (denied) return denied
    const list = userList.map((item) => profileOf(item))
    return response(config, ok(pageResult(list, params.page, params.pageSize)))
  }

  if (path.match(/^\/admin\/users\/\d+\/roles$/) && method === 'put') {
    const denied = requirePermission(config, 'user:manage')
    if (denied) return denied
    const id = Number(path.split('/')[3])
    userList = userList.map((item) => (item.id === id ? { ...item, roleIds: body.roleIds || [] } : item))
    addLog(config, '分配用户角色', `用户 #${id}`, `角色 ID：${(body.roleIds || []).join(', ')}`)
    return response(config, ok(true))
  }

  if (path.startsWith('/admin/users/') && method === 'put') {
    const denied = requirePermission(config, 'user:manage')
    if (denied) return denied
    const id = Number(path.split('/').pop())
    userList = userList.map((item) => (item.id === id ? { ...item, status: body.status } : item))
    addLog(config, '修改用户状态', `用户 #${id}`, `状态更新为 ${body.status}`)
    return response(config, ok(true))
  }

  if (path === '/admin/permissions' && method === 'get') {
    const denied = requirePermission(config, 'role:manage')
    if (denied) return denied
    return response(config, ok(permissions))
  }

  if (path === '/admin/roles' && method === 'get') {
    const denied = requirePermission(config, 'role:manage')
    if (denied) return denied
    return response(config, ok(pageResult(roleList, params.page, params.pageSize)))
  }

  if (path === '/admin/roles' && method === 'post') {
    const denied = requirePermission(config, 'role:manage')
    if (denied) return denied
    const next = { ...body, id: Date.now() }
    roleList.unshift(next)
    addLog(config, '新增角色', next.name, `权限数：${next.permissions?.length || 0}`)
    return response(config, ok(next))
  }

  if (path.startsWith('/admin/roles/') && method === 'put') {
    const denied = requirePermission(config, 'role:manage')
    if (denied) return denied
    const id = Number(path.split('/').pop())
    roleList = roleList.map((item) => (item.id === id ? { ...item, ...body, id } : item))
    addLog(config, '编辑角色', body.name || `角色 #${id}`, `权限数：${body.permissions?.length || 0}`)
    return response(config, ok(true))
  }

  if (path.startsWith('/admin/roles/') && method === 'delete') {
    const denied = requirePermission(config, 'role:manage')
    if (denied) return denied
    const id = Number(path.split('/').pop())
    if (id === 1 || id === 4) return response(config, fail('内置角色不可删除'))
    if (userList.some((item) => (item.roleIds || []).includes(id))) return response(config, fail('该角色已被用户使用'))
    const current = roleList.find((item) => item.id === id)
    roleList = roleList.filter((item) => item.id !== id)
    addLog(config, '删除角色', current?.name || `角色 #${id}`, '从角色列表中删除')
    return response(config, ok(true))
  }

  if (path === '/admin/logs' && method === 'get') {
    const denied = requirePermission(config, 'log:view')
    if (denied) return denied
    let list = [...logList]
    if (params.keyword) {
      list = list.filter(
        (item) => item.operator.includes(params.keyword) || item.action.includes(params.keyword) || item.target.includes(params.keyword),
      )
    }
    return response(config, ok(pageResult(list, params.page, params.pageSize)))
  }

  if (path === '/admin/menus' && method === 'get') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)
    return response(config, ok(getUserPermissions(user)))
  }

  if (path === '/admin/stats' && method === 'get') {
    const denied = requirePermission(config, 'dashboard:view')
    if (denied) return denied
    return response(
      config,
      ok({
        serviceCount: serviceList.length,
        userCount: userList.length,
        orderCount: orderList.length,
        pendingCount: orderList.filter((item) => item.status === 'pending').length,
        reviewCount: reviewList.length,
        afterSalePendingCount: afterSaleList.filter((item) => ['submitted', 'processing'].includes(item.status)).length,
        roleCount: roleList.length,
        logCount: logList.length,
        trend: [12, 18, 16, 24, 31, 28, 36],
        categories: [
          { name: '家政保洁', value: 38 },
          { name: '维修清洗', value: 26 },
          { name: '兴趣课程', value: 21 },
          { name: '美容护理', value: 15 },
        ],
      }),
    )
  }

  return response(config, fail(`Mock 接口不存在：${method.toUpperCase()} ${path}`), 404)
}

export async function mockAdapter(config) {
  return wait(handle(config))
}
