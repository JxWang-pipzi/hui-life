import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { pool, query } from './db.js'
import {
  addLog,
  fail,
  formatTime,
  getUserPermissions,
  hashPassword,
  ok,
  pageResult,
  parseJsonList,
  profileOf,
  requireAuth,
  requirePermission,
  signToken,
} from './helpers.js'

dotenv.config()

const app = express()
const port = Number(process.env.API_PORT || 3000)

app.use(cors())
app.use(express.json())

function mapService(row) {
  const contact = serviceContact(row.id)
  return {
    id: row.id,
    merchantId: row.merchant_id,
    title: row.title,
    category: row.category,
    categoryName: row.category_name,
    price: Number(row.price),
    sales: row.sales,
    rating: Number(row.rating),
    cover: row.cover,
    desc: row.description,
    guarantee: parseJsonList(row.guarantee),
    packages: [
      { name: `${row.title}基础套餐`, price: Number(row.price), duration: '约 1 小时' },
      { name: `${row.title}升级套餐`, price: Number(row.price) + 60, duration: '约 2 小时' },
    ],
    providerName: row.provider_name || contact.providerName,
    providerPhone: row.provider_phone || contact.providerPhone,
    status: row.status,
    createdAt: formatTime(row.created_at),
  }
}

function serviceContact(serviceId) {
  const contacts = {
    101: { providerName: '绿萝家政服务中心', providerPhone: '400-800-1001' },
    102: { providerName: '清风维修清洗', providerPhone: '400-800-1002' },
    103: { providerName: '光影到家摄影', providerPhone: '400-800-1003' },
    104: { providerName: '星火少儿编程', providerPhone: '400-800-1004' },
    105: { providerName: '小鹿美甲护理', providerPhone: '400-800-1005' },
    106: { providerName: '安心水电维修', providerPhone: '400-800-1006' },
  }
  return contacts[serviceId] || { providerName: '惠生活服务商', providerPhone: '400-800-0000' }
}

function mapOrder(row) {
  const contact = serviceContact(row.service_id)
  return {
    id: row.id,
    serviceId: row.service_id,
    serviceTitle: row.service_title,
    userId: row.user_id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    appointmentTime: formatTime(row.appointment_time),
    status: row.status,
    reviewStatus: row.review_status,
    reviewRating: row.review_rating ? Number(row.review_rating) : null,
    afterSaleStatus: row.after_sale_status,
    providerName: row.provider_name || contact.providerName,
    providerPhone: row.provider_phone || contact.providerPhone,
    remark: row.remark,
    createdAt: formatTime(row.created_at),
  }
}

function mapMerchant(row) {
  return {
    id: row.id,
    userId: row.user_id,
    providerName: row.provider_name,
    contactName: row.contact_name,
    phone: row.phone,
    businessCategory: row.business_category,
    licenseNo: row.license_no,
    address: row.address,
    desc: row.description,
    status: row.status,
    auditNote: row.audit_note,
    createdAt: formatTime(row.created_at),
  }
}

async function merchantOfUser(userId) {
  const rows = await query('SELECT * FROM merchants WHERE user_id = :userId ORDER BY id DESC LIMIT 1', { userId })
  return rows[0] || null
}

async function approvedMerchantOfUser(userId) {
  const merchant = await merchantOfUser(userId)
  return merchant?.status === 'approved' ? merchant : null
}

function mapAddress(row) {
  return {
    id: row.id,
    userId: row.user_id,
    contactName: row.contact_name,
    phone: row.phone,
    city: row.city,
    district: row.district,
    detail: row.detail,
    isDefault: Boolean(row.is_default),
  }
}

function mapReview(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    serviceId: row.service_id,
    serviceTitle: row.service_title,
    userId: row.user_id,
    userName: row.user_name,
    rating: row.rating,
    content: row.content,
    tags: parseJsonList(row.tags),
    merchantReply: row.merchant_reply || '',
    repliedAt: formatTime(row.replied_at),
    createdAt: formatTime(row.created_at),
  }
}

function mapAfterSale(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    serviceId: row.service_id,
    serviceTitle: row.service_title,
    userId: row.user_id,
    userName: row.user_name,
    phone: row.phone,
    reason: row.reason,
    status: row.status,
    solution: row.solution,
    createdAt: formatTime(row.created_at),
  }
}

function mapRole(row, permissions = []) {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    desc: row.description,
    permissions,
  }
}

function mapAnnouncement(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    scene: row.scene,
    status: row.status,
    sort: row.sort,
    createdAt: formatTime(row.created_at),
  }
}

function mapCoupon(row) {
  return {
    id: row.id,
    title: row.title,
    thresholdAmount: Number(row.threshold_amount),
    discountAmount: Number(row.discount_amount),
    category: row.category,
    startAt: formatTime(row.start_at),
    endAt: formatTime(row.end_at),
    stock: row.stock,
    status: row.status,
    received: Boolean(row.received),
    createdAt: formatTime(row.created_at),
  }
}

