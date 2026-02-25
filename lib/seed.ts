import { getDb } from './db';

export function seedDatabase() {
  const db = getDb();

  // Check if already seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
  if (userCount.count > 0) return;

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, avatar, title, location, level, trust_score, credits, bio, is_pro, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSkill = db.prepare(`
    INSERT INTO skills (id, title, user_name, avatar, type, distance, image, rating, lessons, speaks, price, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSession = db.prepare(`
    INSERT INTO sessions (id, type, skill, title, partner, "with", avatar, date, time, status, room_link, meeting_link, rated, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertContact = db.prepare(`
    INSERT INTO contacts (id, name, avatar, last_msg, time, unread, status, skill)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMessage = db.prepare(`
    INSERT INTO messages (id, contact_id, sender, text, time, type, status, skill_me, skill_them, time_slot, icon)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPost = db.prepare(`
    INSERT INTO posts (id, title, content, user_name, avatar, image, likes, comments, tag, time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertCommunityUpdate = db.prepare(`
    INSERT INTO community_updates (id, text, time, icon, color)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertSimilarExpert = db.prepare(`
    INSERT INTO similar_experts (name, image, lessons, rating, price)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertUserPost = db.prepare(`
    INSERT INTO user_posts (id, user_id, content, image, likes, comments, time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertReview = db.prepare(`
    INSERT INTO reviews (user_name, avatar, rating, date, text, class)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const seed = db.transaction(() => {
    // --- Users ---
    insertUser.run('u_jessica', 'Jessica Parker',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      '产品设计师', '美国旧金山', 3, 98, 24,
      '白天的数字设计师，晚上的陶艺爱好者。我喜欢分享 Figma 技巧，也期待学习如何烘焙完美的酸种面包！',
      1, JSON.stringify(['旅行', '编程', '设计', '陶艺']));

    // --- Skills ---
    const skills = [
      [1, '西班牙语会话', 'Elena Rodriguez', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 'Language', '0.5km', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 4.9, 342, 'Spanish', 2, '来自马德里的西班牙语母语者。我专注于会话流利度和地道表达。'],
      [2, 'React & Tailwind 精通', 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'Tech', '在线', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80', 5.0, 120, 'English', 3, '高级前端工程师。学习如何使用最新的 React 模式构建现代、响应式的 UI。'],
      [3, '城市摄影', 'Sarah Jenks', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', 'Art', '2.1km', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', 4.8, 85, 'English', 2, '捕捉城市的灵魂。我们将穿过市中心，练习构图和光线运用。'],
      [4, '瑜伽入门', 'Mike Chen', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 'Fitness', '1.2km', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80', 4.9, 560, 'Chinese', 1, '哈他瑜伽认证。温和地介绍基本体式、呼吸技巧和正念。'],
      [5, '酸种面包烘焙', 'Emma Wilson', 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&w=150&q=80', 'Cooking', '3.0km', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 4.7, 45, 'English', 1, '从酵种到面包。学习发酵的艺术，在家烘焙完美的酸种面包。'],
      [6, '吉他基础', 'Alex Turner', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'Music', '4.5km', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80', 4.8, 210, 'English', 2, '原声吉他基础。和弦、扫弦模式和读谱。有趣轻松的氛围。'],
      [7, '水彩画', 'Anna Li', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', 'Art', '1.5km', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80', 4.9, 150, 'Chinese', 2, '用水彩表达自己。风景、花卉和抽象艺术的技巧。'],
      [8, 'Python 数据科学', 'James O.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', 'Tech', '在线', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', 5.0, 800, 'English', 4, '使用 Pandas 进行数据分析，Matplotlib 可视化，以及机器学习入门。'],
      [9, '素食烹饪', 'Linda Green', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', 'Cooking', '2.0km', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', 4.6, 90, 'English', 1, '美味的植物基食谱，制作简单且营养丰富。'],
      [10, '钢琴大师班', 'Robert Fox', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'Music', '5.0km', 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=600&q=80', 4.9, 400, 'German', 3, '古典钢琴曲目的高级技巧和诠释。试镜准备。'],
      [11, '混合健身训练', 'Tom Hardy', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', 'Fitness', '0.8km', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80', 4.8, 300, 'English', 2, '高强度功能性训练。建立力量、耐力和敏捷性。'],
      [12, '旅游法语', 'Sophie Marceau', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Language', '在线', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', 4.7, 180, 'French', 2, '法国旅行的必备短语和文化贴士。点餐、问路等。'],
      [13, '陶艺工作坊', 'Pat M.', 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=150&q=80', 'Art', '3.5km', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80', 4.9, 220, 'English', 2, '手工成型和拉坯技巧。上釉和烧制。欢迎所有水平。'],
      [14, 'SEO 基础', 'Gary V.', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80', 'Business', '在线', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=600&q=80', 4.5, 1000, 'English', 5, '在 Google 上获得更高排名。关键词研究、页面优化和反向链接策略。'],
      [15, '调酒学 101', 'Barney S.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', 'Cooking', '1.0km', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', 4.8, 150, 'English', 2, '像专业人士一样调制经典鸡尾酒。了解烈酒、调酒饮料和装饰。'],
    ];
    for (const s of skills) {
      insertSkill.run(...s);
    }

    // --- Sessions (Exchange view + Dashboard upcoming) ---
    // Exchange view sessions
    const sessions = [
      [1, 'upcoming', '西班牙语会话', null, 'Elena Rodriguez', null, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', '今天', '14:00 - 15:00', '已确认', '#', null, 0, null],
      [2, 'upcoming', 'React & Tailwind', null, 'David Kim', null, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', '明天', '10:00 - 11:00', '已确认', '#', null, 0, null],
      [6, 'upcoming', '钢琴基础', null, 'Marcus Chen', null, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', '2月 15, 2026', '19:00 - 20:00', '已确认', '#', null, 0, null],
      [7, 'upcoming', '数字营销 101', null, 'Sophie Anderson', null, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', '2月 18, 2026', '09:00 - 10:30', '已确认', '#', null, 0, null],
      [8, 'upcoming', '法式烹饪', null, 'Jean-Pierre', null, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', '2月 20, 2026', '18:00 - 19:30', '已确认', '#', null, 0, null],
      [3, 'pending', '摄影基础', null, 'Sarah Jenks', null, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', '2月 12, 2026', '16:30 - 17:30', '等待接受', null, null, 0, null],
      [4, 'past', '酸种面包烘焙', null, 'Emma Wilson', null, 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&w=150&q=80', '2月 01, 2026', '09:00 - 10:00', '已完成', null, null, 1, 5],
      [5, 'past', '吉他基础', null, 'Alex Turner', null, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', '1月 28, 2026', '18:00 - 19:00', '已完成', null, null, 0, null],
      // Dashboard upcoming sessions (different type format)
      [101, 'Learning', null, '高级 CSS 布局', null, 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', null, '今天, 4:00 PM', null, null, '#', 0, null],
      [102, 'Teaching', null, '钢琴 101', null, 'Alice Mu', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', null, '明天, 10:00 AM', null, null, '#', 0, null],
    ];
    for (const s of sessions) {
      insertSession.run(...s);
    }

    // --- Contacts ---
    const contacts = [
      [1, 'Elena Rodriguez', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 'Hola! 明天的课还照常吗？', '2分钟前', 2, 'online', '西班牙语会话'],
      [2, 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', '我把项目文件发给你了。', '1小时前', 0, 'offline', 'React 指导'],
      [3, 'Sarah Jenks', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', '谢谢你的陶艺建议！', '1天前', 0, 'online', '陶艺基础'],
    ];
    for (const c of contacts) {
      insertContact.run(...c);
    }

    // --- Messages (for contact 1: Elena) ---
    const messages = [
      [1, 1, 'them', 'Hola Jessica! 我注意到你有兴趣提高你的西班牙语会话能力。', '10:30 AM', 'text', null, null, null, null, null],
      [2, 1, 'me', '嗨 Elena! 是的，我在大学学过一些基础，但我需要练习口语。', '10:32 AM', 'text', null, null, null, null, null],
      [3, 1, 'them', '太好了！我很乐意帮你。我正在找人帮我解决 Figma 自动布局的问题。', '10:33 AM', 'text', null, null, null, null, null],
      [4, 1, 'system', '翻译: Perfect! I would love to help you. I am looking for someone to help me with Figma auto-layout.', null, 'ai_trans', null, null, null, null, 'Globe'],
      [5, 1, 'me', '听起来是个完美的匹配！我每天都用 Figma。', '10:34 AM', 'text', null, null, null, null, null],
      [6, 1, 'me', '我们做一个1小时的交换怎么样？30分钟西班牙语，30分钟 Figma。', '10:35 AM', 'text', null, null, null, null, null],
      [7, 1, 'them', '听起来很公平。你什么时候有空？', '10:36 AM', 'text', null, null, null, null, null],
      [8, 1, 'me', null, null, 'proposal', 'pending', 'Figma 技巧', '西班牙语练习', '明天, 2:00 PM', null],
    ];
    for (const m of messages) {
      insertMessage.run(...m);
    }

    // --- Posts ---
    const posts = [
      [1, '终于烤出了我第一个完美的酸种面包！ \ud83c\udf5e\u2728', null, 'Emma Wilson', 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80', 124, 0, '烘焙', null],
      [2, '今天在公园写生。下次有人想一起吗？', null, 'Sarah Jenks', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80', 89, 0, '艺术', null],
      [3, '跟 @MikeChen 学习3周后的陶艺进展。 \ud83c\udff0', null, 'Jessica L.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=80', 256, 0, '陶艺', null],
      [4, '编码装备升级！准备好教 React 了。', null, 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=600&q=80', 412, 0, '科技', null],
      [5, '晨间瑜伽流 \ud83e\uddd8\u200d\u2640\ufe0f 开启一天的最佳方式。', null, 'Mike Chen', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=600&q=80', 67, 0, '健康', null],
      [6, '学吉他比看起来难，但也很有成就感！', null, 'Alex Turner', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=600&q=80', 103, 0, '音乐', null],
      [7, '在我的小公寓里进行城市园艺 \ud83c\udf31', null, 'Green Thumb', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', 156, 0, '园艺', null],
      [8, '深夜写作 \u270d\ufe0f #小说创作中', null, 'Writer Dan', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80', 92, 0, '写作', null],
      [9, '探索京都的隐秘瑰宝 \ud83c\uddef\ud83c\uddf5', null, 'Travel Bug', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80', 340, 0, '旅行', null],
      [10, 'DIY 架子项目终于完成了！ \ud83d\udd28', null, 'Maker Joe', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&w=600&q=80', 210, 0, 'DIY', null],
      [11, '拉花练习。越来越好了！ \u2615\ufe0f', null, 'Barista Bob', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80', 180, 0, '咖啡', null],
      [12, '周日抽象画创作 \ud83c\udfa8', null, 'Art Vibe', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80', 115, 0, '艺术', null],
      [13, '落基山徒步。这景色！ \ud83c\udfd4\ufe0f', null, 'Hiker Gal', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', 290, 0, '徒步', null],
      [14, '国际象棋策略研究。白方先行。', null, 'Grandmaster', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80', 75, 0, '象棋', null],
      [15, '本周素食备餐 \ud83e\udd57', null, 'Veggie Life', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', 195, 0, '美食', null],
    ];
    for (const p of posts) {
      insertPost.run(...p);
    }

    // --- Community Updates ---
    const communityUpdates = [
      [1, 'Sophie 刚跟 Mark 学会了 Python！', '2分钟前', '\ud83d\ude80', 'bg-blue-100 text-blue-600'],
      [2, "市中心新建了 '水彩' 小组。", '15分钟前', '\ud83c\udfa8', 'bg-purple-100 text-purple-600'],
      [3, "Liam 获得了 '超级教师' 徽章。", '1小时前', '\ud83c\udfc6', 'bg-yellow-100 text-yellow-600'],
      [4, "Sarah 加入了 '城市摄影' 挑战。", '2小时前', '\ud83d\udcf8', 'bg-pink-100 text-pink-600'],
      [5, "David 更新了他的 'React 精通' 课程。", '3小时前', '\ud83d\udcbb', 'bg-indigo-100 text-indigo-600'],
      [6, "Emma 评论了 '酸种面包烘焙'。", '4小时前', '\ud83d\udcac', 'bg-green-100 text-green-600'],
      [7, 'Tom 正在寻找吉他老师。', '5小时前', '\ud83c\udfb8', 'bg-orange-100 text-orange-600'],
      [8, 'Anna 和 Robert 交换了技能。', '6小时前', 'qh', 'bg-teal-100 text-teal-600'],
      [9, "James 发布了新资源: 'SEO 指南'。", '8小时前', 'aaa', 'bg-cyan-100 text-cyan-600'],
      [10, "Linda 赞了你的 '素食烹饪' 技能。", '12小时前', '\u2764\ufe0f', 'bg-red-100 text-red-600'],
      [11, 'Alex 关注了你。', '1天前', '\ud83d\udc64', 'bg-slate-100 text-slate-600'],
      [12, "Barista Bob 正在直播: '拉花 101'", '1天前', '\u2615\ufe0f', 'bg-amber-100 text-amber-600'],
    ];
    for (const cu of communityUpdates) {
      insertCommunityUpdate.run(...cu);
    }

    // --- Similar Experts ---
    const similarExperts = [
      ['Brent', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', 6099, 5.0, '15.00'],
      ['Michael R', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', 10857, 5.0, '10.00'],
      ['John K.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80', 16043, 5.0, '17.00'],
      ['Sarah L.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80', 420, 4.9, '12.00'],
    ];
    for (const se of similarExperts) {
      insertSimilarExpert.run(...se);
    }

    // --- User Posts (Jessica's profile posts) ---
    const userPosts = [
      [1, 'u_jessica', "刚结束了和 @Sarah 的愉快陶艺课！ \ud83c\udff0 迫不及待想下周给你们看最后的上釉成果。", 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=80', 124, 18, '2小时前'],
      [2, 'u_jessica', "分享我 2026 年最喜欢的 5 个 Figma 插件。看这里！ \ud83d\udc47 #设计技巧", null, 89, 42, '1天前'],
    ];
    for (const up of userPosts) {
      insertUserPost.run(...up);
    }

    // --- Reviews ---
    const reviews = [
      ['Sarah Jenks', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', 5, '2天前', 'Jessica 是一位很棒的老师！她把 Figma 的自动布局解释得非常清楚。我终于明白它是怎么工作的了。强烈推荐！', 'Figma 精通'],
      ['Mike Chen', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 5, '1周前', "很棒的陶艺课。她对我笨拙的手非常有耐心哈哈。期待下一节课。", '陶艺基础'],
      ['Elena Rodriguez', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 5, '2周前', '非常专业且友好。我们用西班牙语交换 Figma 技巧，这是一次完美的交换。', '技能交换'],
      ['David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 4, '1个月前', '很好的课程，学到了很多关于组件属性的知识。', '设计系统'],
    ];
    for (const r of reviews) {
      insertReview.run(...r);
    }
  });

  seed();
  console.log('Database seeded successfully!');
}