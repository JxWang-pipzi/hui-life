export const categories = [
  { label: '家政保洁', value: 'cleaning', icon: 'home' },
  { label: '维修清洗', value: 'repair', icon: 'gear' },
  { label: '摄影拍摄', value: 'photo', icon: 'camera' },
  { label: '兴趣课程', value: 'course', icon: 'compose' },
  { label: '美容护理', value: 'beauty', icon: 'heart' },
]

export const services = [
  {
    id: 101,
    title: '家庭深度保洁',
    category: 'cleaning',
    categoryName: '家政保洁',
    price: 168,
    sales: 268,
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    desc: '厨房、卫生间、客厅、卧室全屋清洁，适合入住前后和节假日大扫除。',
    guarantee: ['2 小时内确认预约', '服务不满意可申请售后', '工具耗材由服务商提供'],
    packages: [
      { name: '标准保洁', duration: '2 小时上门服务', price: 168 },
      { name: '深度保洁', duration: '4 小时全屋重点清洁', price: 298 },
    ],
    providerName: '绿萝家政服务中心',
    providerPhone: '400-800-1001',
    status: 'enabled',
  },
  {
    id: 102,
    title: '空调清洗维护',
    category: 'repair',
    categoryName: '维修清洗',
    price: 129,
    sales: 193,
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    desc: '挂机、柜机基础清洗，包含滤网、外壳、蒸发器清洁和运行检测。',
    guarantee: ['上门前电话确认', '清洗后现场试机', '异常问题可售后复核'],
    packages: [
      { name: '挂机清洗', duration: '单台挂机基础清洗', price: 129 },
      { name: '柜机清洗', duration: '单台柜机深度清洗', price: 189 },
    ],
    providerName: '清风维修清洗',
    providerPhone: '400-800-1002',
    status: 'enabled',
  },
  {
    id: 103,
    title: '上门证件照拍摄',
    category: 'photo',
    categoryName: '摄影拍摄',
    price: 199,
    sales: 126,
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    desc: '提供证件照、职业形象照拍摄，含基础修图和电子版交付。',
    guarantee: ['提前沟通拍摄要求', '电子版 24 小时内交付', '基础修图包含在套餐内'],
    packages: [
      { name: '证件照电子版', duration: '含基础修图', price: 199 },
      { name: '职业形象照', duration: '半小时拍摄', price: 299 },
    ],
    providerName: '光影到家摄影',
    providerPhone: '400-800-1003',
    status: 'enabled',
  },
  {
    id: 104,
    title: '少儿编程体验课',
    category: 'course',
    categoryName: '兴趣课程',
    price: 59,
    sales: 421,
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    desc: 'Scratch 图形化编程体验课，适合 7-12 岁零基础儿童。',
    guarantee: ['课前学习顾问确认', '可预约线上或到店', '体验后提供学习建议'],
    packages: [
      { name: '线上体验课', duration: '45 分钟一对一体验', price: 59 },
      { name: '到店体验课', duration: '60 分钟小班体验', price: 89 },
    ],
    providerName: '星火少儿编程',
    providerPhone: '400-800-1004',
    status: 'enabled',
  },
  {
    id: 105,
    title: '美甲基础护理',
    category: 'beauty',
    categoryName: '美容护理',
    price: 89,
    sales: 307,
    rating: 4.6,
    cover: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    desc: '基础修甲、死皮护理、单色甲油胶，支持到店和预约上门。',
    guarantee: ['工具消毒可查', '款式到店确认', '7 天内非人为脱落可补修'],
    packages: [
      { name: '基础护理', duration: '修甲和基础护理', price: 89 },
      { name: '单色甲油胶', duration: '含基础护理', price: 129 },
    ],
    providerName: '小鹿美甲护理',
    providerPhone: '400-800-1005',
    status: 'enabled',
  },
]

export const coupons = [
  { id: 1, title: '新用户保洁满 168 减 30', thresholdAmount: 168, discountAmount: 30, category: 'cleaning', received: false },
  { id: 2, title: '空调清洗满 129 减 20', thresholdAmount: 129, discountAmount: 20, category: 'repair', received: false },
  { id: 3, title: '课程体验无门槛减 10', thresholdAmount: 0, discountAmount: 10, category: 'course', received: false },
]

export const announcements = [
  { id: 1, title: '夏季空调清洗服务加开夜间时段', content: '工作日晚间 19:00-21:00 可预约。', scene: 'home' },
  { id: 2, title: '新用户首单保洁立减 30 元', content: '领取优惠券后预约家庭深度保洁可使用。', scene: 'coupon' },
  { id: 3, title: '暴雨天气上门服务可能延迟', content: '客服会提前联系调整时间。', scene: 'home' },
]

export const addresses = [
  { id: 7001, contactName: '普通用户', phone: '13800000002', city: '上海市', district: '浦东新区', detail: '世纪大道 100 号 3 栋 1201', isDefault: true },
  { id: 7002, contactName: '王同学', phone: '13800000006', city: '上海市', district: '徐汇区', detail: '漕溪北路 18 号 901', isDefault: false },
]

export const orders = [
  {
    id: 9001,
    serviceId: 101,
    serviceTitle: '家庭深度保洁',
    customerName: '普通用户',
    phone: '13800000002',
    address: '上海市浦东新区世纪大道 100 号',
    appointmentTime: '2026-07-09 10:00',
    status: 'pending',
    reviewStatus: 'none',
    providerName: '绿萝家政服务中心',
    providerPhone: '400-800-1001',
  },
  {
    id: 9002,
    serviceId: 102,
    serviceTitle: '空调清洗维护',
    customerName: '普通用户',
    phone: '13800000002',
    address: '杭州市西湖区文三路 88 号',
    appointmentTime: '2026-07-10 15:30',
    status: 'completed',
    reviewStatus: 'done',
    reviewRating: 5,
    providerName: '清风维修清洗',
    providerPhone: '400-800-1002',
  },
]

export const reviews = [
  {
    id: 8001,
    orderId: 9002,
    serviceId: 102,
    serviceTitle: '空调清洗维护',
    userName: '普通用户',
    rating: 5,
    content: '师傅准时，清洗后空调异味明显少了，现场也做了试机。',
    tags: ['准时', '服务专业'],
    merchantReply: '感谢认可，我们会继续保持上门前确认和现场试机流程。',
    repliedAt: '2026-07-05 19:00',
    createdAt: '2026-07-05 18:30',
  },
  {
    id: 8002,
    orderId: 9001,
    serviceId: 101,
    serviceTitle: '家庭深度保洁',
    userName: '郑女士',
    rating: 5,
    content: '节前保洁很省心，客厅和厨房清洁效果都不错。',
    tags: ['服务专业', '准时'],
    merchantReply: '',
    repliedAt: '',
    createdAt: '2026-07-07 19:30',
  },
]

export const merchantProfile = {
  id: 1001,
  status: 'approved',
  providerName: '绿萝家政服务中心',
  address: '上海市浦东新区张杨路 188 号',
}

export function getMerchantDashboardFallback() {
  return {
    merchant: merchantProfile,
    serviceCount: services.filter((item) => item.status === 'enabled').length,
    orderCount: orders.length,
    pendingCount: orders.filter((item) => item.status === 'pending').length,
    rating: '4.8',
  }
}