app.get('/health', async (_req, res) => {
  await query('SELECT 1')
  res.json(ok({ status: 'ok' }))
})

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body
  const rows = await query('SELECT * FROM users WHERE username = :username AND password_hash = :passwordHash', {
    username,
    passwordHash: hashPassword(password || ''),
  })
  const user = rows[0]
  if (!user) {
    res.json(fail('账号或密码错误'))
    return
  }
  if (user.status === 'disabled') {
    res.json(fail('账号已被停用'))
    return
  }
  res.json(ok({ token: signToken(user.id), user: await profileOf(user) }))
})

app.post('/auth/register', async (req, res) => {
  const body = req.body
  if (!body.username || !body.password || !body.name || !body.phone) {
    res.json(fail('请完善注册信息'))
    return
  }
  const existing = await query('SELECT id FROM users WHERE username = :username', { username: body.username })
  if (existing.length) {
    res.json(fail('账号已存在'))
    return
  }

  const role = body.role === 'merchant' ? 'merchant' : 'user'
  const roleId = role === 'merchant' ? 5 : 4
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [userResult] = await conn.execute(
      `INSERT INTO users (username, password_hash, name, role, phone, status)
       VALUES (?, SHA2(?, 256), ?, ?, ?, 'enabled')`,
      [body.username, body.password, body.name, role, body.phone],
    )
    await conn.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userResult.insertId, roleId])
    if (role === 'merchant') {
      await conn.execute(
        `INSERT INTO merchants (user_id, provider_name, contact_name, phone, business_category, license_no, address, description, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          userResult.insertId,
          body.providerName || `${body.name}的商家`,
          body.contactName || body.name,
          body.phone,
          body.businessCategory || 'cleaning',
          body.licenseNo || `PENDING-${userResult.insertId}`,
          body.address || '待完善经营地址',
          body.desc || '商家注册资料待审核。',
        ],
      )
    }
    await conn.commit()
    const userRows = await query('SELECT * FROM users WHERE id = :id', { id: userResult.insertId })
    res.json(ok({ token: signToken(userResult.insertId), user: await profileOf(userRows[0]) }))
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
})

app.get('/auth/profile', requireAuth(async (req, res) => {
  res.json(ok(req.profile))
}))

app.get('/services', async (req, res) => {
  const { keyword = '', category = '', sort = '' } = req.query
  let rows = await query(
    `SELECT s.*, m.provider_name, m.phone AS provider_phone
     FROM services s
     LEFT JOIN merchants m ON m.id = s.merchant_id
     WHERE s.status = "enabled"
     ORDER BY s.id DESC`,
  )
  if (keyword) rows = rows.filter((item) => item.title.includes(keyword) || item.description.includes(keyword))
  if (category) rows = rows.filter((item) => item.category === category)
  if (sort === 'priceAsc') rows.sort((a, b) => Number(a.price) - Number(b.price))
  if (sort === 'salesDesc') rows.sort((a, b) => b.sales - a.sales)
  res.json(ok(pageResult(rows.map(mapService), req.query.page, req.query.pageSize)))
})

app.get('/services/hot', async (_req, res) => {
  const rows = await query(
    `SELECT s.*, m.provider_name, m.phone AS provider_phone
     FROM services s
     LEFT JOIN merchants m ON m.id = s.merchant_id
     WHERE s.status = "enabled"
     ORDER BY s.sales DESC LIMIT 4`,
  )
  res.json(ok(rows.map(mapService)))
})

app.get('/services/:id', async (req, res) => {
  const rows = await query(
    `SELECT s.*, m.provider_name, m.phone AS provider_phone
     FROM services s
     LEFT JOIN merchants m ON m.id = s.merchant_id
     WHERE s.id = :id`,
    { id: req.params.id },
  )
  res.json(rows[0] ? ok(mapService(rows[0])) : fail('服务不存在'))
})

app.get('/reviews', async (req, res) => {
  let rows = await query('SELECT * FROM reviews ORDER BY id DESC')
  if (req.query.serviceId) rows = rows.filter((item) => item.service_id === Number(req.query.serviceId))
  res.json(ok(pageResult(rows.map(mapReview), req.query.page, req.query.pageSize)))
})

app.get('/announcements', async (req, res) => {
  const rows = await query(
    `SELECT * FROM announcements
     WHERE status = 'published' AND (:scene = '' OR scene = :scene)
     ORDER BY sort DESC, id DESC`,
    { scene: req.query.scene || '' },
  )
  res.json(ok(rows.map(mapAnnouncement)))
})

app.get('/coupons', requireAuth(async (req, res) => {
  const rows = await query(
    `SELECT c.*, uc.id AS received
     FROM coupons c
     LEFT JOIN user_coupons uc ON uc.coupon_id = c.id AND uc.user_id = :userId
     WHERE c.status = 'enabled'
     ORDER BY c.id DESC`,
    { userId: req.user.id },
  )
  res.json(ok(rows.map(mapCoupon)))
}))

app.post('/coupons/:id/receive', requireAuth(async (req, res) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // 行锁锁定优惠券行，防止并发超发
    const [couponRows] = await conn.execute(
      'SELECT * FROM coupons WHERE id = ? AND status = "enabled" FOR UPDATE',
      [req.params.id],
    )
    const coupon = couponRows[0]
    if (!coupon) {
      await conn.rollback()
      res.json(fail('优惠券不存在'))
      return
    }

    // 同事务内检查是否已领取
    const [existing] = await conn.execute(
      'SELECT id FROM user_coupons WHERE user_id = ? AND coupon_id = ? LIMIT 1',
      [req.user.id, req.params.id],
    )
    if (existing.length) {
      await conn.rollback()
      res.json(fail('已领取该优惠券'))
      return
    }

    // 并发安全减库存：只有 stock > 0 才扣减，靠受影响行数判断
    const [updateResult] = await conn.execute(
      'UPDATE coupons SET stock = stock - 1 WHERE id = ? AND stock > 0',
      [req.params.id],
    )
    if (updateResult.affectedRows === 0) {
      await conn.rollback()
      res.json(fail('优惠券已领完'))
      return
    }

    await conn.execute('INSERT INTO user_coupons (user_id, coupon_id) VALUES (?, ?)', [
      req.user.id,
      req.params.id,
    ])
    await conn.commit()
    res.json(ok(true))
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}))

app.get('/my-coupons', requireAuth(async (req, res) => {
  const rows = await query(
    `SELECT c.*, uc.id AS received, uc.status AS user_coupon_status
     FROM user_coupons uc
     JOIN coupons c ON c.id = uc.coupon_id
     WHERE uc.user_id = :userId
     ORDER BY uc.id DESC`,
    { userId: req.user.id },
  )
  res.json(ok(rows.map(mapCoupon)))
}))

app.post('/merchant/applications', requireAuth(async (req, res) => {
  const existing = await merchantOfUser(req.user.id)
  if (existing) {
    res.json(fail(existing.status === 'approved' ? '当前账号已是入驻商家' : '入驻申请已提交，请等待审核'))
    return
  }
  const body = req.body
  const result = await query(
    `INSERT INTO merchants (user_id, provider_name, contact_name, phone, business_category, license_no, address, description, status)
     VALUES (:userId, :providerName, :contactName, :phone, :businessCategory, :licenseNo, :address, :desc, 'pending')`,
    { ...body, userId: req.user.id },
  )
  await addLog(req, '提交商家入驻', body.providerName, `经营类目：${body.businessCategory}`)
  res.json(ok({ id: result.insertId, status: 'pending' }))
}))

app.get('/merchant/profile', requireAuth(async (req, res) => {
  const merchant = await merchantOfUser(req.user.id)
  res.json(ok(merchant ? mapMerchant(merchant) : null))
}))

app.get('/merchant/dashboard', requirePermission('merchant:workbench', async (req, res) => {
  const merchant = await approvedMerchantOfUser(req.user.id)
  if (!merchant) {
    res.json(fail('商家账号未审核通过'))
    return
  }
  const rows = await query(
    `SELECT
      (SELECT COUNT(*) FROM services WHERE merchant_id = :merchantId) AS serviceCount,
      (SELECT COUNT(*) FROM orders o JOIN services s ON s.id = o.service_id WHERE s.merchant_id = :merchantId) AS orderCount,
      (SELECT COUNT(*) FROM orders o JOIN services s ON s.id = o.service_id WHERE s.merchant_id = :merchantId AND o.status = 'pending') AS pendingCount,
      (SELECT COUNT(*) FROM reviews r JOIN services s ON s.id = r.service_id WHERE s.merchant_id = :merchantId) AS reviewCount,
      (SELECT ROUND(AVG(r.rating), 1) FROM reviews r JOIN services s ON s.id = r.service_id WHERE s.merchant_id = :merchantId) AS rating`,
    { merchantId: merchant.id },
  )
  res.json(ok({ merchant: mapMerchant(merchant), ...rows[0], rating: Number(rows[0].rating || 0) }))
}))

app.get('/merchant/services', requirePermission('merchant:service', async (req, res) => {
  const merchant = await approvedMerchantOfUser(req.user.id)
  if (!merchant) {
    res.json(fail('商家账号未审核通过'))
    return
  }
  const rows = await query(
    `SELECT s.*, m.provider_name, m.phone AS provider_phone
     FROM services s
     LEFT JOIN merchants m ON m.id = s.merchant_id
     WHERE s.merchant_id = :merchantId
     ORDER BY s.id DESC`,
    { merchantId: merchant.id },
  )
  res.json(ok(rows.map(mapService)))
}))

app.post('/merchant/services', requirePermission('merchant:service', async (req, res) => {
  const merchant = await approvedMerchantOfUser(req.user.id)
  if (!merchant) {
    res.json(fail('商家账号未审核通过'))
    return
  }
  const body = req.body
  const result = await query(
    `INSERT INTO services (merchant_id, title, category, category_name, price, sales, rating, cover, description, guarantee, status)
     VALUES (:merchantId, :title, :category, :categoryName, :price, 0, 4.8, :cover, :desc,
       JSON_ARRAY('商家接单后电话确认','平台售后保障','服务完成后可评价'), :status)`,
    {
      ...body,
      merchantId: merchant.id,
      price: Number(body.price),
      cover: body.cover || 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
      status: body.status || 'enabled',
    },
  )
  await addLog(req, '商家新增服务', body.title, `${merchant.provider_name} 新增服务 ¥${body.price}`)
  res.json(ok({ id: result.insertId }))
}))

app.put('/merchant/services/:id', requirePermission('merchant:service', async (req, res) => {
  const merchant = await approvedMerchantOfUser(req.user.id)
  if (!merchant) {
    res.json(fail('商家账号未审核通过'))
    return
  }
  const body = req.body
  const existing = await query('SELECT id FROM services WHERE id = :id AND merchant_id = :merchantId', {
    id: req.params.id,
    merchantId: merchant.id,
  })
  if (!existing.length) {
    res.json(fail('服务不存在或无权操作'))
    return
  }
  await query(
    `UPDATE services SET title = :title, category = :category, category_name = :categoryName,
     price = :price, cover = :cover, description = :desc, status = :status
     WHERE id = :id AND merchant_id = :merchantId`,
    { ...body, id: req.params.id, merchantId: merchant.id, price: Number(body.price), status: body.status || 'enabled' },
  )
  await addLog(req, '商家编辑服务', body.title, `${merchant.provider_name} 更新服务信息`)
  res.json(ok(true))
}))

app.get('/merchant/orders', requirePermission('merchant:order', async (req, res) => {
  const merchant = await approvedMerchantOfUser(req.user.id)
  if (!merchant) {
    res.json(fail('商家账号未审核通过'))
    return
  }
  const rows = await query(
    `SELECT o.*, r.rating AS review_rating, m.provider_name, m.phone AS provider_phone
     FROM orders o
     JOIN services s ON s.id = o.service_id
     LEFT JOIN reviews r ON r.order_id = o.id
     LEFT JOIN merchants m ON m.id = s.merchant_id
     WHERE s.merchant_id = :merchantId
     ORDER BY o.id DESC`,
    { merchantId: merchant.id },
  )
  res.json(ok(pageResult(rows.map(mapOrder), req.query.page, req.query.pageSize)))
}))

app.put('/merchant/orders/:id', requirePermission('merchant:order', async (req, res) => {
  const merchant = await approvedMerchantOfUser(req.user.id)
  if (!merchant) {
    res.json(fail('商家账号未审核通过'))
    return
  }
  if (!['confirmed', 'completed', 'canceled'].includes(req.body.status)) {
    res.json(fail('不支持的订单状态'))
    return
  }
  const rows = await query(
    `SELECT o.id, o.service_title
     FROM orders o
     JOIN services s ON s.id = o.service_id
     WHERE o.id = :id AND s.merchant_id = :merchantId`,
    { id: req.params.id, merchantId: merchant.id },
  )
  if (!rows.length) {
    res.json(fail('订单不存在或无权操作'))
    return
  }
  await query('UPDATE orders SET status = :status WHERE id = :id', { id: req.params.id, status: req.body.status })
  await addLog(req, '商家处理订单', `订单 #${req.params.id}`, `状态更新为 ${req.body.status}`)
  res.json(ok(true))
}))

