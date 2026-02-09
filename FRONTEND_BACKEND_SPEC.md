# SkillSwap 前后端对接开发文档 (v2.0)

## 1. 文档概述
本文档旨在指导后端开发人员与 SkillSwap 前端进行数据对接。
前端已完成**数据层与视图层的解耦**，所有数据模型定义和模拟数据均已集中管理。后端开发应严格遵循前端定义的数据结构，以确保对接过程零摩擦。

*   **前端技术栈**: Next.js 15, React 18, Tailwind CSS, TypeScript
*   **核心参考文件**:
    *   数据类型定义: `types.ts` (这是前后端的数据契约)
    *   模拟数据示例: `data/mock.ts` (这是前端期望的 API 返回结果示例)

---

## 2. 核心数据模型 (Data Models)

请后端数据库设计和 API Response 结构直接参考前端 `types.ts` 中的定义。

### 2.1 用户 (User)
对应 `types.ts` 中的 `User` 接口。
```typescript
interface User {
  id: string | number;
  name: string;
  avatar: string;       // URL
  title?: string;       // e.g. "Product Designer"
  location?: string;
  level?: number;
  trustScore?: number;  // 0-100
  credits?: number;     // 虚拟货币余额
  isPro?: boolean;      // 会员状态
  // ...
}
```

### 2.2 技能 (Skill)
对应 `types.ts` 中的 `Skill` 接口。
```typescript
interface Skill {
  id: number;
  title: string;
  type: string;         // 分类: Language, Tech, Art 等
  rating: number;       // e.g. 4.9
  price: number;        // Credits per session
  lessons: number;      // 已授课数量
  user: string;         // 关联的 User Name (或 User Object)
  // ...
}
```

### 2.3 交换会话 (Session/Exchange)
对应 `types.ts` 中的 `Session` 接口。这是核心业务实体。
```typescript
interface Session {
  id: number;
  type: 'upcoming' | 'pending' | 'past'; // 状态流转
  title: string;        // 课程标题
  partner: string;      // 交易对象
  date: string;         // "Today", "Feb 12" (建议后端返回 ISO 8601, 前端格式化)
  time: string;         // "14:00 - 15:00"
  status: string;       // "Confirmed", "Waiting"
  meetingLink?: string; // 视频会议链接 (Zoom/Agora)
  // ...
}
```

---

## 3. API 接口需求清单

请按照以下模块提供 RESTful API 接口。

### 3.1 认证与用户 (Auth & User)
| Method | Endpoint | Description | Response Ref |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | 登录 | Token + `User` |
| `GET` | `/api/user/me` | 获取当前用户信息 | `User` |
| `GET` | `/api/user/{id}` | 获取特定用户公开资料 | `User` + `Skill[]` |

### 3.2 探索与技能 (Explore)
| Method | Endpoint | Description | Response Ref |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | 获取技能列表 (支持 filter/search) | `Skill[]` (见 `MOCK_SKILLS`) |
| `GET` | `/api/posts` | 获取社区动态列表 | `Post[]` (见 `MOCK_POSTS`) |
| `GET` | `/api/activity` | 获取全站实时动态 | `CommunityUpdate[]` |

### 3.3 交换管理 (Exchanges)
| Method | Endpoint | Description | Response Ref |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/sessions` | 获取我的交换列表 (Upcoming/History) | `Session[]` (见 `SESSIONS` & `UPCOMING_SESSIONS`) |
| `POST` | `/api/sessions` | 发起新的交换请求 | `Session` |
| `PUT` | `/api/sessions/{id}/status` | 接受/拒绝/取消 | `Session` |
| `POST` | `/api/sessions/{id}/rate` | 评价已完成的交换 | `Success` |

### 3.4 消息 (Messages)
| Method | Endpoint | Description | Response Ref |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/contacts` | 获取最近联系人列表 | `Contact[]` (见 `CONTACTS`) |
| `GET` | `/api/messages/{chatId}` | 获取特定聊天的历史记录 | `Message[]` (见 `MESSAGES`) |
| `POST` | `/api/messages` | 发送消息 | `Message` |

---

## 4. 关键集成说明 (Integration Notes)

### 4.1 视频会议 (Video Room)
前端在 "Upcoming Sessions" 卡片中有一个 "Join Room" 按钮。
*   **需求**: 后端需在 `Session` 对象中返回 `meetingLink` 或 `roomToken`。
*   **建议**: 集成 Agora, Zoom SDK 或 Jitsi。

### 4.2 实时通信 (Real-time)
聊天功能和状态更新需要实时性。
*   **技术**: 建议使用 WebSocket (Socket.io)。
*   **事件**:
    *   `msg_receive`: 接收新消息。
    *   `status_update`: 交换请求状态变更 (如对方接受了请求)。

### 4.3 图片处理
目前前端使用的是 Unsplash 的 Mock URL。
*   **需求**: 生产环境需要对接对象存储 (AWS S3 / OSS)。
*   **字段**: 所有涉及 `avatar`, `image` 的字段应返回完整的 CDN URL。

### 4.4 AI 功能对接
聊天栏中的 AI Tools (Translate, Suggest Time, Draft Contract) 是前端的一大亮点。
*   **接口**: `/api/ai/process`
*   **参数**: `{ type: 'translate' | 'contract', context: string }`
*   **逻辑**: 后端调用 OpenAI/Claude API 处理并返回结果。

---

## 5. 开发建议路径
1.  后端依据 `types.ts` 生成 Swagger/OpenAPI 文档。
2.  后端优先实现 `/api/user/me` 和 `/api/skills` 接口。
3.  前端将 `data/mock.ts` 替换为 API 调用逻辑 (Axios + SWR)。
