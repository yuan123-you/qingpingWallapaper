# 轻屏壁纸 (LightScreen) V3.0

一个基于 **UniApp + Vue 3** 构建的高颜值、纯前端驱动高清壁纸探索小程序。

## 🌟 项目概述

**轻屏壁纸** 是一款主打沉浸式美学的高清壁纸应用。采用现代化的 **磨砂玻璃 (Glassmorphism)** 设计语言，配合流畅的入场动画及高斯模糊特效，为用户提供极为精致的视觉体验。项目完全由前端驱动，数据通过本地 Mock 管理，支持收藏、历史记录、下载同步等完整功能。

### 项目定位

- **应用类型**：微信小程序 / H5 多端应用
- **核心价值**：提供海量精美壁纸，支持离线浏览和个性化收藏
- **目标用户**：追求高品质壁纸的年轻用户群体
- **设计理念**：简约、优雅、沉浸式体验

## ✨ 项目特点

- **纯前端驱动**：无需任何后端 API、服务器或数据库，降低部署成本
- **本地持久化**：深度结合 UniApp 原生存储与 Pinia，支持离线收藏、浏览历史及下载记录管理
- **沉浸式美学**：全局采用磨砂玻璃设计，支持动态导航栏跟随页面滚动进行透明度及模糊度渐变
- **高性能加载**：基于本地数据索引及 Pexels 图片动态优化，检索速度快，加载体验佳
- **跨端兼容**：一套代码同时支持微信小程序和 H5 平台

## 🛠️ 技术栈

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **UniApp** | ^3.0.0 | 跨平台开发框架，支持微信小程序、H5、App等多端 |
| **Vue 3** | ^3.4.21 | 前端框架，使用 Composition API 开发 |
| **Pinia** | ^2.1.7 | 状态管理，替代 Vuex，更轻量更易用 |
| **Vite** | ^5.1.4 | 构建工具，提供极速的开发体验 |
| **SCSS** | ^1.71.1 | 样式预处理，支持变量、嵌套等特性 |

### UI 组件

- **Uni-UI**：官方 UI 组件库（uni-icons、uni-popup、uni-rate 等）
- **自定义组件**：common-nav-bar、rating-star 等高阶组件

### 开发工具

- **HBuilderX** / **VSCode**：开发环境
- **微信开发者工具**：小程序调试

## 📂 目录结构与功能说明

```text
qingpingWallapaper/
├── api/                      # 数据层
│   ├── mockData.js          # 核心数据池：壁纸资源、分类映射、轮播图及公告
│   └── user/                # 用户业务 API
│       └── index.js         # 用户相关接口封装
├── components/              # 公共组件
│   ├── common-nav-bar/      # 自定义高级导航栏 (支持毛玻璃及动态渐变)
│   │   └── common-nav-bar.vue
│   └── rating-star/         # 优雅的五星评分组件
│       └── rating-star.vue
├── pages/                   # 视图页面
│   ├── index/               # 首页 (轮播/公告/精选推荐)
│   │   └── index.vue
│   ├── classify/            # 分类中心 (行业领先的分类视觉导向)
│   │   └── classify.vue
│   ├── wallpaper/           # 壁纸列表 (瀑布流布局)
│   │   └── list.vue
│   ├── preview/             # 详情预览 (全屏沉浸预览/评分/收藏/下载)
│   │   └── preview.vue
│   ├── search/              # 搜索中心
│   │   └── search.vue
│   ├── login/               # 模拟登录页
│   │   └── login.vue
│   ├── my/                  # 个人中心 (历史/收藏/下载记录)
│   │   ├── my.vue
│   │   ├── favorites.vue    # 我的收藏
│   │   ├── history.vue      # 浏览历史
│   │   └── downloads.vue    # 下载记录
│   └── notice/              # 公告系统 (列表及详情)
│       ├── notice.vue
│       └── detail.vue
├── stores/                  # Pinia 状态仓库 (处理全局持久化数据)
│   └── user.js              # 用户状态管理
├── utils/                   # 工具函数
│   ├── request.js           # 请求封装 (Mock 实现)
│   └── common.js            # 通用工具函数 (节流/防抖)
├── static/                  # 静态资源
│   ├── data/                # JSON 数据文件
│   │   ├── wallpaper.json   # 壁纸数据
│   │   ├── classify.json    # 分类数据
│   │   ├── banner.json      # 轮播图数据
│   │   └── notice.json      # 公告数据
│   └── tabBar/              # 底部导航图标
├── uni_modules/             # UniApp 插件模块
│   ├── uni-icons/            # 图标组件
│   ├── uni-popup/           # 弹窗组件
│   ├── uni-rate/            # 评分组件
│   └── ...
├── App.vue                  # 应用入口 (生命周期监听与全局样式)
├── main.js                  # 初始化入口
├── manifest.json            # 应用平台配置
├── pages.json               # 页面路由及全局 UI 配置
├── uni.scss                 # 全局样式规范 (品牌色/圆角/阴影变量)
└── vite.config.js          # 构建及编译配置
```