app.get('/merchant/reviews', requirePermission('merchant:review', async (req, res) => {
  const merchant = await approvedMerchantOfUser(req.user.id)
  if (!merchant) {
    res.json(fail('商家账号未审核通过'))
    return
  }
  const rows = await query(
    `SELECT r.*
     FROM reviews r
     JOIN services s ON s.id = r.service_id
     WHERE s.merchant_id = :merchantId
     ORDER BY r.id DESC`,
    { merchantId: merchant.id },
  )
  res.json(ok(rows.map(mapReview)))
}))

app.put('/merchant/reviews/:id/reply', requirePermission('merchant:review', async (req, res) => {
  const merchant = await approvedMerchantOfUser(req.user.id)
  if (!merchant) {
    res.json(fail('商家账号未审核通过'))
    return
  }
  if (!req.body.reply?.trim()) {
    res.json(fail('请填写回复内容'))
    return
  }
  const rows = await query(
    `SELECT r.id, r.service_title
     FROM reviews r
     JOIN services s ON s.id = r.service_id
     WHERE r.id = :id AND s.merchant_id = :merchantId`,
    { id: req.params.id, merchantId: merchant.id },
  )
  if (!rows.length) {
    res.json(fail('评价不存在或无权回复'))
    return
  }
  await query('UPDATE reviews SET merchant_reply = :reply, replied_at = NOW() WHERE id = :id', {
    id: req.params.id,
    reply: req.body.reply,
  })
  await addLog(req, '商家回复评价', rows[0].service_title, req.body.reply)
  res.json(ok(true))
}))

