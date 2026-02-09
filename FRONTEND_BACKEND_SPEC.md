# SkillSwap 前后端对接开发文档 (v3.0 - 详尽版)

## 1. 项目概述与环境
本文档提供 SkillSwap 项目前后端对接的完整技术规范。所有字段定义、枚举值和接口格式均已确定，后端开发请严格遵守，勿使用未定义的字段。

### 1.1 部署环境
*   **生产环境 (Production)**: `https://skillswap.lat` (分支: `main`)
*   **开发环境 (Development)**: `https://develop-skillswap.site` (分支: `develop`)

### 1.2 跨域配置 (CORS)
后端需允许上述两个域名的跨域请求。

---

## 2. 数据字典与枚举 (Data Dictionary)

### 2.1 核心枚举值 (Enums)
后端数据库存储建议使用字符串或整型映射，API 交互使用以下字符串值：

**SkillType (技能类型)**
*   `Language`: 语言学习
*   `Tech`: 编程与技术
*   `Art`: 艺术与设计
*   `Fitness`: 运动健身
*   `Cooking`: 烹饪
*   `Music`: 音乐乐器
*   `Business`: 商业与职场
*   `Discovery`: 其他探索

**SessionStatus (交换会话状态)**
*   `pending`: 等待对方确认
*   `confirmed`: 已确认/即将开始
*   `completed`: 已结束
*   `cancelled`: 已取消

**MessageSender (消息发送者类型)**
*   `me`: 当前用户发送
*   `them`: 对方发送
*   `system`: 系统消息

**MessageType (消息内容类型)**
*   `text`: 普通文本
*   `ai_trans`: AI 翻译内容
*   `proposal`: 交换提议卡片

---

## 3. 数据模型详解 (Models)

### 3.1 User (用户)
| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| id | string | 是 | 用户唯一标识 (UUID) | "u_123456" |
| name | string | 是 | 显示名称 | "Jessica Parker" |
| avatar | string | 是 | 头像 URL | "https://cdn.../ava.jpg" |
| title | string | 否 | 职业头衔 | "Product Designer" |
| location | string | 否 | 地理位置 | "Madrid, Spain" |
| level | number | 否 | 用户等级 (1-10) | 3 |
| trustScore | number | 否 | 信任分 (0-100) | 98 |
| credits | number | 否 | 账户余额 | 24 |
| bio | string | 否 | 个人简介 | "I love coding..." |
| isPro | boolean | 否 | 是否为付费会员 | true |
| tags | string[] | 否 | 兴趣标签 | ["Travel", "Coding"] |

### 3.2 Skill (技能服务)
| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| id | number | 是 | 技能 ID | 101 |
| title | string | 是 | 技能标题 | "React Mastery" |
| user | string | 是 | 发布者名称 (冗余字段用于列表) | "David Kim" |
| avatar | string | 是 | 发布者头像 | "..." |
| type | string | 是 | 见 `SkillType` 枚举 | "Tech" |
| image | string | 是 | 封面图 URL | "..." |
| rating | number | 是 | 评分 (0.0-5.0) | 4.9 |
| lessons | number | 否 | 已授课次数 | 120 |
| speaks | string | 否 | 授课语言 | "English" |
| price | number | 是 | 价格 (Credits/次) | 2 |
| description | string | 否 | 详细描述 | "Learn React hooks..." |

### 3.3 Session (交换会话)
| 字段名 | 类型 | 必填 | 说明 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| id | number | 是 | 会话 ID | 501 |
| type | string | 是 | 列表分类: `upcoming`, `pending`, `past` | "upcoming" |
| status | string | 是 | 见 `SessionStatus` 枚举 | "confirmed" |
| title | string | 是 | 关联的技能标题 | "Spanish 101" |
| partner | string | 是 | 对方名称 | "Elena" |
| avatar | string | 是 | 对方头像 | "..." |
| date | string | 是 | 显示日期 | "Feb 15, 2026" |
| time | string | 是 | 显示时间段 | "14:00 - 15:00" |
| roomLink | string | 否 | 视频会议链接 (仅 confirmed 有效) | "https://zoom.us/..." |
| rated | boolean | 否 | 是否已评价 (仅 past 有效) | false |

---

## 4. API 接口文档 (API Reference)

### 4.1 认证与用户
#### `GET /api/user/me`
获取当前登录用户的完整信息。
**Response:**
```json
{
  "id": "u_123",
  "name": "Jessica Parker",
  "avatar": "https://...",
  "level": 3,
  "trustScore": 98,
  "credits": 24,
  "isPro": true
}
```

### 4.2 技能大厅
#### `GET /api/skills`
获取首页推荐或搜索结果。
**Query Params:**
*   `category`: (可选) 过滤类型，如 `Tech`
*   `search`: (可选) 搜索关键词

**Response:**
```json
[
  {
    "id": 1,
    "title": "Spanish Conversation",
    "user": "Elena Rodriguez",
    "type": "Language",
    "rating": 4.9,
    "price": 2,
    "image": "https://..."
  }
]
```

### 4.3 交换管理
#### `GET /api/sessions`
获取“我的交换”列表。
**Query Params:**
*   `filter`: `upcoming` | `pending` | `past`

**Response:**
```json
[
  {
    "id": 501,
    "type": "upcoming",
    "status": "confirmed",
    "title": "React & Tailwind",
    "partner": "David Kim",
    "date": "Tomorrow",
    "time": "10:00 - 11:00",
    "roomLink": "#"
  }
]
```

### 4.4 消息系统
#### `GET /api/messages/{contactId}`
获取与特定联系人的聊天记录。
**Response:**
```json
[
  {
    "id": 101,
    "sender": "them",
    "type": "text",
    "text": "Hola! Ready for our session?",
    "time": "10:30 AM"
  },
  {
    "id": 102,
    "sender": "me",
    "type": "proposal",
    "status": "pending",
    "skill_me": "Figma Tips",
    "skill_them": "Spanish Practice",
    "time_slot": "Tomorrow, 2:00 PM"
  }
]
```

---

## 5. 特殊功能实现指南

### 5.1 AI 辅助功能
前端在聊天框提供了 "AI Translate" 和 "Draft Contract" 按钮。
后端需提供统一接口处理此类请求：
**Endpoint:** `POST /api/ai/process`
**Request:**
```json
{
  "action": "translate", // 或 "contract", "schedule"
  "context": "Hola! Are we still on?", // 原文或上下文
  "targetLanguage": "zh-CN" // 可选
}
```
**Response:**
```json
{
  "result": "你好！我们要继续吗？",
  "confidence": 0.98
}
```

### 5.2 视频会议链接生成
当 `Session` 状态变为 `confirmed` 时，后端应自动生成视频会议链接（建议使用 Jitsi, Agora 或 Zoom API），并写入数据库的 `roomLink` 字段。前端在 "Upcoming" 列表直接调用此字段。
