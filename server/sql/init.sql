DROP DATABASE IF EXISTS life_booking;
CREATE DATABASE life_booking DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE life_booking;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash CHAR(64) NOT NULL,
  name VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  phone VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'enabled',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  permission_group VARCHAR(50) NOT NULL
);

CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE merchants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  provider_name VARCHAR(80) NOT NULL,
  contact_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  business_category VARCHAR(40) NOT NULL,
  license_no VARCHAR(80) NOT NULL,
  address VARCHAR(255) NOT NULL,
  description VARCHAR(500) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  audit_note VARCHAR(500) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  merchant_id INT NULL,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(40) NOT NULL,
  category_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sales INT NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 4.8,
  cover VARCHAR(500) NOT NULL,
  description VARCHAR(500) NOT NULL,
  guarantee JSON NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'enabled',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE SET NULL
);

CREATE TABLE addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  contact_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  detail VARCHAR(255) NOT NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_id INT NOT NULL,
  service_title VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  customer_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  appointment_time DATETIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  review_status VARCHAR(20) NOT NULL DEFAULT 'none',
  after_sale_status VARCHAR(20) NOT NULL DEFAULT 'none',
  remark VARCHAR(500) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  service_id INT NOT NULL,
  service_title VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  user_name VARCHAR(50) NOT NULL,
  rating INT NOT NULL,
  content VARCHAR(500) NOT NULL,
  tags JSON NULL,
  merchant_reply VARCHAR(500) NOT NULL DEFAULT '',
  replied_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE after_sales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  service_id INT NOT NULL,
  service_title VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  user_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  reason VARCHAR(500) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted',
  solution VARCHAR(500) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE announcements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(120) NOT NULL,
  content VARCHAR(500) NOT NULL,
  scene VARCHAR(30) NOT NULL DEFAULT 'home',
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  sort INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  threshold_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(40) NOT NULL DEFAULT '',
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'enabled',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  coupon_id INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'unused',
  received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);

CREATE TABLE operation_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  operator VARCHAR(50) NOT NULL,
  action VARCHAR(80) NOT NULL,
  target VARCHAR(120) NOT NULL,
  detail VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, username, password_hash, name, role, phone, status) VALUES
(1, 'admin', SHA2('123456', 256), '管理员', 'admin', '13800000001', 'enabled'),
(2, 'user', SHA2('123456', 256), '普通用户', 'user', '13800000002', 'enabled'),
(3, 'disabled', SHA2('123456', 256), '停用用户', 'user', '13800000003', 'disabled'),
(4, 'operator', SHA2('123456', 256), '运营专员', 'admin', '13800000004', 'enabled'),
(5, 'support', SHA2('123456', 256), '客服专员', 'admin', '13800000005', 'enabled'),
(6, 'merchant_clean', SHA2('123456', 256), '保洁商家', 'merchant', '13800000006', 'enabled'),
(7, 'merchant_repair', SHA2('123456', 256), '维修商家', 'merchant', '13800000007', 'enabled'),
(8, 'merchant_photo', SHA2('123456', 256), '摄影商家', 'merchant', '13800000008', 'enabled'),
(9, 'merchant_course', SHA2('123456', 256), '课程商家', 'merchant', '13800000009', 'enabled'),
(10, 'merchant_beauty', SHA2('123456', 256), '美业商家', 'merchant', '13800000010', 'enabled');

INSERT INTO roles (id, name, code, description) VALUES
(1, '超级管理员', 'super_admin', '拥有后台全部权限，负责账号、角色和业务配置。'),
(2, '运营专员', 'operator', '负责服务、订单、售后、公告和优惠券运营。'),
(3, '客服专员', 'support', '负责订单跟进和售后处理。'),
(4, '普通用户', 'customer', '前台预约、评价和售后申请。'),
(5, '入驻商家', 'merchant', '使用移动端商家版接单、维护服务和查看评价。');