app.get('/merchant/after-sales', requirePermission('merchant:after-sale', async (req, res) => {
  const merchant = await approvedMerchantOfUser(req.user.id)
  if (!merchant) {
    res.json(fail('商家账号未审核通过'))
    return
  }
  let rows = await query(
    `SELECT a.*
     FROM after_sales a
     JOIN services s ON s.id = a.service_id
     WHERE s.merchant_id = :merchantId
     ORDER BY a.id DESC`,
    { merchantId: merchant.id },
  )
  if (req.query.keyword) {
    rows = rows.filter((item) =>
      item.service_title.includes(req.query.keyword) || item.user_name.includes(req.query.keyword) || item.phone.includes(req.query.keyword),
    )
  }
  if (req.query.status) rows = rows.filter((item) => item.status === req.query.status)
  res.json(ok(pageResult(rows.map(mapAfterSale), req.query.page, req.query.pageSize)))
}))

app.put('/merchant/after-sales/:id', requirePermission('merchant:after-sale', async (req, res) => {
  const merchant = await approvedMerchantOfUser(req.user.id)
  if (!merchant) {
    res.json(fail('商家账号未审核通过'))
    return
  }
  const rows = await query(
    `SELECT a.*
     FROM after_sales a
     JOIN services s ON s.id = a.service_id
     WHERE a.id = :id AND s.merchant_id = :merchantId`,
    { id: req.params.id, merchantId: merchant.id },
  )
  const afterSale = rows[0]
  if (!afterSale) {
    res.json(fail('售后单不存在或无权操作'))
    return
  }
  await query('UPDATE after_sales SET status = :status, solution = :solution WHERE id = :id', {
    id: req.params.id,
    status: req.body.status,
    solution: req.body.solution || '',
  })
  await query('UPDATE orders SET after_sale_status = :status WHERE id = :orderId', {
    status: req.body.status,
    orderId: afterSale.order_id,
  })
  await addLog(req, '商家处理售后', `售后 #${req.params.id}`, `状态更新为 ${req.body.status}`)
  res.json(ok(true))
}))

