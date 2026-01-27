# 轻屏壁纸V2.0

基于uni-app和Cloudflare Wrangler的跨平台壁纸应用，支持微信小程序、H5和APP。

## 项目结构

```
qingpingWallapaper/
├── admin/                     # 管理员后台
│   ├── src/
│   │   ├── api/               # 后台接口封装
│   │   ├── components/        # 后台通用组件
│   │   ├── pages/             # 后台页面
│   │   ├── stores/            # 状态管理
│   │   ├── utils/             # 工具函数
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── api/                       # 前端接口封装
│   ├── user/
│   └── admin/
├── common/                    # 公共资源
│   ├── images/
│   ├── style/
│   └── constants/
├── components/                # 通用组件
│   ├── common-nav-bar/
│   ├── wallpaper-card/
│   └── rating-star/
├── pages/                     # 用户端页面
│   ├── index/
│   ├── classify/
│   ├── preview/
│   ├── my/
│   ├── search/
│   └── notice/
├── static/                    # 静态资源
│   ├── images/
│   └── tabBar/
├── stores/                    # 状态管理
│   └── user.js
├── utils/                     # 工具函数
│   ├── request.js
│   ├── storage.js
│   └── format.js
├── wrangler/                  # Wrangler后端
│   ├── src/
│   │   ├── routes/            # 路由处理
│   │   ├── db/                # 数据库操作
│   │   ├── utils/             # 工具函数
│   │   └── index.js           # 入口文件
│   ├── d1/                    # 数据库迁移脚本
│   └── wrangler.toml          # Wrangler配置
├── App.vue
├── main.js
├── manifest.json
├── pages.json
├── package.json
└── uni.scss
```

## 技术栈

### 前端（用户端）
- 框架：uni-app（Vue 3 Composition API）
- 样式：SCSS
- UI组件：uni-ui
- 状态管理：Pinia
- 网络请求：uni.request

### 管理员后台
- 框架：Vue 3 + Vite
- UI组件：Element Plus
- 状态管理：Pinia
- 网络请求：Axios

### 后端（Wrangler）
- 服务运行时：Cloudflare Workers
- 数据库：Cloudflare D1
- 缓存层：Cloudflare KV
- 接口规范：RESTful API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置Wrangler

1. 安装Wrangler CLI：
```bash
npm install -g wrangler
```

2. 登录Cloudflare账号：
```bash
wrangler login
```

3. 创建D1数据库：
```bash
wrangler d1 create wallpaper-db
```

4. 创建KV命名空间：
```bash
wrangler kv:namespace create "CACHE"
```

5. 更新`wrangler.toml`中的配置，替换`your-database-id`和`your-kv-namespace-id`

6. 执行数据库迁移：
```bash
wrangler d1 execute wallpaper-db --file=./wrangler/d1/init.sql
```

7. 部署Workers：
```bash
wrangler deploy
```

### 3. 启动前端开发

```bash
npm run dev:mp-weixin
```

### 4. 启动管理员后台

```bash
cd admin
npm install
npm run dev
```

## 功能特性

### 用户端
- 首页：轮播图、公告、每日推荐、专题精选
- 分类：分类浏览、筛选、搜索
- 预览：壁纸预览、评分、收藏、下载、分享
- 我的：用户信息、收藏列表、浏览历史、设置
- 搜索：搜索联想、热门搜索、搜索历史

### 管理员后台
- 壁纸管理：新增、编辑、删除、上下架
- 分类管理：新增、编辑、删除、排序
- 轮播图管理：新增、编辑、删除、排序
- 公告管理：新增、编辑、删除、发布
- 数据统计：壁纸数量、下载量、用户行为统计

## 部署说明

### 微信小程序
1. 在HBuilderX中打包为微信小程序代码
2. 上传至微信公众平台审核发布

### H5
1. 运行`npm run build:h5`构建
2. 部署至静态服务器或Cloudflare Pages

### APP
1. 在HBuilderX中打包为APP
2. 发布至应用商店

### 管理员后台
1. 运行`npm run build`构建
2. 部署至Cloudflare Pages或其他静态服务器

## 注意事项

1. 首次使用需要在Cloudflare创建D1数据库和KV命名空间
2. 管理员默认账号：admin / admin123
3. 请及时修改管理员密码
4. 图片建议使用CDN加速
5. 免费版Wrangler有请求限制，请注意使用量

## 许可证

MIT