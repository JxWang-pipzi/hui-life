# 惠生活服务预约平台

一个面向 Web 前端岗位练习的工程化项目，模拟本地生活服务预约业务。项目包含 Web 用户端、后台业务端、Node API 服务、MySQL 数据库和 uni-app 移动端，重点覆盖近期 Web 前端 JD 共性要求：HTML/CSS/JS、Vue 项目开发、响应式和移动端适配、接口联调、登录鉴权、表单表格、弹窗、图片上传、数据图表、跨端开发、Git 管理和前端工程化。

## 技术栈

- Vue 3 + JavaScript + Vite
- uni-app：移动端 H5 / 小程序练习入口
- Node.js + Express：真实接口服务
- MySQL 8：业务数据、RBAC、订单、公告、优惠券
- Vue Router：前台、后台路由和权限控制
- Pinia：登录用户状态管理
- Axios：请求实例、Token 拦截、统一错误处理
- Element Plus：后台表格、表单、弹窗、分页
- ECharts：后台数据概览图表
- SCSS：全局样式和响应式布局
- Mock Adapter：无后端时模拟真实接口
- ESLint + Prettier：代码规范

## 功能模块

用户端：

- 首页：服务分类、热门服务、项目亮点
- 服务列表：搜索、分类筛选、排序、分页
- 服务详情：图片、价格、说明、预约入口
- 服务详情：服务保障、用户评价、预约入口
- 预约表单：常用地址回填、联系人、手机号、地址、时间、备注和表单校验
- 我的订单：订单列表、状态展示、取消预约、提交评价、申请售后
- 地址管理：新增、编辑、删除、默认地址
- 优惠券中心：查看公告、领取优惠券
- 登录：普通用户和管理员账号登录

后台端：

- 数据概览：订单、用户、服务数量和 ECharts 图表
- 服务管理：新增、编辑、删除、搜索、分页、模拟图片上传
- 订单管理：搜索、状态筛选、分页、修改订单状态
- 售后处理：售后列表、状态筛选、处理说明、状态流转
- 用户管理：用户列表、启用/禁用、分配角色
- 角色权限：RBAC 角色、权限点配置、菜单和路由权限控制
- 操作日志：记录服务、订单、售后、用户、角色等后台操作
- 公告管理：发布首页、订单、优惠券场景公告
- 优惠券管理：新增、编辑、删除、库存和状态管理
- 权限控制：管理员后台按角色权限访问不同模块

移动端：

- uni-app 子项目：`mobile`
- 首页：移动端 Hero、分类入口、热门服务
- 服务页：搜索、横向分类筛选、服务卡片
- 服务详情：服务保障、套餐选择、用户评价、底部预约栏
- 预约页：常用地址选择、日期时间选择、备注和提交预约
- 订单页：订单状态筛选、联系服务商、取消预约、评价入口
- 首页优惠券：通过 uni-ui `uni-icons` 展示并领取优惠券
- 我的页：用户信息、订单/评价/售后数据和功能菜单

## 运行项目

```bash
pnpm install
pnpm db:init
pnpm dev:api
pnpm dev
```

Web 和移动端分别运行：

```bash
pnpm dev:api
pnpm dev:web
pnpm dev:mobile:h5
```

构建和预览：

```bash
pnpm build:web
pnpm build:mobile:h5
pnpm preview
```

代码检查和格式化：

```bash
pnpm lint
pnpm format
```

## 测试账号

```txt
普通用户：user / 123456
管理员：admin / 123456
运营专员：operator / 123456
客服专员：support / 123456
停用用户：disabled / 123456
```

## 数据库说明

数据库连接和 JWT 鉴权通过 `server/.env` 配置。复制 `server/.env.example` 并填写真实值：

```txt
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的 MySQL 密码
DB_NAME=life_booking
API_PORT=3000
JWT_SECRET=生产环境请用随机长字符串
JWT_EXPIRES_IN=7d
```

> 安全提示：不要把真实密码或 JWT 密钥提交到 Git 仓库。`.env` 已被 `.gitignore` 忽略，仅 `.env.example` 作为模板提交。

初始化脚本位于 `server/sql/init.sql`，运行 `pnpm db:init` 会提示输入 MySQL 密码，脚本会创建库并写入测试数据：用户、角色、权限、服务、地址、订单、评价、售后、公告、优惠券和操作日志。每个核心业务表都准备了多条原始测试数据，便于直接联调。

## 工程化练习点

- 使用 `.env.development` 和 `.env.production` 管理接口地址和 Mock 开关
- 使用 `pnpm-workspace.yaml` 管理 Web 根项目、Node API 和 uni-app 移动端子包
- 使用根目录脚本统一调度 Web、API 与移动端启动、构建和数据库初始化命令
- 使用 Vite `server.proxy` 演示开发代理配置
- 使用 `@` 路径别名简化模块导入
- 使用路由懒加载降低首屏 JS 压力
- 使用图片 `loading="lazy"` 做基础图片懒加载
- 使用 Axios 拦截器统一注入 Token 和处理业务错误
- 使用 Pinia + localStorage 保持登录状态
- 使用 MySQL 接口承载地址簿、评价、售后、订单、RBAC、公告和优惠券
- 使用 ESLint、Prettier、EditorConfig 统一代码风格

## 面向 JD 的练习覆盖

- 基础页面：语义结构、Flex/Grid、响应式、移动端卡片布局
- 业务开发：搜索筛选、分页、表单校验、弹窗、上传、权限、状态流转
- 接口联调：Axios 封装、Token、401、业务错误、Mock 数据
- 后端协作：Express 路由、MySQL 表设计、种子数据、开发代理、CORS
- C 端/H5：uni-app 页面、TabBar、移动端交互、服务详情、预约表单和订单状态
- 工程化：Vite、pnpm workspace、环境变量、构建脚本、ESLint/Prettier、Git
- 加分项：RBAC、操作日志、ECharts、uni-app、性能优化点、跨端目录组织

## Git 分支建议

```txt
main                 稳定分支
develop              开发分支
feature/login        登录模块
feature/service      服务列表和详情
feature/order        预约和订单
feature/admin        后台管理
fix/mobile-layout    移动端样式修复
```

提交信息示例：

```txt
feat: add login page
feat: implement service list filters
feat: add order form validation
feat: build admin order status flow
fix: correct mobile layout
docs: update project README
```