app.get('/addresses', requireAuth(async (req, res) => {
  const rows = await query('SELECT * FROM addresses WHERE user_id = :userId ORDER BY is_default DESC, id DESC', {
    userId: req.user.id,
  })
  res.json(ok(rows.map(mapAddress)))
}))

app.post('/addresses', requireAuth(async (req, res) => {
  const body = req.body
  if (body.isDefault) await query('UPDATE addresses SET is_default = 0 WHERE user_id = :userId', { userId: req.user.id })
  const result = await query(
    `INSERT INTO addresses (user_id, contact_name, phone, city, district, detail, is_default)
     VALUES (:userId, :contactName, :phone, :city, :district, :detail, :isDefault)`,
    { ...body, userId: req.user.id, isDefault: body.isDefault ? 1 : 0 },
  )
  res.json(ok({ id: result.insertId, ...body }))
}))

app.put('/addresses/:id', requireAuth(async (req, res) => {
  const body = req.body
  if (body.isDefault) await query('UPDATE addresses SET is_default = 0 WHERE user_id = :userId', { userId: req.user.id })
  await query(
    `UPDATE addresses SET contact_name = :contactName, phone = :phone, city = :city,
     district = :district, detail = :detail, is_default = :isDefault
     WHERE id = :id AND user_id = :userId`,
    { ...body, id: req.params.id, userId: req.user.id, isDefault: body.isDefault ? 1 : 0 },
  )
  res.json(ok(true))
}))

app.delete('/addresses/:id', requireAuth(async (req, res) => {
  await query('DELETE FROM addresses WHERE id = :id AND user_id = :userId', { id: req.params.id, userId: req.user.id })
  res.json(ok(true))
}))

app.get('/orders', requireAuth(async (req, res) => {
  const rows = await query(
    `SELECT o.*, r.rating AS review_rating, m.provider_name, m.phone AS provider_phone
     FROM orders o
     LEFT JOIN reviews r ON r.order_id = o.id
     LEFT JOIN services s ON s.id = o.service_id
     LEFT JOIN merchants m ON m.id = s.merchant_id
     WHERE (:isAdmin = 1 OR o.user_id = :userId)
     ORDER BY o.id DESC`,
    { isAdmin: req.user.role === 'admin' ? 1 : 0, userId: req.user.id },
  )
  res.json(ok(pageResult(rows.map(mapOrder), req.query.page, req.query.pageSize)))
}))

app.post('/orders', requireAuth(async (req, res) => {
  const body = req.body
  const serviceRows = await query('SELECT * FROM services WHERE id = :id', { id: body.serviceId })
  const service = serviceRows[0]
  if (!service) {
    res.json(fail('服务不存在'))
    return
  }
  const result = await query(
    `INSERT INTO orders (service_id, service_title, user_id, customer_name, phone, address, appointment_time, remark)
     VALUES (:serviceId, :serviceTitle, :userId, :customerName, :phone, :address, :appointmentTime, :remark)`,
    {
      serviceId: service.id,
      serviceTitle: service.title,
      userId: req.user.id,
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      appointmentTime: body.appointmentTime,
      remark: body.remark || '',
    },
  )
  await query('UPDATE services SET sales = sales + 1 WHERE id = :id', { id: service.id })
  res.json(ok({ id: result.insertId }))
}))

app.put('/orders/:id/cancel', requireAuth(async (req, res) => {
  const rows = await query('SELECT * FROM orders WHERE id = :id AND user_id = :userId', { id: req.params.id, userId: req.user.id })
  const order = rows[0]
  if (!order) {
    res.json(fail('订单不存在'))
    return
  }
  if (!['pending', 'confirmed'].includes(order.status)) {
    res.json(fail('当前订单状态不可取消'))
    return
  }
  await query('UPDATE orders SET status = "canceled" WHERE id = :id', { id: req.params.id })
  res.json(ok(true))
}))