INSERT INTO permissions (id, code, name, permission_group) VALUES
(1, 'dashboard:view', '数据概览', '工作台'),
(2, 'service:manage', '服务管理', '业务管理'),
(3, 'order:manage', '订单管理', '业务管理'),
(4, 'after-sale:manage', '售后处理', '业务管理'),
(5, 'user:manage', '用户管理', '系统管理'),
(6, 'role:manage', '角色权限', '系统管理'),
(7, 'log:view', '操作日志', '系统管理'),
(8, 'announcement:manage', '公告管理', '运营管理'),
(9, 'coupon:manage', '优惠券管理', '运营管理'),
(10, 'merchant:workbench', '商家工作台', '商家端'),
(11, 'merchant:order', '商家订单', '商家端'),
(12, 'merchant:service', '商家服务', '商家端'),
(13, 'merchant:review', '商家评价', '商家端'),
(14, 'merchant:after-sale', '商家售后', '商家端');

INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE code IN ('dashboard:view','service:manage','order:manage','after-sale:manage','log:view','announcement:manage','coupon:manage');
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE code IN ('dashboard:view','order:manage','after-sale:manage');
INSERT INTO role_permissions (role_id, permission_id)
SELECT 5, id FROM permissions WHERE code IN ('merchant:workbench','merchant:order','merchant:service','merchant:review','merchant:after-sale');

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 4),
(3, 4),
(4, 2),
(5, 3),
(6, 5),
(7, 5),
(8, 5),
(9, 5),
(10, 5);

INSERT INTO merchants (id, user_id, provider_name, contact_name, phone, business_category, license_no, address, description, status, audit_note, created_at) VALUES
(1001, 6, '绿萝家政服务中心', '陈经理', '400-800-1001', 'cleaning', 'MER-CLEAN-20260701', '上海市浦东新区张杨路 188 号', '专注家庭保洁、开荒保洁和深度清洁，服务人员统一培训。', 'approved', '资料完整，已通过平台审核。', '2026-07-01 10:00:00'),
(1002, 7, '清风维修清洗', '周师傅', '400-800-1002', 'repair', 'MER-REPAIR-20260702', '杭州市西湖区文三路 66 号', '提供空调清洗、水电小修和家电基础维护，支持上门复查。', 'approved', '资质合规，已通过平台审核。', '2026-07-02 10:00:00'),
(1003, 8, '光影到家摄影', '林老师', '400-800-1003', 'photo', 'MER-PHOTO-20260703', '上海市徐汇区漕溪北路 20 号', '上门证件照、职业形象照和活动跟拍，支持电子版快速交付。', 'approved', '摄影作品样片已审核。', '2026-07-03 10:00:00'),
(1004, 9, '星火少儿编程', '顾问老师', '400-800-1004', 'course', 'MER-COURSE-20260704', '南京市建邺区江东中路 88 号', '少儿编程体验课和系统课，支持线上试听与到店体验。', 'approved', '课程资质已核验。', '2026-07-04 10:00:00'),
(1005, 10, '小鹿美甲护理', '李店长', '400-800-1005', 'beauty', 'MER-BEAUTY-20260705', '苏州市工业园区星湖街 108 号', '美甲基础护理、款式设计和补修服务，工具消毒流程可查。', 'approved', '门店信息已核验。', '2026-07-05 10:00:00');

