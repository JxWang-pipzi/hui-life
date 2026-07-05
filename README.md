# 惠生活服务预约平台

一个面向 Web 前端岗位练习的 Vue3 + JavaScript 项目，模拟本地生活服务预约业务。项目包含用户端和后台管理端，重点覆盖小厂 JD 常见要求：页面开发、移动端适配、接口联调、登录鉴权、表单校验、表格分页、弹窗、图片上传、数据图表、Git 管理和前端工程化。

## 技术栈

- Vue 3 + JavaScript + Vite
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
- 预约表单：联系人、手机号、地址、时间、备注和表单校验
- 我的订单：订单列表、状态展示
- 登录：普通用户和管理员账号登录

后台端：

- 数据概览：订单、用户、服务数量和 ECharts 图表
- 服务管理：新增、编辑、删除、搜索、分页、模拟图片上传
- 订单管理：搜索、状态筛选、分页、修改订单状态
- 用户管理：用户列表、启用/禁用
- 权限控制：管理员才能访问后台

## 运行项目

```bash
pnpm install
pnpm dev
```

构建和预览：

```bash
pnpm build
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
停用用户：disabled / 123456
```

## 工程化练习点

- 使用 `.env.development` 和 `.env.production` 管理接口地址和 Mock 开关
- 使用 Vite `server.proxy` 演示开发代理配置
- 使用 `@` 路径别名简化模块导入
- 使用路由懒加载降低首屏 JS 压力
- 使用图片 `loading="lazy"` 做基础图片懒加载
- 使用 Axios 拦截器统一注入 Token 和处理业务错误
- 使用 Pinia + localStorage 保持登录状态
- 使用 ESLint、Prettier、EditorConfig 统一代码风格

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