app.post('/orders/:id/review', requireAuth(async (req, res) => {
  const rows = await query('SELECT * FROM orders WHERE id = :id AND user_id = :userId', { id: req.params.id, userId: req.user.id })
  const order = rows[0]
  if (!order) {
    res.json(fail('订单不存在'))
    return
  }
  if (order.status !== 'completed') {
    res.json(fail('订单完成后才能评价'))
    return
  }
  if (order.review_status === 'done') {
    res.json(fail('该订单已评价'))
    return
  }
  await query(
    `INSERT INTO reviews (order_id, service_id, service_title, user_id, user_name, rating, content, tags)
     VALUES (:orderId, :serviceId, :serviceTitle, :userId, :userName, :rating, :content, :tags)`,
    {
      orderId: order.id,
      serviceId: order.service_id,
      serviceTitle: order.service_title,
      userId: req.user.id,
      userName: req.user.name,
      rating: req.body.rating,
      content: req.body.content,
      tags: JSON.stringify(req.body.tags || []),
    },
  )
  await query('UPDATE orders SET review_status = "done" WHERE id = :id', { id: order.id })
  await query(
    `UPDATE services s
     SET rating = (
       SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.service_id = s.id
     )
     WHERE s.id = :serviceId`,
    { serviceId: order.service_id },
  )
  res.json(ok(true))
}))

app.post('/orders/:id/after-sales', requireAuth(async (req, res) => {
  const rows = await query('SELECT * FROM orders WHERE id = :id AND user_id = :userId', { id: req.params.id, userId: req.user.id })
  const order = rows[0]
  if (!order) {
    res.json(fail('订单不存在'))
    return
  }
  if (!['confirmed', 'completed'].includes(order.status)) {
    res.json(fail('当前订单状态不可申请售后'))
    return
  }
  await query(
    `INSERT INTO after_sales (order_id, service_id, service_title, user_id, user_name, phone, reason)
     VALUES (:orderId, :serviceId, :serviceTitle, :userId, :userName, :phone, :reason)`,
    {
      orderId: order.id,
      serviceId: order.service_id,
      serviceTitle: order.service_title,
      userId: req.user.id,
      userName: req.user.name,
      phone: order.phone,
      reason: req.body.reason,
    },
  )
  await query('UPDATE orders SET after_sale_status = "submitted" WHERE id = :id', { id: order.id })
  res.json(ok(true))
}))

app.get('/admin/stats', requirePermission('dashboard:view', async (_req, res) => {
  const rows = await query(
    `SELECT
      (SELECT COUNT(*) FROM services) AS serviceCount,
      (SELECT COUNT(*) FROM users) AS userCount,
      (SELECT COUNT(*) FROM orders) AS orderCount,
      (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pendingCount,
      (SELECT COUNT(*) FROM reviews) AS reviewCount,
      (SELECT COUNT(*) FROM after_sales WHERE status IN ('submitted','processing')) AS afterSalePendingCount,
      (SELECT COUNT(*) FROM roles) AS roleCount,
      (SELECT COUNT(*) FROM operation_logs) AS logCount,
      (SELECT COUNT(*) FROM announcements) AS announcementCount,
      (SELECT COUNT(*) FROM coupons) AS couponCount`,
  )
  const categories = await query('SELECT category_name AS name, COUNT(*) AS value FROM services GROUP BY category_name')
  res.json(ok({ ...rows[0], trend: [12, 18, 16, 24, 31, 28, 36], categories }))
}))

app.get('/admin/services', requirePermission('service:manage', async (req, res) => {
  let rows = await query(
    `SELECT s.*, m.provider_name, m.phone AS provider_phone
     FROM services s
     LEFT JOIN merchants m ON m.id = s.merchant_id
     ORDER BY s.id DESC`,
  )
  const { keyword = '', category = '', sort = '' } = req.query
  if (keyword) rows = rows.filter((item) => item.title.includes(keyword) || item.description.includes(keyword))
  if (category) rows = rows.filter((item) => item.category === category)
  if (sort === 'priceAsc') rows.sort((a, b) => Number(a.price) - Number(b.price))
  if (sort === 'salesDesc') rows.sort((a, b) => b.sales - a.sales)
  res.json(ok(pageResult(rows.map(mapService), req.query.page, req.query.pageSize)))
}))

app.post('/admin/services', requirePermission('service:manage', async (req, res) => {
  const body = req.body
  const result = await query(
    `INSERT INTO services (title, category, category_name, price, sales, rating, cover, description, guarantee)
     VALUES (:title, :category, :categoryName, :price, 0, 4.8, :cover, :desc, JSON_ARRAY('2 小时内确认预约','服务不满意可申请售后'))`,
    {
      ...body,
      price: Number(body.price),
      cover: body.cover || 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    },
  )
  await addLog(req, '新增服务', body.title, `新增服务价格 ¥${body.price}`)
  res.json(ok({ id: result.insertId }))
}))

app.put('/admin/services/:id', requirePermission('service:manage', async (req, res) => {
  const body = req.body
  await query(
    `UPDATE services SET title = :title, category = :category, category_name = :categoryName,
     price = :price, cover = :cover, description = :desc WHERE id = :id`,
    { ...body, id: req.params.id, price: Number(body.price) },
  )
  await addLog(req, '编辑服务', body.title, '更新服务基础信息')
  res.json(ok(true))
}))

