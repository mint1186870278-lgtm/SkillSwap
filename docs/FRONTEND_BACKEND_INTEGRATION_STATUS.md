# 前后端对接状态一览

> 梳理前端已对接的 API、后端可接的端口、以及前端尚未落实的部分。

---

## 一、前端 API 调用与后端路由对应

| 前端调用 | 方法 | 路径 | Next.js 路由 | 前端使用位置 | 状态 |
|---------|------|------|--------------|-------------|------|
| `fetchCurrentUser` | GET | `/user/me` | ✅ `app/api/user/me` | AuthContext, UserProfileView | **可对接** |
| `fetchSkills` | GET | `/skills?category&search` | ✅ `app/api/skills` | MainAppLayout(Explore), 发现页 | **可对接** |
| `fetchSessions` | GET | `/sessions?filter&dashboard` | ✅ `app/api/sessions` | MainAppLayout(Home), ExchangeView | **可对接** |
| `fetchContacts` | GET | `/contacts` | ✅ `app/api/contacts` | MessagesView | **可对接** |
| `fetchMessages` | GET | `/messages/:contactId` | ✅ `app/api/messages/[contactId]` | MessagesView | **可对接** |
| `sendMessage` | POST | `/messages/:contactId` | ✅ `app/api/messages/[contactId]` | MessagesView 发消息 | **可对接** |
| `fetchPosts` | GET | `/posts` | ✅ `app/api/posts` | MainAppLayout(Explore), 全部帖子 | **可对接** |
| `fetchCommunityUpdates` | GET | `/community` | ✅ `app/api/community` | MainAppLayout, Dashboard 动态 | **可对接** |
| `fetchExchangeFeedbackPosts` | GET | `/exchange-feedback` | ✅ `app/api/exchange-feedback` | MainAppLayout(Explore), 交换反馈 Tab | **可对接** |
| `fetchUserPosts` | GET | `/user-posts` | ✅ `app/api/user-posts` | UserProfileView 我的帖子 | **可对接** |
| `fetchReviews` | GET | `/reviews` | ✅ `app/api/reviews` | UserProfileView 评价 | **可对接** |
| `fetchSimilarExperts` | GET | `/similar-experts` | ✅ `app/api/similar-experts` | SkillDetailView 相似专家 | **可对接** |
| `fetchExchangeStats` | GET | `/exchange-stats` | ✅ `app/api/exchange-stats` | ExchangeView 交换统计 | **可对接** |
| `fetchUserLearningStats` | GET | `/user/learning-stats` | ✅ `app/api/user/learning-stats` | MainAppLayout(Dashboard) 学习/收藏数 | **可对接** |
| `fetchUserNFTs` | GET | `/nfts?userId=` | ✅ `app/api/nfts` | SkillDetailView, UserProfileView | **可对接** |
| `fetchNFTDetail` | GET | `/nfts/:id` | ✅ `app/api/nfts/[id]` | SkillDetailView, UserProfileView NFT 详情 | **可对接** |
| `processAI` | POST | `/ai/process` | ✅ `app/api/ai/process` | MessagesView 翻译/合同/约时间 | **可对接** |
| `sendAiMatchMessage` | POST | `/ai/match/chat` | ✅ `app/api/ai/match/chat` | MainAppLayout AI 配对助手 | **可对接** |

---

## 二、后端可接的端口（前端已落实）

以下接口前端已完整对接，后端只需实现相同路径与数据格式即可替换当前 Next.js 路由：

### 2.1 用户与认证
- **GET /user/me** — 当前用户信息（id, name, avatar, level, trustScore, credits, isPro 等）

### 2.2 发现与社区
- **GET /skills** — 技能列表，支持 `?category=`、`?search=`
- **GET /posts** — 用户自发帖（全部帖子 Tab）
- **GET /community** — 社区动态（Dashboard 右侧）
- **GET /exchange-feedback** — 交换反馈帖（交换反馈 Tab）
- **GET /similar-experts** — 技能详情页「相似专家」

### 2.3 交换与消息
- **GET /sessions** — 交换会话，支持 `?filter=`、`?dashboard=true`
- **GET /exchange-stats** — 交换统计（总时长、等级、创造价值等）
- **GET /contacts** — 联系人列表
- **GET /messages/:contactId** — 与某联系人的聊天记录
- **POST /messages/:contactId** — 发送消息

### 2.4 个人中心
- **GET /user-posts** — 当前用户发的帖子
- **GET /reviews** — 当前用户收到的评价
- **GET /user/learning-stats** — 学习进行中数、已收藏数
- **GET /nfts** — NFT 列表，支持 `?userId=` 查指定用户
- **GET /nfts/:id** — NFT 详情

### 2.5 AI
- **POST /ai/process** — 翻译 / 合同 / 约时间
- **POST /ai/match/chat** — AI 配对助手对话

---

## 三、前端尚未落实 / 需补充的部分

| 功能 | 说明 | 建议 |
|------|------|------|
| **请求交换 / 联系交换** | 技能详情页「请求交换」「联系交换」按钮 | 仅 UI，未绑定 API，需后端提供交换请求接口 |
| **交换确认流程** | 双方确认后自动创建交换反馈帖 | 前端无完整流程，需后端在确认时创建反馈帖 |
| **社交账号授权** | B站、小红书等授权入口 | 仅文档规划，前端未实现 |
| **AI 可信度评分** | 技能详情页 92/100 评分 | 当前写死，需后端提供基于社交数据的评分接口 |
| **收藏 / 取消收藏技能** | 技能卡片收藏按钮 | 未实现 |
| **交换反馈帖进度更新** | 详情弹窗「添加进度」按钮 | 仅 UI，未绑定 API |
| **通知列表** | 导航栏铃铛下拉 | 当前为 Mock，需后端提供通知接口 |
| **视频会议链接** | Session 的 roomLink | 依赖后端在 confirmed 时生成 |

---

## 四、路径与部署说明

- **前端 api-client** 请求路径：`/user/me`、`/skills`、`/exchange-feedback` 等（无 `/api` 前缀）
- **Next.js 本地路由** 在 `app/api/` 下，对应 `/api/user/me`、`/api/skills` 等
- **对接方式**：
  - 使用本地 Next.js 路由：`NEXT_PUBLIC_API_BASE_URL=/api`，则请求变为 `/api/user/me` 等
  - 对接外部后端：`NEXT_PUBLIC_API_BASE_URL=https://your-api.com`（若后端接口在 `/api/xxx` 则填 `https://your-api.com/api`）
- **认证**：请求头 `Authorization: Bearer <token>`，token 来自 `localStorage.auth_token`

---

## 五、数据格式参考

详见 `FRONTEND_BACKEND_SPEC.md`。关键结构：

- **ExchangeFeedbackPost**：id, user, avatar, title, content, image, likes, comments, skillMe, skillThem, partner, partnerAvatar, progressUpdates, type: 'exchange_feedback'
- **UserLearningStats**：learningInProgress, savedCount
- **UserNFT**：id, title, partner, partnerAvatar, skillMe, skillThem, contributionMe, contributionThem
- **NFTDetail**：含 story, timeline 等
