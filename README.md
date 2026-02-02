# 轻屏壁纸 V2.0

基于UniApp和Cloudflare Wrangler的跨平台壁纸应用

## 项目结构

```
qingpingWallapaper/
├── frontend/          # UniApp前端项目（微信小程序）
│   ├── api/         # API接口
│   ├── components/  # 组件
│   ├── pages/       # 页面
│   ├── stores/      # 状态管理
│   ├── utils/       # 工具函数
│   ├── static/      # 静态资源
│   ├── App.vue      # 应用入口
│   ├── main.js      # 主文件
│   ├── manifest.json # 应用配置
│   ├── pages.json   # 页面配置
│   ├── uni.scss     # 全局样式
│   ├── package.json # 依赖配置
│   └── vite.config.js # Vite配置
├── backend/           # Vue3管理后台
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── stores/
│   │   ├── utils/
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── wrangler/          # Cloudflare Worker API
│   ├── d1/
│   │   ├── add_admin.sql
│   │   └── init.sql
│   └── src/
│       ├── routes/
│       ├── index.js
│       └── index-test.js
├── API.md           # API文档
├── README.md        # 项目说明
└── wrangler.toml    # Wrangler配置
```

## 技术栈

### 前端（frontend/）
- **框架**: UniApp + Vue 3
- **状态管理**: Pinia
- **样式**: SCSS
- **构建工具**: Vite

### 后端（backend/）
- **框架**: Vue 3 + Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI组件**: Element Plus

### API（wrangler/）
- **运行时**: Cloudflare Workers
- **数据库**: D1 (SQLite)
- **部署**: Wrangler CLI

## 开发命令

### 前端开发（UniApp微信小程序）

```bash
cd frontend
npm install
npm run dev:mp-weixin    # 微信小程序开发
npm run build:mp-weixin  # 微信小程序构建
npm run dev:h5          # H5开发
npm run build:h5         # H5构建
```

### 后端开发（管理后台）

```bash
cd backend
npm install
npm run dev             # 开发模式
npm run build           # 生产构建
npm run preview         # 预览构建结果
```

### API部署（Cloudflare Worker）

```bash
cd wrangler
npm install -g wrangler
wrangler deploy        # 部署到Cloudflare
wrangler d1 execute DB --file=./d1/init.sql  # 初始化数据库
```

## 主要功能

### 前端功能
- 首页展示（轮播图、推荐、分类）
- 分类浏览
- 壁纸预览
- 搜索功能
- 用户收藏
- 浏览历史
- 下载保存

### 后台功能
- 管理员登录
- 壁纸管理（增删改查）
- 分类管理
- 轮播图管理
- 公告管理
- 数据统计

### API功能
- 用户端API
- 管理端API
- 数据库操作
- 图片上传（Cloudflare R2）

## 环境要求

- Node.js >= 16.x
- npm >= 8.x
- 微信开发者工具（用于小程序开发）
- Wrangler CLI（用于API部署）

## 注意事项

1. **前端开发**：使用HBuilderX或VS Code + UniApp插件
2. **后端开发**：使用VS Code + Volar插件
3. **API部署**：需要Cloudflare账号和Wrangler CLI
4. **数据库**：使用Cloudflare D1，首次部署需要执行初始化SQL

## 项目特点

- ✅ 前后端完全分离
- ✅ 支持多端发布（微信小程序、H5、App）
- ✅ 使用Pinia进行状态管理
- ✅ API使用Cloudflare Workers，无需服务器
- ✅ 数据库使用Cloudflare D1，免费额度充足
- ✅ 图片存储使用Cloudflare R2，成本低廉
- ✅ 响应式设计，适配各种屏幕尺寸

## 许可证

MIT License