app.delete('/admin/services/:id', requirePermission('service:manage', async (req, res) => {
  await query('DELETE FROM services WHERE id = :id', { id: req.params.id })
  await addLog(req, '删除服务', `服务 #${req.params.id}`, '从服务列表中删除')
  res.json(ok(true))
}))

app.get('/admin/orders', requirePermission('order:manage', async (req, res) => {
  let rows = await query(
    `SELECT o.*, r.rating AS review_rating, m.provider_name, m.phone AS provider_phone
     FROM orders o
     LEFT JOIN reviews r ON r.order_id = o.id
     LEFT JOIN services s ON s.id = o.service_id
     LEFT JOIN merchants m ON m.id = s.merchant_id
     ORDER BY o.id DESC`,
  )
  if (req.query.keyword) {
    rows = rows.filter((item) => item.service_title.includes(req.query.keyword) || item.customer_name.includes(req.query.keyword))
  }
  if (req.query.status) rows = rows.filter((item) => item.status === req.query.status)
  res.json(ok(pageResult(rows.map(mapOrder), req.query.page, req.query.pageSize)))
}))

app.put('/admin/orders/:id', requirePermission('order:manage', async (req, res) => {
  await query('UPDATE orders SET status = :status WHERE id = :id', { id: req.params.id, status: req.body.status })
  await addLog(req, '修改订单状态', `订单 #${req.params.id}`, `状态更新为 ${req.body.status}`)
  res.json(ok(true))
}))

app.get('/admin/after-sales', requirePermission('after-sale:manage', async (req, res) => {
  let rows = await query('SELECT * FROM after_sales ORDER BY id DESC')
  if (req.query.keyword) {
    rows = rows.filter((item) =>
      item.service_title.includes(req.query.keyword) || item.user_name.includes(req.query.keyword) || item.phone.includes(req.query.keyword),
    )
  }
  if (req.query.status) rows = rows.filter((item) => item.status === req.query.status)
  res.json(ok(pageResult(rows.map(mapAfterSale), req.query.page, req.query.pageSize)))
}))

app.put('/admin/after-sales/:id', requirePermission('after-sale:manage', async (req, res) => {
  await query('UPDATE after_sales SET status = :status, solution = :solution WHERE id = :id', {
    id: req.params.id,
    status: req.body.status,
    solution: req.body.solution || '',
  })
  const rows = await query('SELECT order_id FROM after_sales WHERE id = :id', { id: req.params.id })
  if (rows[0]) await query('UPDATE orders SET after_sale_status = :status WHERE id = :orderId', { status: req.body.status, orderId: rows[0].order_id })
  await addLog(req, '处理售后', `售后 #${req.params.id}`, `状态更新为 ${req.body.status}`)
  res.json(ok(true))
}))

app.get('/admin/users', requirePermission('user:manage', async (req, res) => {
  const users = await query('SELECT * FROM users ORDER BY id')
  const profiles = await Promise.all(users.map(profileOf))
  res.json(ok(pageResult(profiles, req.query.page, req.query.pageSize)))
}))

app.put('/admin/users/:id/roles', requirePermission('user:manage', async (req, res) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    await conn.execute('DELETE FROM user_roles WHERE user_id = ?', [req.params.id])
    for (const roleId of req.body.roleIds || []) {
      await conn.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [req.params.id, roleId])
    }
    await conn.commit()
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
  await addLog(req, '分配用户角色', `用户 #${req.params.id}`, `角色 ID：${(req.body.roleIds || []).join(', ')}`)
  res.json(ok(true))
}))

app.put('/admin/users/:id', requirePermission('user:manage', async (req, res) => {
  await query('UPDATE users SET status = :status WHERE id = :id', { id: req.params.id, status: req.body.status })
  await addLog(req, '修改用户状态', `用户 #${req.params.id}`, `状态更新为 ${req.body.status}`)
  res.json(ok(true))
}))

app.get('/admin/permissions', requirePermission('role:manage', async (_req, res) => {
  const rows = await query('SELECT code, name, permission_group AS `group` FROM permissions ORDER BY id')
  res.json(ok(rows))
}))

app.get('/admin/roles', requirePermission('role:manage', async (req, res) => {
  const roles = await query('SELECT * FROM roles ORDER BY id')
  const rolePermissions = await query(
    `SELECT r.id AS role_id, p.code
     FROM roles r
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id`,
  )
  const list = roles.map((role) => mapRole(role, rolePermissions.filter((item) => item.role_id === role.id && item.code).map((item) => item.code)))
  res.json(ok(pageResult(list, req.query.page, req.query.pageSize)))
}))

async function saveRolePermissions(roleId, permissionCodes) {
  await query('DELETE FROM role_permissions WHERE role_id = :roleId', { roleId })
  for (const code of permissionCodes || []) {
    await query(
      `INSERT INTO role_permissions (role_id, permission_id)
       SELECT :roleId, id FROM permissions WHERE code = :code`,
      { roleId, code },
    )
  }
}

app.post('/admin/roles', requirePermission('role:manage', async (req, res) => {
  const result = await query('INSERT INTO roles (name, code, description) VALUES (:name, :code, :desc)', req.body)
  await saveRolePermissions(result.insertId, req.body.permissions)
  await addLog(req, '新增角色', req.body.name, `权限数：${req.body.permissions?.length || 0}`)
  res.json(ok({ id: result.insertId }))
}))