INSERT INTO services (id, merchant_id, title, category, category_name, price, sales, rating, cover, description, guarantee) VALUES
(101, 1001, '家庭深度保洁', 'cleaning', '家政保洁', 168, 268, 4.9, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80', '厨房、卫生间、客厅、卧室全屋清洁，适合入住前后和节假日大扫除。', JSON_ARRAY('2 小时内确认预约','服务不满意可申请售后','工具耗材由服务商提供')),
(102, 1002, '空调清洗维护', 'repair', '维修清洗', 129, 193, 4.8, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80', '挂机、柜机基础清洗，包含滤网、外壳、蒸发器清洁和运行检测。', JSON_ARRAY('上门前电话确认','清洗后现场试机','异常问题可售后复核')),
(103, 1003, '上门证件照拍摄', 'photo', '摄影拍摄', 199, 126, 4.7, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', '提供证件照、职业形象照拍摄，含基础修图和电子版交付。', JSON_ARRAY('提前沟通拍摄要求','电子版 24 小时内交付','基础修图包含在套餐内')),
(104, 1004, '少儿编程体验课', 'course', '兴趣课程', 59, 421, 4.9, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 'Scratch 图形化编程体验课，适合 7-12 岁零基础儿童。', JSON_ARRAY('课前学习顾问确认','可预约线上或到店','体验后提供学习建议')),
(105, 1005, '美甲基础护理', 'beauty', '美容护理', 89, 307, 4.6, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80', '基础修甲、死皮护理、单色甲油胶，支持到店和预约上门。', JSON_ARRAY('工具消毒可查','款式到店确认','7 天内非人为脱落可补修')),
(106, 1002, '水电小修上门', 'repair', '维修清洗', 99, 176, 4.8, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', '开关、插座、水龙头、软管等常见小修，材料费按实际另计。', JSON_ARRAY('师傅持证上门','材料费用现场确认','维修后 7 天质保')),
(107, 1001, '开荒保洁套餐', 'cleaning', '家政保洁', 298, 92, 4.8, 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80', '新房、二手房、装修后全屋开荒，覆盖玻璃、地面、厨卫和柜体表面清洁。', JSON_ARRAY('提前确认房屋面积','工具耗材由服务商提供','重点区域拍照验收')),
(108, 1001, '厨房油污重清', 'cleaning', '家政保洁', 138, 118, 4.7, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80', '针对油烟机外壳、灶台、墙面和台面油污进行重点清洁。', JSON_ARRAY('上门前电话确认','重油污提前说明','服务完成现场验收')),
(109, 1001, '卫生间深度除垢', 'cleaning', '家政保洁', 128, 104, 4.8, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', '针对玻璃水垢、五金、台盆、马桶和地面边角进行深度清洁。', JSON_ARRAY('清洁剂合规使用','边角重点处理','不满意可申请复查')),
(110, 1001, '日常保洁包月', 'cleaning', '家政保洁', 520, 76, 4.9, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80', '每月 4 次日常保洁，适合固定家庭清洁维护。', JSON_ARRAY('固定阿姨优先','可协商服务时间','月度服务记录可查'));

INSERT INTO addresses (id, user_id, contact_name, phone, city, district, detail, is_default) VALUES
(7001, 2, '普通用户', '13800000002', '上海市', '浦东新区', '世纪大道 100 号 3 栋 1201', 1),
(7002, 2, '普通用户', '13800000002', '杭州市', '西湖区', '文三路 88 号 2 单元 601', 0),
(7003, 2, '王同学', '13800000006', '上海市', '徐汇区', '漕溪北路 18 号 901', 0),
(7004, 2, '李女士', '13800000007', '南京市', '建邺区', '江东中路 66 号 1602', 0),
(7005, 2, '赵先生', '13800000008', '苏州市', '工业园区', '星湖街 99 号 502', 0);

INSERT INTO orders (id, service_id, service_title, user_id, customer_name, phone, address, appointment_time, status, review_status, after_sale_status, remark, created_at) VALUES
(9001, 101, '家庭深度保洁', 2, '普通用户', '13800000002', '上海市浦东新区世纪大道 100 号', '2026-07-09 10:00:00', 'pending', 'none', 'none', '家里有老人，上午方便。', '2026-07-03 14:20:00'),
(9002, 102, '空调清洗维护', 2, '普通用户', '13800000002', '杭州市西湖区文三路 88 号', '2026-07-10 15:30:00', 'completed', 'done', 'processing', '两台挂机。', '2026-07-04 09:15:00'),
(9003, 104, '少儿编程体验课', 2, '王同学', '13800000006', '上海市徐汇区漕溪北路 18 号', '2026-07-12 19:00:00', 'confirmed', 'none', 'none', '希望安排线上试听。', '2026-07-05 10:00:00'),
(9004, 105, '美甲基础护理', 2, '李女士', '13800000007', '南京市建邺区江东中路 66 号', '2026-07-13 14:00:00', 'canceled', 'none', 'none', '临时有事取消。', '2026-07-05 12:40:00'),
(9005, 106, '水电小修上门', 2, '赵先生', '13800000008', '苏州市工业园区星湖街 99 号', '2026-07-14 09:30:00', 'completed', 'done', 'none', '水龙头漏水。', '2026-07-06 08:35:00'),
(9006, 103, '上门证件照拍摄', 2, '普通用户', '13800000002', '上海市浦东新区世纪大道 100 号', '2026-07-15 16:00:00', 'completed', 'none', 'none', '需要白底和蓝底电子版。', '2026-07-06 11:10:00'),
(9007, 107, '开荒保洁套餐', 2, '孙女士', '13800000011', '上海市浦东新区民生路 168 号', '2026-07-16 09:00:00', 'completed', 'done', 'none', '装修后首次清洁。', '2026-07-07 09:00:00'),
(9008, 108, '厨房油污重清', 2, '钱先生', '13800000012', '上海市浦东新区商城路 88 号', '2026-07-16 14:00:00', 'completed', 'done', 'none', '油烟机外壳油污较重。', '2026-07-07 10:00:00'),
(9009, 109, '卫生间深度除垢', 2, '周女士', '13800000013', '上海市浦东新区羽山路 36 号', '2026-07-17 10:30:00', 'completed', 'done', 'none', '玻璃水垢明显。', '2026-07-07 11:00:00'),
(9010, 110, '日常保洁包月', 2, '吴先生', '13800000014', '上海市浦东新区源深路 99 号', '2026-07-18 13:00:00', 'confirmed', 'none', 'none', '希望固定周六下午。', '2026-07-07 12:00:00'),
(9011, 101, '家庭深度保洁', 2, '郑女士', '13800000015', '上海市浦东新区杨高中路 500 号', '2026-07-18 16:00:00', 'completed', 'done', 'none', '节前大扫除。', '2026-07-07 13:00:00'),
(9012, 107, '开荒保洁套餐', 2, '普通用户', '13800000002', '上海市浦东新区世纪大道 100 号', '2026-07-19 09:30:00', 'completed', 'done', 'none', '入住前清洁。', '2026-07-07 14:00:00');

INSERT INTO reviews (id, order_id, service_id, service_title, user_id, user_name, rating, content, tags, merchant_reply, replied_at, created_at) VALUES
(8001, 9002, 102, '空调清洗维护', 2, '普通用户', 5, '师傅准时，清洗后空调异味明显少了，现场也做了试机。', JSON_ARRAY('准时','服务专业'), '感谢认可，我们会继续保持上门前确认和现场试机流程。', '2026-07-05 19:00:00', '2026-07-05 18:30:00'),
(8002, 9005, 106, '水电小修上门', 2, '赵先生', 4, '维修速度快，材料费也提前说明了。', JSON_ARRAY('沟通顺畅'), '感谢反馈，材料费用透明是我们的基础要求。', '2026-07-06 12:30:00', '2026-07-06 12:00:00'),
(8003, 9007, 107, '开荒保洁套餐', 2, '孙女士', 5, '开荒清洁做得很细，窗槽和柜体都处理到了。', JSON_ARRAY('服务专业','验收清楚'), '感谢您的细致评价，开荒细节验收我们会继续做好。', '2026-07-07 18:40:00', '2026-07-07 18:10:00'),
(8004, 9008, 108, '厨房油污重清', 2, '钱先生', 4, '厨房油污改善明显，师傅也提醒了日常维护方法。', JSON_ARRAY('沟通顺畅','价格透明'), '', NULL, '2026-07-07 18:30:00'),
(8005, 9009, 109, '卫生间深度除垢', 2, '周女士', 5, '玻璃和五金清理后很亮，边角处理也认真。', JSON_ARRAY('准时','细致'), '', NULL, '2026-07-07 19:00:00'),
(8006, 9011, 101, '家庭深度保洁', 2, '郑女士', 5, '节前保洁很省心，客厅和厨房清洁效果都不错。', JSON_ARRAY('服务专业','准时'), '谢谢选择绿萝家政，节前保洁我们会持续保障服务质量。', '2026-07-07 20:00:00', '2026-07-07 19:30:00'),
(8007, 9012, 107, '开荒保洁套餐', 2, '普通用户', 4, '客服响应快，预约确认比较及时。', JSON_ARRAY('响应快'), '', NULL, '2026-07-07 20:00:00');

INSERT INTO after_sales (id, order_id, service_id, service_title, user_id, user_name, phone, reason, status, solution, created_at) VALUES
(8101, 9002, 102, '空调清洗维护', 2, '普通用户', '13800000002', '清洗后仍有轻微异味，希望安排师傅复查。', 'processing', '已联系服务商，预计 24 小时内回访并安排复查。', '2026-07-05 19:10:00'),
(8102, 9007, 107, '开荒保洁套餐', 2, '孙女士', '13800000011', '窗槽有一处残留灰尘，希望复查。', 'submitted', '', '2026-07-07 18:50:00'),
(8103, 9008, 108, '厨房油污重清', 2, '钱先生', '13800000012', '油烟机边角仍有油渍，希望补清。', 'processing', '已安排师傅次日上午复查补清。', '2026-07-07 19:00:00'),
(8104, 9009, 109, '卫生间深度除垢', 2, '周女士', '13800000013', '五金清洁效果满意，但希望补充保养建议。', 'resolved', '已电话回访并发送日常保养建议。', '2026-07-07 19:20:00'),
(8105, 9011, 101, '家庭深度保洁', 2, '郑女士', '13800000015', '希望补开发票并确认服务明细。', 'submitted', '', '2026-07-07 20:10:00');

INSERT INTO announcements (id, title, content, scene, status, sort, created_at) VALUES
(1, '夏季空调清洗服务加开夜间时段', '7 月工作日晚间 19:00-21:00 可预约空调清洗维护。', 'home', 'published', 10, '2026-07-01 09:00:00'),
(2, '新用户首单保洁立减 30 元', '领取优惠券后预约家庭深度保洁可使用。', 'coupon', 'published', 9, '2026-07-02 09:00:00'),
(3, '暴雨天气上门服务可能延迟', '如遇极端天气，客服会提前联系调整时间。', 'home', 'published', 8, '2026-07-03 09:00:00'),
(4, '少儿编程暑期体验课开放预约', '适合 7-12 岁零基础儿童，支持线上体验。', 'home', 'published', 7, '2026-07-04 09:00:00'),
(5, '售后回访时效升级', '已完成订单 7 天内可在线发起售后申请。', 'order', 'published', 6, '2026-07-05 09:00:00');

INSERT INTO coupons (id, title, threshold_amount, discount_amount, category, start_at, end_at, stock, status, created_at) VALUES
(1, '新用户保洁满 168 减 30', 168, 30, 'cleaning', '2026-07-01 00:00:00', '2026-08-01 23:59:59', 200, 'enabled', '2026-07-01 09:10:00'),
(2, '空调清洗满 129 减 20', 129, 20, 'repair', '2026-07-01 00:00:00', '2026-07-31 23:59:59', 150, 'enabled', '2026-07-01 09:20:00'),
(3, '课程体验无门槛减 10', 0, 10, 'course', '2026-07-01 00:00:00', '2026-08-15 23:59:59', 300, 'enabled', '2026-07-01 09:30:00'),
(4, '摄影套餐满 199 减 25', 199, 25, 'photo', '2026-07-01 00:00:00', '2026-08-31 23:59:59', 80, 'enabled', '2026-07-01 09:40:00'),
(5, '美甲护理满 89 减 15', 89, 15, 'beauty', '2026-07-01 00:00:00', '2026-07-25 23:59:59', 120, 'enabled', '2026-07-01 09:50:00');

INSERT INTO user_coupons (user_id, coupon_id, status) VALUES
(2, 1, 'unused'),
(2, 2, 'unused');

INSERT INTO operation_logs (id, operator, action, target, detail, created_at) VALUES
(10001, '管理员', '修改订单状态', '家庭深度保洁 #9001', '将订单状态调整为待确认', '2026-07-05 18:20:00'),
(10002, '运营专员', '处理售后', '空调清洗维护 #8101', '已联系服务商安排复查', '2026-07-05 19:30:00'),
(10003, '管理员', '发布公告', '夏季空调清洗服务加开夜间时段', '公告状态为已发布', '2026-07-06 09:00:00'),
(10004, '运营专员', '新增优惠券', '新用户保洁满 168 减 30', '库存 200 张', '2026-07-06 09:30:00'),
(10005, '客服专员', '售后回访', '空调清洗维护 #8101', '记录用户复查诉求', '2026-07-06 10:00:00');
