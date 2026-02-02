# 青平壁纸 API 接口文档

## 📋 目录

- [基础信息](#基础信息)
- [通用说明](#通用说明)
- [用户端接口](#用户端接口)
- [管理端接口](#管理端接口)
- [错误码说明](#错误码说明)

---

## 基础信息

### 接口地址
```
生产环境: https://qingping-wallpaper-api.1628973345.workers.dev
```

### 认证方式
管理端接口需要在请求头中携带 Token：
```
Authorization: Bearer {token}
```

### 请求格式
- Content-Type: `application/json`
- 请求方法: GET / POST

### 响应格式
```json
{
  "errCode": 0,
  "errMsg": "success",
  "data": {}
}
```

---

## 通用说明

### 分页参数
所有列表接口支持分页：
- `pageNum`: 页码（从 1 开始）
- `pageSize`: 每页数量（默认 10）

### 状态码
- `200`: 请求成功
- `400`: 参数错误
- `401`: 未授权
- `404`: 资源不存在
- `429`: 请求过于频繁
- `500`: 服务器错误

---

## 用户端接口

### 1. 获取轮播图列表

**接口地址：**
```
GET /api/user/banner/list
```

**请求参数：**
无

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "bannerList": [
    {
      "id": 1,
      "pic_url": "https://example.com/banner1.jpg",
      "jump_url": "https://example.com",
      "sort": 1,
      "status": 1,
      "create_time": 1234567890
    }
  ]
}
```

---

### 2. 获取公告列表

**接口地址：**
```
GET /api/user/notice/list
```

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 公告类型 |
| pageNum | number | 否 | 页码（默认 1） |
| pageSize | number | 否 | 每页数量（默认 10） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "list": [
    {
      "id": 1,
      "title": "系统公告",
      "type": "system",
      "content": "欢迎使用青平壁纸",
      "status": 1,
      "create_time": 1234567890
    }
  ],
  "total": 10
}
```

---

### 3. 获取壁纸列表

**接口地址：**
```
GET /api/user/wallpaper/list
```

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| class_id | number | 否 | 分类 ID |
| pageNum | number | 否 | 页码（默认 1） |
| pageSize | number | 否 | 每页数量（默认 10） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "list": [
    {
      "id": 1,
      "class_id": 1,
      "pic_url": "https://example.com/wallpaper1.jpg",
      "title": "风景壁纸",
      "tags": ["风景", "自然"],
      "desc": "美丽的风景壁纸",
      "status": 1,
      "score": 4.5,
      "score_count": 10,
      "download_count": 100,
      "create_time": 1234567890,
      "update_time": 1234567890
    }
  ],
  "total": 100
}
```

---

### 4. 获取壁纸详情

**接口地址：**
```
GET /api/user/wallpaper/detail
```

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 壁纸 ID |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "wallpaper": {
    "id": 1,
    "class_id": 1,
    "pic_url": "https://example.com/wallpaper1.jpg",
    "title": "风景壁纸",
    "tags": ["风景", "自然"],
    "desc": "美丽的风景壁纸",
    "status": 1,
    "score": 4.5,
    "score_count": 10,
    "download_count": 100,
    "create_time": 1234567890,
    "update_time": 1234567890
  }
}
```

---

### 5. 壁纸评分

**接口地址：**
```
POST /api/user/wallpaper/score
```

**请求参数：**
```json
{
  "wall_id": 1,
  "score": 5
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| wall_id | number | 是 | 壁纸 ID |
| score | number | 是 | 评分（1-5） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success"
}
```

---

### 6. 添加用户行为

**接口地址：**
```
POST /api/user/behavior/add
```

**请求参数：**
```json
{
  "type": "download",
  "wall_id": 1,
  "openid": "user123"
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 是 | 行为类型（download/like/view） |
| wall_id | number | 是 | 壁纸 ID |
| openid | string | 否 | 用户 OpenID |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success"
}
```

---

### 7. 检查用户行为

**接口地址：**
```
GET /api/user/behavior/check
```

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 是 | 行为类型 |
| wall_id | number | 是 | 壁纸 ID |
| openid | string | 否 | 用户 OpenID |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "exists": true
}
```

---

### 8. 搜索壁纸

**接口地址：**
```
GET /api/user/search
```

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| pageNum | number | 否 | 页码（默认 1） |
| pageSize | number | 否 | 每页数量（默认 10） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "list": [
    {
      "id": 1,
      "class_id": 1,
      "pic_url": "https://example.com/wallpaper1.jpg",
      "title": "风景壁纸",
      "tags": ["风景", "自然"],
      "desc": "美丽的风景壁纸",
      "status": 1,
      "score": 4.5,
      "score_count": 10,
      "download_count": 100,
      "create_time": 1234567890,
      "update_time": 1234567890
    }
  ]
}
```

---

### 9. 获取热门搜索

**接口地址：**
```
GET /api/user/search/hot
```

**请求参数：**
无

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "hotSearch": ["风景", "美女", "动漫", "游戏", "星空", "城市", "自然", "动物", "汽车", "科技"]
}
```

---

## 管理端接口

### 1. 管理员登录

**接口地址：**
```
POST /api/admin/login
```

**请求参数：**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "token": "admin_1_1234567890_abc123",
  "expireTime": 1234567890000
}
```

**安全说明：**
- 连续 3 次登录失败将锁定账号 10 分钟
- Token 有效期为 7 天
- Token 需要在后续请求中携带

---

### 2. 获取壁纸列表（管理端）

**接口地址：**
```
GET /api/admin/wallpaper/list
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pageNum | number | 否 | 页码（默认 1） |
| pageSize | number | 否 | 每页数量（默认 10） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "list": [
    {
      "id": 1,
      "class_id": 1,
      "pic_url": "https://example.com/wallpaper1.jpg",
      "title": "风景壁纸",
      "tags": ["风景", "自然"],
      "desc": "美丽的风景壁纸",
      "status": 1,
      "score": 4.5,
      "score_count": 10,
      "download_count": 100,
      "create_time": 1234567890,
      "update_time": 1234567890
    }
  ],
  "total": 100
}
```

---

### 3. 添加壁纸

**接口地址：**
```
POST /api/admin/wallpaper/add
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "title": "风景壁纸",
  "class_id": 1,
  "pic_url": "https://example.com/wallpaper1.jpg",
  "tags": ["风景", "自然"],
  "desc": "美丽的风景壁纸",
  "status": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 是 | 壁纸标题 |
| class_id | number | 是 | 分类 ID |
| pic_url | string | 是 | 图片 URL |
| tags | array | 否 | 标签数组 |
| desc | string | 否 | 描述 |
| status | number | 否 | 状态（1-启用，0-禁用） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "id": 1
}
```

---

### 4. 更新壁纸

**接口地址：**
```
POST /api/admin/wallpaper/update
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "id": 1,
  "title": "风景壁纸",
  "class_id": 1,
  "pic_url": "https://example.com/wallpaper1.jpg",
  "tags": ["风景", "自然"],
  "desc": "美丽的风景壁纸",
  "status": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 壁纸 ID |
| title | string | 是 | 壁纸标题 |
| class_id | number | 是 | 分类 ID |
| pic_url | string | 是 | 图片 URL |
| tags | array | 否 | 标签数组 |
| desc | string | 否 | 描述 |
| status | number | 否 | 状态（1-启用，0-禁用） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success"
}
```

---

### 5. 删除壁纸

**接口地址：**
```
POST /api/admin/wallpaper/delete
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "id": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 壁纸 ID |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success"
}
```

---

### 6. 获取分类列表

**接口地址：**
```
GET /api/admin/classify/list
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
无

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "list": [
    {
      "id": 1,
      "name": "风景",
      "cover_url": "https://example.com/cover1.jpg",
      "desc": "风景壁纸分类",
      "sort": 1,
      "wall_count": 50,
      "update_time": 1234567890
    }
  ]
}
```

---

### 7. 添加分类

**接口地址：**
```
POST /api/admin/classify/add
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "name": "风景",
  "cover_url": "https://example.com/cover1.jpg",
  "desc": "风景壁纸分类",
  "sort": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 分类名称 |
| cover_url | string | 是 | 封面 URL |
| desc | string | 否 | 描述 |
| sort | number | 否 | 排序 |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "id": 1
}
```

---

### 8. 更新分类

**接口地址：**
```
POST /api/admin/classify/update
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "id": 1,
  "name": "风景",
  "cover_url": "https://example.com/cover1.jpg",
  "desc": "风景壁纸分类",
  "sort": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 分类 ID |
| name | string | 是 | 分类名称 |
| cover_url | string | 是 | 封面 URL |
| desc | string | 否 | 描述 |
| sort | number | 否 | 排序 |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success"
}
```

---

### 9. 删除分类

**接口地址：**
```
POST /api/admin/classify/delete
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "id": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 分类 ID |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success"
}
```

---

### 10. 获取轮播图列表（管理端）

**接口地址：**
```
GET /api/admin/banner/list
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
无

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "list": [
    {
      "id": 1,
      "pic_url": "https://example.com/banner1.jpg",
      "jump_url": "https://example.com",
      "sort": 1,
      "status": 1,
      "create_time": 1234567890
    }
  ]
}
```

---

### 11. 添加轮播图

**接口地址：**
```
POST /api/admin/banner/add
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "pic_url": "https://example.com/banner1.jpg",
  "jump_url": "https://example.com",
  "sort": 1,
  "status": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pic_url | string | 是 | 图片 URL |
| jump_url | string | 否 | 跳转 URL |
| sort | number | 否 | 排序 |
| status | number | 否 | 状态（1-启用，0-禁用） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "id": 1
}
```

---

### 12. 更新轮播图

**接口地址：**
```
POST /api/admin/banner/update
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "id": 1,
  "pic_url": "https://example.com/banner1.jpg",
  "jump_url": "https://example.com",
  "sort": 1,
  "status": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 轮播图 ID |
| pic_url | string | 是 | 图片 URL |
| jump_url | string | 否 | 跳转 URL |
| sort | number | 否 | 排序 |
| status | number | 否 | 状态（1-启用，0-禁用） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success"
}
```

---

### 13. 删除轮播图

**接口地址：**
```
POST /api/admin/banner/delete
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "id": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 轮播图 ID |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success"
}
```

---

### 14. 获取公告列表（管理端）

**接口地址：**
```
GET /api/admin/notice/list
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pageNum | number | 否 | 页码（默认 1） |
| pageSize | number | 否 | 每页数量（默认 10） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "list": [
    {
      "id": 1,
      "title": "系统公告",
      "type": "system",
      "content": "欢迎使用青平壁纸",
      "status": 1,
      "create_time": 1234567890
    }
  ],
  "total": 10
}
```

---

### 15. 添加公告

**接口地址：**
```
POST /api/admin/notice/add
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "title": "系统公告",
  "type": "system",
  "content": "欢迎使用青平壁纸",
  "status": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 是 | 公告标题 |
| type | string | 否 | 公告类型（默认 system） |
| content | string | 是 | 公告内容 |
| status | number | 否 | 状态（1-启用，0-禁用） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "id": 1
}
```

---

### 16. 更新公告

**接口地址：**
```
POST /api/admin/notice/update
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "id": 1,
  "title": "系统公告",
  "type": "system",
  "content": "欢迎使用青平壁纸",
  "status": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 公告 ID |
| title | string | 是 | 公告标题 |
| type | string | 否 | 公告类型（默认 system） |
| content | string | 是 | 公告内容 |
| status | number | 否 | 状态（1-启用，0-禁用） |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success"
}
```

---

### 17. 删除公告

**接口地址：**
```
POST /api/admin/notice/delete
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "id": 1
}
```

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 公告 ID |

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success"
}
```

---

### 18. 获取统计数据

**接口地址：**
```
GET /api/admin/statistics
```

**请求头：**
```
Authorization: Bearer {token}
```

**请求参数：**
无

**响应示例：**
```json
{
  "errCode": 0,
  "errMsg": "success",
  "statistics": {
    "wallpaperCount": 100,
    "classifyCount": 10,
    "downloadCount": 1000,
    "userBehaviorCount": 500
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 参数错误 |
| 401 | 未授权（Token 无效或过期） |
| 404 | 资源不存在 |
| 429 | 请求过于频繁（账号锁定） |
| 500 | 服务器内部错误 |

---

## 测试工具

### 使用 curl 测试

**登录接口：**
```bash
curl -X POST https://qingping-wallpaper-api.1628973345.workers.dev/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**获取壁纸列表：**
```bash
curl -X GET "https://qingping-wallpaper-api.1628973345.workers.dev/api/user/wallpaper/list?pageNum=1&pageSize=10"
```

### 使用 Postman 测试

1. 创建新的请求
2. 设置请求方法和 URL
3. 添加请求头（Content-Type: application/json）
4. 添加请求体（POST 请求）
5. 发送请求并查看响应

---

## 更新日志

### v2.0.0 (2024-01-27)
- ✅ 优化代码结构，减少重复
- ✅ 添加密码加密功能
- ✅ 优化日志系统
- ✅ 添加常量定义
- ✅ 统一错误处理机制

### v1.0.0 (2024-01-01)
- ✅ 初始版本发布
- ✅ 完成基础 CRUD 功能
- ✅ 实现用户端和管理端接口

---

## 联系方式

如有问题，请联系：
- 邮箱: support@example.com
- 文档地址: https://example.com/docs

---

**文档版本：** v2.0.0  
**最后更新：** 2024-01-27