## 🏗️ 核心功能实现

### 1. 数据层设计

项目采用纯前端 Mock 数据方案，数据源包括：

- **壁纸数据**：8 大分类（明星美女、动漫人物、二次元、氛围寓意、自然风景、治愈系、简约朴素、独特建筑）
- **数据来源**：彼岸图网、Pexels
- **分类映射**：通过 `CATEGORY_MAP` 建立分类与图片池的映射关系
- **动态生成**：使用 `generateWallpapers()` 函数批量生成壁纸数据

### 2. 状态管理

使用 Pinia 管理全局用户状态，核心功能包括：

```javascript
// stores/user.js 核心功能
- initUserInfo()      // 初始化用户信息，支持数据清洗和兼容性处理
- setUserInfo()       // 更新用户信息
- updateAvatar()      // 更新用户头像
- updateNickname()    // 更新用户昵称
- addFavorite()       // 添加收藏
- removeFavorite()    // 移除收藏
- addHistory()        // 添加浏览历史（最多50条，自动去重）
- clearHistory()      // 清空历史
- addDownload()       // 添加下载记录
- setToken()          // 设置登录令牌
- logout()            // 退出登录
```

**技术亮点：**
- 深度结合 `uni.getStorageSync` 和 `uni.setStorageSync` 实现持久化
- 支持数据清洗逻辑，自动修复旧数据（如头像 URL）
- 历史记录自动去重并按时间排序
- 应用启动时自动从本地存储恢复数据

### 3. 请求封装

在 `utils/request.js` 中实现了完整的请求拦截和 Mock 响应：

```javascript
// 核心实现
- mockRequest()        // 模拟后端 API 响应
- get/post/put/delete  // RESTful 风格请求方法
- 统一错误处理和 Toast 提示
```

**支持的接口包括：**
- 用户登录
- 分类/轮播图/公告列表
- 壁纸列表（支持分类筛选、关键词搜索、分页）
- 壁纸详情和评分
- 用户行为记录（收藏、下载、浏览）
- 热门搜索

### 4. 首页实现

`pages/index/index.vue` 实现了丰富的首页功能：

- **轮播图**：使用 Swiper 组件，支持自动播放、指示器、卡片缩放效果
- **公告栏**：垂直滚动的公告列表，支持不同类型标签（系统/更新/活动）
- **快捷功能**：随机抽取、人气 TOP、全部分类三个入口
- **今日精选**：三列网格布局展示壁纸，带渐变遮罩和评分显示
- **热门分类**：双列网格展示分类卡片

**技术细节：**
- 使用 `Promise.all` 并发加载数据，提升性能
- 使用 `throttle` 节流函数防止快速点击
- CSS 动画实现卡片渐入效果
- 懒加载优化图片加载性能

### 5. 自定义导航栏

`components/common-nav-bar/common-nav-bar.vue` 组件实现了：

- 自适应状态栏高度
- 支持返回按钮显示/隐藏
- 支持自定义背景色
- 右侧插槽支持自定义操作按钮
- 磨砂玻璃视觉效果

## 🎨 设计系统

### 颜色系统

```scss
// 品牌色
$brand-color: #28b389;              // 主色调
$brand-color-light: #e9f7f3;        // 浅色调
$brand-gradient: linear-gradient(135deg, #28b389 0%, #40c79c 100%);

// 辅助色
$accent-color: #ff6b6b;             // 强调色
$secondary-color: #4facfe;          // 次要色

// 文字颜色
$text-main: #2c3e50;                // 主文字
$text-sub: #7f8c8d;                // 次要文字
$text-grey: #bdc3c7;               // 灰色文字
$text-white: #ffffff;               // 白色文字

// 背景颜色
$bg-color: #f8f9fa;                // 背景色
$bg-glass: rgba(255, 255, 255, 0.85);  // 磨砂玻璃背景
$bg-dark-glass: rgba(0, 0, 0, 0.6);    // 深色磨砂玻璃
```

### 阴影与圆角

```scss
// 阴影
$shadow-sm: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
$shadow-md: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
$shadow-lg: 0 16rpx 48rpx rgba(0, 0, 0, 0.12);

// 圆角
$radius-sm: 12rpx;
$radius-md: 24rpx;
$radius-lg: 40rpx;
$radius-circle: 1000rpx;
```

