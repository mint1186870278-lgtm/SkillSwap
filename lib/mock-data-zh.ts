
// Mock data translations for "user-generated" content demo
// This allows us to show a Chinese version of the forum posts and skills without a complex backend structure

export const MOCK_DATA_ZH: Record<string, any> = {
  // --- Posts (Forum) ---
  posts: {
    1: { title: "终于烤出了完美的酸种面包！🍞✨", tag: "烘焙" },
    2: { title: "今天在公园写生。下次有人想一起吗？", tag: "艺术" },
    3: { title: "跟着 @MikeChen 学陶艺三周后的成果。🏺", tag: "陶艺" },
    4: { title: "编程装备升级！准备好教 React 了。", tag: "技术" },
    5: { title: "晨间瑜伽流 🧘‍♀️ 开启美好一天的最佳方式。", tag: "健康" },
    6: { title: "学吉他比看起来难，但真的很有成就感！", tag: "音乐" },
    7: { title: "小公寓里的城市园艺 🌱", tag: "园艺" },
    8: { title: "深夜写作时间 ✍️ #小说创作中", tag: "写作" },
    9: { title: "探索京都的隐秘角落 🇯🇵", tag: "旅行" },
    10: { title: "DIY 置物架终于完工了！🔨", tag: "手工" },
    11: { title: "拉花练习。越来越好了！☕️", tag: "咖啡" },
    12: { title: "周日抽象画氛围 🎨", tag: "艺术" },
    13: { title: "徒步落基山脉。这景色！🏔️", tag: "徒步" },
    14: { title: "国际象棋策略研究。白方先走。", tag: "象棋" },
    15: { title: "素食备餐周 🥗", tag: "美食" },
  },

  // --- Skills (Find Skills) ---
  skills: {
    1: { title: "西班牙语会话", description: "来自马德里的母语者。专注于会话流利度和习语。", type: "语言" },
    2: { title: "React & Tailwind 精通", description: "资深前端工程师。学习如何用最新的 React 模式构建现代响应式 UI。", type: "技术" },
    3: { title: "城市摄影", description: "捕捉城市灵魂。我们将漫步市中心，练习构图和光影。", type: "艺术" },
    4: { title: "瑜伽入门", description: "哈他瑜伽认证。基础体式、呼吸技巧和正念的温和介绍。", type: "健身" },
    5: { title: "酸种面包烘焙", description: "从酵母到面包。学习发酵的艺术，在家烤出完美的酸种面包。", type: "烹饪" },
    6: { title: "吉他基础", description: "木吉他基础。和弦、扫弦模式和读谱。轻松有趣的氛围。", type: "音乐" },
    7: { title: "水彩画", description: "用水彩表达自己。风景、花卉和抽象艺术的技巧。", type: "艺术" },
    8: { title: "Python 数据科学", description: "Pandas 数据分析，Matplotlib 可视化，以及机器学习入门。", type: "技术" },
    9: { title: "素食烹饪", description: "美味的植物基食谱，易于制作且营养丰富。", type: "烹饪" },
    10: { title: "钢琴大师班", description: "古典钢琴曲目的高级技巧和诠释。试镜准备。", type: "音乐" },
    11: { title: "混合健身训练", description: "高强度功能性训练。建立力量、耐力和敏捷性。", type: "健身" },
    12: { title: "旅游法语", description: "法国旅行必备短语和文化贴士。点餐、问路等。", type: "语言" },
    13: { title: "陶艺工坊", description: "手工成型和拉坯技巧。上釉和烧制。欢迎所有水平。", type: "艺术" },
    14: { title: "SEO 基础", description: "提升 Google 排名。关键词研究、页面优化和反向链接策略。", type: "商业" },
    15: { title: "调酒学 101", description: "像专业人士一样调制经典鸡尾酒。了解烈酒、调酒器和装饰。", type: "烹饪" },
  },

  // --- Community Updates ---
  community_updates: {
    1: { text: "Sophie 刚刚跟 Mark 学会了 Python！" },
    2: { text: "市中心开始了新的'水彩画'小组。" },
    3: { text: "Liam 获得了'超级教师'徽章。" },
    4: { text: "Sarah 加入了'城市摄影'挑战。" },
    5: { text: "David 更新了他的'React 精通'课程。" },
    6: { text: "Emma 评论了'酸种面包烘焙'。" },
    7: { text: "Tom 正在寻找吉他老师。" },
    8: { text: "Anna 和 Robert 交换了技能。" },
    9: { text: "James 发布了新资源：'SEO 指南'。" },
    10: { text: "Linda 赞了你的'素食烹饪'技能。" },
    11: { text: "Alex 关注了你。" },
    12: { text: "咖啡师 Bob 正在直播：'拉花艺术 101'" },
  },

  // --- Sessions (Dashboard & Exchange) ---
  sessions: {
    1: { title: "西班牙语会话", status: "已确认" },
    2: { title: "React & Tailwind", status: "已确认" },
    6: { title: "钢琴基础", status: "已确认", date: "2月15日", time: "19:00" },
    7: { title: "数字营销 101", status: "已确认", date: "2月18日", time: "09:00" },
    8: { title: "法式烹饪", status: "已确认", date: "2月20日", time: "18:00" },
    3: { title: "摄影基础", status: "待接受", date: "2月12日", time: "16:30" },
    4: { title: "酸种面包烘焙", status: "已完成", date: "2月01日", time: "09:00" },
    5: { title: "吉他基础", status: "已完成", date: "1月28日", time: "18:00" },
    101: { title: "高级 CSS 布局", date: "今天", time: "16:00" },
    102: { title: "钢琴 101", date: "明天", time: "10:00" },
  },

  // --- User Posts (Profile) ---
  user_posts: {
    1: { content: "刚和 @Sarah 结束了一次愉快的陶艺课！🏺 迫不及待想下周给你们看上釉后的成品了。" },
    2: { content: "分享我 2026 年最爱用的 5 个 Figma 插件。快来看看！👇 #设计技巧" }
  },

  // --- Reviews ---
  reviews: {
    1: { text: "Jessica 是位很棒的老师！她把 Figma 自动布局解释得非常清楚。我终于搞懂了。强烈推荐！", date: "2天前", class: "Figma 精通" },
  },

  // --- Contacts ---
  contacts: {
    1: { lastMsg: "Hola! 明天还约吗？", skill: "西班牙语会话" },
    2: { lastMsg: "收到了，谢谢！周四下午4点我们第一次课怎么样？", skill: "React & Tailwind" },
    3: { lastMsg: "好！我会带相机。谢谢你在群里分享的陶艺技巧！", skill: "城市摄影" },
  },

  // --- Messages ---
  messages: {
    // Keep proposal structure translated but messages in original language (English)
    // 8: { skill_me: "Figma Skills", skill_them: "Spanish Practice", time_slot: "Tomorrow, 2:00 PM" }
  }
};
