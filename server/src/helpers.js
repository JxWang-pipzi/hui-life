import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { query } from './db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function ok(data = null) {
  return { code: 0, data, message: 'ok' }
}

export function fail(message, code = -1) {
  return { code, data: null, message }
}

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function formatTime(value) {
  if (!value) return ''
  return String(value).replace('T', ' ').slice(0, 16)
}

export function pageResult(list, page = 1, pageSize = 8) {
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

export function parseJsonList(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

export async function getUserById(id) {
  const rows = await query('SELECT * FROM users WHERE id = :id', { id })
  return rows[0] || null
}

export async function getUserByToken(req) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return null
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET)
    return getUserById(Number(payload.sub))
  } catch {
    return null
  }
}

export async function getUserRoles(userId) {
  return query(
    `SELECT r.id, r.name, r.code, r.description AS \`desc\`
     FROM roles r
     JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = :userId
     ORDER BY r.id`,
    { userId },
  )
}

export async function getUserPermissions(userId) {
  const rows = await query(
    `SELECT DISTINCT p.code
     FROM permissions p
     JOIN role_permissions rp ON rp.permission_id = p.id
     JOIN user_roles ur ON ur.role_id = rp.role_id
     WHERE ur.user_id = :userId`,
    { userId },
  )
  return rows.map((item) => item.code)
}

export async function profileOf(user) {
  const roles = await getUserRoles(user.id)
  const permissions = await getUserPermissions(user.id)
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    roleIds: roles.map((item) => item.id),
    roles,
    phone: user.phone,
    status: user.status,
    permissions,
  }
}

export function requireAuth(handler) {
  return async (req, res, next) => {
    try {
      const user = await getUserByToken(req)
      if (!user) {
        res.status(401).json(fail('未登录', 401))
        return
      }
      req.user = user
      req.profile = await profileOf(user)
      await handler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export function requirePermission(permission, handler) {
  return requireAuth(async (req, res, next) => {
    if (!req.profile.permissions.includes(permission)) {
      res.status(403).json(fail('无权访问该功能', 403))
      return
    }
    await handler(req, res, next)
  })
}

export async function addLog(req, action, target, detail) {
  const operator = req.user?.name || '系统'
  await query(
    `INSERT INTO operation_logs (operator, action, target, detail)
     VALUES (:operator, :action, :target, :detail)`,
    { operator, action, target, detail },
  )
}