app.put('/admin/roles/:id', requirePermission('role:manage', async (req, res) => {
  await query('UPDATE roles SET name = :name, code = :code, description = :desc WHERE id = :id', { ...req.body, id: req.params.id })
  await saveRolePermissions(req.params.id, req.body.permissions)
  await addLog(req, '编辑角色', req.body.name, `权限数：${req.body.permissions?.length || 0}`)
  res.json(ok(true))
}))

app.delete('/admin/roles/:id', requirePermission('role:manage', async (req, res) => {
  if ([1, 4].includes(Number(req.params.id))) {
    res.json(fail('内置角色不可删除'))
    return
  }
  const used = await query('SELECT user_id FROM user_roles WHERE role_id = :id LIMIT 1', { id: req.params.id })
  if (used.length) {
    res.json(fail('该角色已被用户使用'))
    return
  }
  await query('DELETE FROM roles WHERE id = :id', { id: req.params.id })
  await addLog(req, '删除角色', `角色 #${req.params.id}`, '从角色列表中删除')
  res.json(ok(true))
}))

app.get('/admin/logs', requirePermission('log:view', async (req, res) => {
  let rows = await query('SELECT * FROM operation_logs ORDER BY id DESC')
  if (req.query.keyword) {
    rows = rows.filter((item) => item.operator.includes(req.query.keyword) || item.action.includes(req.query.keyword) || item.target.includes(req.query.keyword))
  }
  res.json(ok(pageResult(rows.map((item) => ({ ...item, createdAt: formatTime(item.created_at) })), req.query.page, req.query.pageSize)))
}))

app.get('/admin/announcements', requirePermission('announcement:manage', async (req, res) => {
  let rows = await query('SELECT * FROM announcements ORDER BY sort DESC, id DESC')
  if (req.query.keyword) rows = rows.filter((item) => item.title.includes(req.query.keyword) || item.content.includes(req.query.keyword))
  if (req.query.status) rows = rows.filter((item) => item.status === req.query.status)
  res.json(ok(pageResult(rows.map(mapAnnouncement), req.query.page, req.query.pageSize)))
}))

app.post('/admin/announcements', requirePermission('announcement:manage', async (req, res) => {
  const result = await query(
    `INSERT INTO announcements (title, content, scene, status, sort)
     VALUES (:title, :content, :scene, :status, :sort)`,
    req.body,
  )
  await addLog(req, '发布公告', req.body.title, `状态：${req.body.status}`)
  res.json(ok({ id: result.insertId }))
}))

app.put('/admin/announcements/:id', requirePermission('announcement:manage', async (req, res) => {
  await query(
    `UPDATE announcements SET title = :title, content = :content, scene = :scene,
     status = :status, sort = :sort WHERE id = :id`,
    { ...req.body, id: req.params.id },
  )
  await addLog(req, '编辑公告', req.body.title, `状态：${req.body.status}`)
  res.json(ok(true))
}))

app.delete('/admin/announcements/:id', requirePermission('announcement:manage', async (req, res) => {
  await query('DELETE FROM announcements WHERE id = :id', { id: req.params.id })
  await addLog(req, '删除公告', `公告 #${req.params.id}`, '从公告列表中删除')
  res.json(ok(true))
}))

app.get('/admin/coupons', requirePermission('coupon:manage', async (req, res) => {
  let rows = await query('SELECT * FROM coupons ORDER BY id DESC')
  if (req.query.keyword) rows = rows.filter((item) => item.title.includes(req.query.keyword))
  if (req.query.status) rows = rows.filter((item) => item.status === req.query.status)
  res.json(ok(pageResult(rows.map(mapCoupon), req.query.page, req.query.pageSize)))
}))

app.post('/admin/coupons', requirePermission('coupon:manage', async (req, res) => {
  const result = await query(
    `INSERT INTO coupons (title, threshold_amount, discount_amount, category, start_at, end_at, stock, status)
     VALUES (:title, :thresholdAmount, :discountAmount, :category, :startAt, :endAt, :stock, :status)`,
    req.body,
  )
  await addLog(req, '新增优惠券', req.body.title, `库存 ${req.body.stock} 张`)
  res.json(ok({ id: result.insertId }))
}))

app.put('/admin/coupons/:id', requirePermission('coupon:manage', async (req, res) => {
  await query(
    `UPDATE coupons SET title = :title, threshold_amount = :thresholdAmount,
     discount_amount = :discountAmount, category = :category, start_at = :startAt,
     end_at = :endAt, stock = :stock, status = :status WHERE id = :id`,
    { ...req.body, id: req.params.id },
  )
  await addLog(req, '编辑优惠券', req.body.title, `库存 ${req.body.stock} 张`)
  res.json(ok(true))
}))

app.delete('/admin/coupons/:id', requirePermission('coupon:manage', async (req, res) => {
  await query('DELETE FROM coupons WHERE id = :id', { id: req.params.id })
  await addLog(req, '删除优惠券', `优惠券 #${req.params.id}`, '从优惠券列表中删除')
  res.json(ok(true))
}))

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json(fail(error.message || '服务端异常', 500))
})

app.listen(port, () => {
  console.warn(`API server running at http://localhost:${port}`)
})
