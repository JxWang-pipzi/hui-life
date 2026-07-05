import { orders, services, users } from './data'

let serviceList = [...services]
let orderList = [...orders]
let userList = [...users]

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

async function handle(config) {
  const path = getPath(config)
  const method = (config.method || 'get').toLowerCase()
  const params = config.params || {}
  const body = parseBody(config.data)

  if (path === '/auth/login' && method === 'post') {
    const user = userList.find((item) => item.username === body.username && item.password === body.password)
    if (!user) return response(config, fail('账号或密码错误'))
    if (user.status === 'disabled') return response(config, fail('账号已被停用'))

    const { password, ...profile } = user
    return response(config, ok({ token: `token-${user.id}`, user: profile }))
  }

  if (path === '/auth/profile' && method === 'get') {
    const user = getUserByToken(config)
    if (!user) return response(config, fail('未登录', 401), 401)

    const { password, ...profile } = user
    return response(config, ok(profile))
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
      remark: body.remark || '',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    }
    orderList.unshift(next)
    return response(config, ok(next))
  }

  if (path === '/admin/services' && method === 'get') {
    return response(config, ok(pageResult(filterServices(params), params.page, params.pageSize)))
  }

  if (path === '/admin/services' && method === 'post') {
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
    return response(config, ok(next))
  }

  if (path.startsWith('/admin/services/') && method === 'put') {
    const id = Number(path.split('/').pop())
    serviceList = serviceList.map((item) => (item.id === id ? { ...item, ...body, id } : item))
    return response(config, ok(true))
  }

  if (path.startsWith('/admin/services/') && method === 'delete') {
    const id = Number(path.split('/').pop())
    serviceList = serviceList.filter((item) => item.id !== id)
    return response(config, ok(true))
  }

  if (path === '/admin/orders' && method === 'get') {
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

  if (path.startsWith('/admin/orders/') && method === 'put') {
    const id = Number(path.split('/').pop())
    orderList = orderList.map((item) => (item.id === id ? { ...item, status: body.status } : item))
    return response(config, ok(true))
  }

  if (path === '/admin/users' && method === 'get') {
    const list = userList.map(({ password, ...item }) => item)
    return response(config, ok(pageResult(list, params.page, params.pageSize)))
  }

  if (path.startsWith('/admin/users/') && method === 'put') {
    const id = Number(path.split('/').pop())
    userList = userList.map((item) => (item.id === id ? { ...item, status: body.status } : item))
    return response(config, ok(true))
  }

  if (path === '/admin/stats' && method === 'get') {
    return response(
      config,
      ok({
        serviceCount: serviceList.length,
        userCount: userList.length,
        orderCount: orderList.length,
        pendingCount: orderList.filter((item) => item.status === 'pending').length,
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