### 混入

```scss
// 磨砂玻璃效果
@mixin glass-effect {
  background: $bg-glass;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

// 弹性布局
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// 文字溢出
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

## 🔧 技术难点与解决方案

### 1. 纯前端数据持久化

**问题**：如何在没有后端的情况下实现用户数据的持久化？

**解决方案：**
- 使用 UniApp 的 `uni.getStorageSync` 和 `uni.setStorageSync` API
- 在 Pinia store 中封装存储逻辑，确保数据变更时同步到本地存储
- 应用启动时从本地存储恢复数据
- 实现数据清洗和兼容性处理，自动修复旧数据

### 2. 大量图片性能优化

**问题**：壁纸数量多，如何保证加载性能？

**解决方案：**
- 使用 `lazy-load` 属性实现图片懒加载
- Pexels 图片 URL 添加压缩参数 `auto=compress&cs=tinysrgb&w=800`
- 分页加载，避免一次性加载过多数据
- 使用 `Promise.all` 并发请求提升加载速度

### 3. 跨端兼容性

**问题**：如何适配不同平台（微信小程序、H5）？

**解决方案：**
- 使用 UniApp 提供的条件编译
- 使用 `env(safe-area-inset-bottom)` 适配不同设备的安全区域
- 使用 `uni.getSystemInfoSync()` 获取系统信息动态适配
- 统一使用 rpx 单位确保不同屏幕尺寸下的显示效果

### 4. 数据清洗与兼容性

**问题**：如何处理旧版本数据的兼容性问题？

**解决方案：**
- 在 `initUserInfo()` 中实现数据清洗逻辑
- 检查关键字段缺失时使用默认值补全
- 自动修复不合法的数据（如包含 'unsplash' 的头像 URL）
- 同步修复后的数据回本地存储

### 5. 用户体验优化

**问题**：如何提升用户交互体验？

**解决方案：**
- 使用节流函数防止快速点击
- 添加加载状态和错误提示
- 实现流畅的页面切换动画
- 提供完善的操作反馈（Toast 提示）

## 🚀 快速开始

### 环境准备

确保已安装以下环境：

- **Node.js** (建议 v16+)
- **HBuilderX** 或 **VSCode**
- **微信开发者工具**（开发小程序需要）

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
# H5 预览
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin
# 然后在微信开发者工具中打开 unpackage/dist/dev/mp-weixin 目录

# App
npm run dev:app
```

### 构建项目

```bash
# 构建 H5
npm run build:h5

# 构建微信小程序
npm run build:mp-weixin

# 构建 App
npm run build:app
```

##  项目数据

### 壁纸分类

| 分类 ID | 分类名称 | 壁纸数量 | 数据来源 |
|---------|----------|----------|----------|
| 1 | 明星美女 | 100+ | 彼岸图网 |
| 2 | 动漫人物 | 100+ | 彼岸图网 |
| 3 | 二次元 | 100+ | 彼岸图网 |
| 4 | 氛围寓意 | 50+ | 彼岸图网 |
| 5 | 自然风景 | 80+ | Pexels |
| 6 | 治愈系 | 30+ | Pexels |
| 7 | 简约朴素 | 20+ | Pexels |
| 8 | 独特建筑 | 10+ | Pexels |

### 核心功能覆盖

- ✅ 壁纸浏览与预览
- ✅ 分类筛选与搜索
- ✅ 收藏功能
- ✅ 浏览历史
- ✅ 下载记录
- ✅ 评分系统
- ✅ 公告通知
- ✅ 用户登录

## 📝 注意事项

- 本项目为纯前端演示版本，不包含 `admin` 管理后台
- 所有壁纸及文案数据均在 `api/mockData.js` 中维护，可直接手动扩充
- 图片资源来自第三方平台，请注意版权问题
- 建议在生产环境中接入真实的后端 API 和数据库

## 🎯 项目亮点

1. **架构清晰**：采用分层架构，数据层、组件层、页面层职责分明
2. **代码规范**：使用 Vue 3 Composition API，代码简洁易维护
3. **用户体验**：流畅的动画、优雅的 UI 设计、完善的交互反馈
4. **性能优化**：懒加载、并发请求、节流防抖等优化手段
5. **可扩展性**：模块化设计，易于添加新功能和分类
6. **跨端支持**：一套代码同时支持微信小程序和 H5 平台

## 📄 许可证

MIT License

## 👨‍💻 开发者

空城旧梦

---

**感谢使用轻屏壁纸！如有问题或建议，欢迎反馈。**
