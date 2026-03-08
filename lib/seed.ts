import { getDb } from './db';

export function seedDatabase() {
  const db = getDb();

  // Migration: ensure messages for David (2) and Sarah (3) exist (runs even for already-seeded DBs)
  const msgCount2 = db.prepare('SELECT COUNT(*) as count FROM messages WHERE contact_id = 2').get() as any;
  const msgCount3 = db.prepare('SELECT COUNT(*) as count FROM messages WHERE contact_id = 3').get() as any;
  if (msgCount2.count === 0 || msgCount3.count === 0) {
    const insertMessage = db.prepare(`
      INSERT INTO messages (contact_id, sender, text, time, type, status, skill_me, skill_them, time_slot, icon)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const messages2 = [
      [2, 'them', 'Hey Jessica! Saw your Figma work on the community. Really clean component structure.', '9:15 AM', 'text', null, null, null, null, null],
      [2, 'me', 'Thanks David! I\'d love to level up my React skills. Your Tailwind setup looks amazing.', '9:18 AM', 'text', null, null, null, null, null],
      [2, 'them', 'Happy to help! I need someone to review my design system in Figma before I hand off to dev.', '9:20 AM', 'text', null, null, null, null, null],
      [2, 'me', 'Perfect trade. I can do a design review and you teach me React + Tailwind patterns?', '9:22 AM', 'text', null, null, null, null, null],
      [2, 'them', 'Deal! I sent you the project files. Check the components folder when you have time.', '9:25 AM', 'text', null, null, null, null, null],
      [2, 'system', 'Translation: Deal! I sent you the project files. Check the components folder when you have time.', null, 'ai_trans', null, null, null, null, 'Globe'],
      [2, 'me', 'Got them, thanks! How about Thursday 4pm for our first session?', '9:30 AM', 'text', null, null, null, null, null],
      [2, 'me', null, null, 'proposal', 'pending', 'Figma Design Review', 'React & Tailwind', 'Thursday, 4:00 PM', null],
    ];
    const messages3 = [
      [3, 'them', 'Jessica! Your pottery post was so inspiring. I\'ve been wanting to try hand-building.', 'Yesterday 3:45 PM', 'text', null, null, null, null, null],
      [3, 'me', 'Sarah! I\'d love to teach you. And I\'ve been dying to learn urban photography from you.', 'Yesterday 3:50 PM', 'text', null, null, null, null, null],
      [3, 'them', 'That\'s a great swap! I can show you composition and lighting downtown. Very photogenic spots.', 'Yesterday 3:52 PM', 'text', null, null, null, null, null],
      [3, 'me', 'Amazing. Should we do pottery first at my studio, then a photo walk?', 'Yesterday 3:55 PM', 'text', null, null, null, null, null],
      [3, 'them', 'Yes! I\'ll bring my camera. Thanks for the pottery tips you shared in the group!', 'Yesterday 4:00 PM', 'text', null, null, null, null, null],
      [3, 'me', null, null, 'proposal', 'pending', 'Pottery Basics', 'Urban Photography', 'Saturday, 10:00 AM', null],
    ];
    const migrate = db.transaction(() => {
      if (msgCount2.count === 0) {
        for (const m of messages2) insertMessage.run(...m);
        db.prepare('UPDATE contacts SET last_msg = ?, time = ?, skill = ? WHERE id = 2').run('Got them, thanks! How about Thursday 4pm for our first session?', '9:30 AM', 'React & Tailwind');
      }
      if (msgCount3.count === 0) {
        for (const m of messages3) insertMessage.run(...m);
        db.prepare('UPDATE contacts SET last_msg = ?, time = ?, skill = ? WHERE id = 3').run('Yes! I\'ll bring my camera. Thanks for the pottery tips you shared in the group!', 'Yesterday 4:00 PM', 'Urban Photography');
      }
    });
    migrate();
    console.log('Messages migration: David & Sarah conversations added.');
  }

  // Migration: similar_experts price 从美元改为积分 (15.00 -> 2, 10.00 -> 1, 17.00 -> 3, 12.00 -> 2)
  try {
    const seExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='similar_experts'").get();
    if (seExists) {
      db.prepare("UPDATE similar_experts SET price = '2' WHERE price = '15.00' OR price = '15'").run();
      db.prepare("UPDATE similar_experts SET price = '1' WHERE price = '10.00' OR price = '10'").run();
      db.prepare("UPDATE similar_experts SET price = '3' WHERE price = '17.00' OR price = '17'").run();
      db.prepare("UPDATE similar_experts SET price = '2' WHERE price = '12.00' OR price = '12'").run();
    }
  } catch (_) {}

  // Migration: exchange_feedback (runs when table exists but empty)
  try {
    const efExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='exchange_feedback'").get();
    if (efExists) {
    const efCount = db.prepare('SELECT COUNT(*) as count FROM exchange_feedback').get() as any;
    if (efCount.count === 0) {
      const insertEF = db.prepare(`
        INSERT INTO exchange_feedback (user_name, avatar, title, content, image, likes, comments, tag, time, skill_me, skill_them, partner, partner_avatar, progress_updates)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const efs = [
        ['Jessica Parker', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Jessica ⇄ Elena 西班牙语 × Figma 交换反馈', '第一周：Elena 教了我很多地道表达，我也帮她梳理了 Figma 自动布局的逻辑。期待下周的会话！', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 24, 8, '交换反馈', '2d ago', 'Figma', 'Spanish', 'Elena Rodriguez', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', JSON.stringify([{ user: 'Jessica', text: '完成了第一课，学会了基本问候语！', time: '1d ago' }, { user: 'Elena', text: 'Figma 组件结构清晰多了，感谢！', time: '1d ago' }])],
        ['Jessica Parker', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Jessica ⇄ David React × Figma 设计评审', '和 David 的交换进行得很顺利，他讲 React Hooks 讲得很清楚，我也帮他做了设计系统的评审。', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80', 18, 5, '交换反馈', '5d ago', 'Figma Design Review', 'React & Tailwind', 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', JSON.stringify([{ user: 'David', text: '设计评审很有帮助，已按建议调整。', time: '4d ago' }])],
        ['Jessica Parker', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Jessica ⇄ Sarah 陶艺 × 城市摄影', '和 Sarah 约好了周六陶艺+摄影 walk！平台已自动为我们创建了交换反馈区，可以持续记录学习进度。', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', 12, 3, '交换反馈', '1w ago', 'Pottery Basics', 'Urban Photography', 'Sarah Jenks', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', '[]'],
      ];
      for (const ef of efs) insertEF.run(...ef);
      console.log('Exchange feedback migration: 3 posts added.');
    }
    }
  } catch (_) { /* table may not exist yet */ }

  // Migration: nfts (runs when table exists but empty)
  try {
    const nftExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='nfts'").get();
    if (nftExists) {
    const nftCount = db.prepare('SELECT COUNT(*) as count FROM nfts').get() as any;
    if (nftCount.count === 0) {
      const insertNft = db.prepare(`
        INSERT INTO nfts (user_id, title, skill_me, skill_them, partner_name, partner_avatar, contribution_me, contribution_them, story, created_at, timeline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const nfts = [
        ['u_jessica', 'Figma × Pottery', 'Figma', 'Pottery', 'Alex Chen', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', 55, 45, '与 Alex 的 Figma 与陶艺交换圆满完成。双方在设计和手工艺领域互相学习，收获满满。', '2024-01-15', JSON.stringify([{ label: '首次交换', date: '2024-01-10' }, { label: '完成 3 次会话', date: '2024-01-15' }])],
        ['u_jessica', 'Design × Baking', 'Design', 'Baking', 'Sam Lee', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 60, 40, '与 Sam 的设计与烘焙技能交换，从 UI 到烤箱，跨界学习乐趣无穷。', '2024-02-20', JSON.stringify([{ label: '首次交换', date: '2024-02-15' }, { label: '完成 5 次会话', date: '2024-02-20' }])],
        ['u_jessica', 'UX × Sourdough', 'UX', 'Sourdough', 'Jordan', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 50, 50, '与 Jordan 的 UX 与酸面团交换，产品思维与发酵艺术完美融合。', '2024-03-10', JSON.stringify([{ label: '首次交换', date: '2024-03-05' }])],
        ['u_elena', 'Spanish × Figma', 'Spanish', 'Figma', 'Jessica Parker', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 45, 55, '与 Jessica 的西班牙语与 Figma 交换，互相学习语言与设计工具。', '2024-01-20', JSON.stringify([{ label: '首次交换', date: '2024-01-15' }])],
        ['u_david', 'React × Design Review', 'React & Tailwind', 'Figma Design', 'Jessica Parker', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 50, 50, '与 Jessica 的 React 与设计评审交换，技术与设计完美结合。', '2024-02-10', JSON.stringify([{ label: '首次交换', date: '2024-02-05' }])],
        ['u_sarah', 'Photography × Pottery', 'Urban Photography', 'Pottery', 'Jessica Parker', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 48, 52, '与 Jessica 的城市摄影与陶艺交换，镜头与陶土的艺术碰撞。', '2024-03-01', JSON.stringify([{ label: '首次交换', date: '2024-02-28' }])],
      ];
      for (const n of nfts) insertNft.run(...n);
      console.log('NFTs migration: 6 NFTs added.');
    }
    }
  } catch (_) { /* table may not exist yet */ }

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
      'Product Designer', 'San Francisco, CA', 3, 98, 24,
      'Digital product designer by day, pottery enthusiast by night. I love sharing Figma tips and looking to learn how to bake the perfect sourdough!',
      1, JSON.stringify(['Travel', 'Coding', 'Design', 'Pottery']));

    // --- Skills ---
    const skills = [
      [1, 'Conversational Spanish', 'Elena Rodriguez', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 'Language', '0.5km', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 4.9, 342, 'Spanish', 2, 'Native Spanish speaker from Madrid. I focus on conversational fluency and idioms.'],
      [2, 'React & Tailwind Mastery', 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'Tech', 'Online', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80', 5.0, 120, 'English', 3, 'Senior Frontend Engineer. Learn how to build modern, responsive UIs with the latest React patterns.'],
      [3, 'Urban Photography', 'Sarah Jenks', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', 'Art', '2.1km', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', 4.8, 85, 'English', 2, 'Capture the soul of the city. We will walk through downtown and practice composition and lighting.'],
      [4, 'Intro to Yoga', 'Mike Chen', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 'Fitness', '1.2km', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80', 4.9, 560, 'Chinese', 1, 'Hatha Yoga certified. Gentle introduction to basic asanas, breathing techniques, and mindfulness.'],
      [5, 'Sourdough Baking', 'Emma Wilson', 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&w=150&q=80', 'Cooking', '3.0km', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', 4.7, 45, 'English', 1, 'From starter to loaf. Learn the art of fermentation and bake the perfect sourdough at home.'],
      [6, 'Guitar Basics', 'Alex Turner', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'Music', '4.5km', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80', 4.8, 210, 'English', 2, 'Acoustic guitar fundamentals. Chords, strumming patterns, and reading tabs. Fun and chill vibes.'],
      [7, 'Watercolor Painting', 'Anna Li', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', 'Art', '1.5km', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80', 4.9, 150, 'Chinese', 2, 'Express yourself with watercolors. Techniques for landscapes, florals, and abstract art.'],
      [8, 'Python for Data Science', 'James O.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', 'Tech', 'Online', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', 5.0, 800, 'English', 4, 'Data analysis with Pandas, visualization with Matplotlib, and intro to Machine Learning.'],
      [9, 'Vegan Cooking', 'Linda Green', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', 'Cooking', '2.0km', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', 4.6, 90, 'English', 1, 'Delicious plant-based recipes that are easy to make and nutritious.'],
      [10, 'Piano Masterclass', 'Robert Fox', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'Music', '5.0km', 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=600&q=80', 4.9, 400, 'German', 3, 'Advanced technique and interpretation for classical piano repertoire. Audition prep.'],
      [11, 'Crossfit Training', 'Tom Hardy', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', 'Fitness', '0.8km', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80', 4.8, 300, 'English', 2, 'High-intensity functional training. Build strength, endurance, and agility.'],
      [12, 'French for Travel', 'Sophie Marceau', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Language', 'Online', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', 4.7, 180, 'French', 2, 'Essential phrases and cultural tips for your trip to France. Ordering food, asking directions, etc.'],
      [13, 'Pottery Workshop', 'Pat M.', 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=150&q=80', 'Art', '3.5km', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80', 4.9, 220, 'English', 2, 'Hand-building and wheel throwing techniques. Glazing and firing. All levels welcome.'],
      [14, 'SEO Basics', 'Gary V.', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80', 'Business', 'Online', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=600&q=80', 4.5, 1000, 'English', 5, 'Rank higher on Google. Keyword research, on-page optimization, and backlink strategies.'],
      [15, 'Mixology 101', 'Barney S.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', 'Cooking', '1.0km', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', 4.8, 150, 'English', 2, 'Craft classic cocktails like a pro. Understanding spirits, mixers, and garnishes.'],
    ];
    for (const s of skills) {
      insertSkill.run(...s);
    }

    // --- Sessions (Exchange view + Dashboard upcoming) ---
    // Exchange view sessions
    const sessions = [
      [1, 'upcoming', 'Conversational Spanish', null, 'Elena Rodriguez', null, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 'Today', '14:00 - 15:00', 'Confirmed', '#', null, 0, null],
      [2, 'upcoming', 'React & Tailwind', null, 'David Kim', null, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'Tomorrow', '10:00 - 11:00', 'Confirmed', '#', null, 0, null],
      [6, 'upcoming', 'Piano Basics', null, 'Marcus Chen', null, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', 'Feb 15, 2026', '19:00 - 20:00', 'Confirmed', '#', null, 0, null],
      [7, 'upcoming', 'Digital Marketing 101', null, 'Sophie Anderson', null, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Feb 18, 2026', '09:00 - 10:30', 'Confirmed', '#', null, 0, null],
      [8, 'upcoming', 'French Cooking', null, 'Jean-Pierre', null, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'Feb 20, 2026', '18:00 - 19:30', 'Confirmed', '#', null, 0, null],
      [3, 'pending', 'Photography Basics', null, 'Sarah Jenks', null, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', 'Feb 12, 2026', '16:30 - 17:30', 'Pending Acceptance', null, null, 0, null],
      [4, 'past', 'Sourdough Baking', null, 'Emma Wilson', null, 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&w=150&q=80', 'Feb 01, 2026', '09:00 - 10:00', 'Completed', null, null, 1, 5],
      [5, 'past', 'Guitar Fundamentals', null, 'Alex Turner', null, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'Jan 28, 2026', '18:00 - 19:00', 'Completed', null, null, 0, null],
      // Dashboard upcoming sessions (different type format)
      [101, 'Learning', null, 'Advanced CSS Layouts', null, 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', null, 'Today, 4:00 PM', null, null, '#', 0, null],
      [102, 'Teaching', null, 'Piano 101', null, 'Alice Mu', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', null, 'Tomorrow, 10:00 AM', null, null, '#', 0, null],
    ];
    for (const s of sessions) {
      insertSession.run(...s);
    }

    // --- Contacts ---
    const contacts = [
      [1, 'Elena Rodriguez', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 'Hola! Are we still on for tomorrow?', '2m ago', 2, 'online', 'Conversational Spanish'],
      [2, 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'Got them, thanks! How about Thursday 4pm for our first session?', '9:30 AM', 0, 'online', 'React & Tailwind'],
      [3, 'Sarah Jenks', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', 'Yes! I\'ll bring my camera. Thanks for the pottery tips you shared in the group!', 'Yesterday 4:00 PM', 0, 'online', 'Urban Photography'],
    ];
    for (const c of contacts) {
      insertContact.run(...c);
    }

    // --- Messages (contact 1: Elena - Spanish ⇄ Figma) ---
    const messages1 = [
      [1, 1, 'them', 'Hola Jessica! I noticed you were interested in improving your Spanish conversation skills.', '10:30 AM', 'text', null, null, null, null, null],
      [2, 1, 'me', 'Hi Elena! Yes, I took some classes in college but I really need practice speaking.', '10:32 AM', 'text', null, null, null, null, null],
      [3, 1, 'them', 'Perfect! I would love to help you. I am looking for someone to help me with Figma auto-layout.', '10:33 AM', 'text', null, null, null, null, null],
      [4, 1, 'system', 'Translation: Perfect! I would love to help you. I am looking for someone to help me with Figma auto-layout.', null, 'ai_trans', null, null, null, null, 'Globe'],
      [5, 1, 'me', 'That sounds like a perfect match! I use Figma every day.', '10:34 AM', 'text', null, null, null, null, null],
      [6, 1, 'me', 'How about we do a 1 hour exchange? 30 mins Spanish, 30 mins Figma.', '10:35 AM', 'text', null, null, null, null, null],
      [7, 1, 'them', 'Sounds fair. When are you free?', '10:36 AM', 'text', null, null, null, null, null],
      [8, 1, 'me', null, null, 'proposal', 'pending', 'Figma Skills', 'Spanish Practice', 'Tomorrow, 2:00 PM', null],
    ];
    // --- Messages (contact 2: David Kim - Figma ⇄ React) ---
    const messages2 = [
      [9, 2, 'them', 'Hey Jessica! Saw your Figma work on the community. Really clean component structure.', '9:15 AM', 'text', null, null, null, null, null],
      [10, 2, 'me', 'Thanks David! I’d love to level up my React skills. Your Tailwind setup looks amazing.', '9:18 AM', 'text', null, null, null, null, null],
      [11, 2, 'them', 'Happy to help! I need someone to review my design system in Figma before I hand off to dev.', '9:20 AM', 'text', null, null, null, null, null],
      [12, 2, 'me', 'Perfect trade. I can do a design review and you teach me React + Tailwind patterns?', '9:22 AM', 'text', null, null, null, null, null],
      [13, 2, 'them', 'Deal! I sent you the project files. Check the components folder when you have time.', '9:25 AM', 'text', null, null, null, null, null],
      [14, 2, 'system', 'Translation: Deal! I sent you the project files. Check the components folder when you have time.', null, 'ai_trans', null, null, null, null, 'Globe'],
      [15, 2, 'me', 'Got them, thanks! How about Thursday 4pm for our first session?', '9:30 AM', 'text', null, null, null, null, null],
      [16, 2, 'me', null, null, 'proposal', 'pending', 'Figma Design Review', 'React & Tailwind', 'Thursday, 4:00 PM', null],
    ];
    // --- Messages (contact 3: Sarah Jenks - Pottery ⇄ Photography) ---
    const messages3 = [
      [17, 3, 'them', 'Jessica! Your pottery post was so inspiring. I’ve been wanting to try hand-building.', 'Yesterday 3:45 PM', 'text', null, null, null, null, null],
      [18, 3, 'me', 'Sarah! I’d love to teach you. And I’ve been dying to learn urban photography from you.', 'Yesterday 3:50 PM', 'text', null, null, null, null, null],
      [19, 3, 'them', 'That’s a great swap! I can show you composition and lighting downtown. Very photogenic spots.', 'Yesterday 3:52 PM', 'text', null, null, null, null, null],
      [20, 3, 'me', 'Amazing. Should we do pottery first at my studio, then a photo walk?', 'Yesterday 3:55 PM', 'text', null, null, null, null, null],
      [21, 3, 'them', 'Yes! I’ll bring my camera. Thanks for the pottery tips you shared in the group!', 'Yesterday 4:00 PM', 'text', null, null, null, null, null],
      [22, 3, 'me', null, null, 'proposal', 'pending', 'Pottery Basics', 'Urban Photography', 'Saturday, 10:00 AM', null],
    ];
    for (const m of [...messages1, ...messages2, ...messages3]) {
      insertMessage.run(...m);
    }

    // --- Posts ---
    const posts = [
      [1, 'Finally baked my first perfect sourdough loaf! \ud83c\udf5e\u2728', null, 'Emma Wilson', 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80', 124, 0, 'Baking', null],
      [2, 'Sketching in the park today. Anyone want to join next time?', null, 'Sarah Jenks', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80', 89, 0, 'Art', null],
      [3, 'Pottery progress after 3 weeks with @MikeChen. \ud83c\udff0', null, 'Jessica L.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=80', 256, 0, 'Pottery', null],
      [4, 'Coding setup upgrade! Ready to teach some React.', null, 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=600&q=80', 412, 0, 'Tech', null],
      [5, 'Morning yoga flow \ud83e\uddd8\u200d\u2640\ufe0f Best way to start the day.', null, 'Mike Chen', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=600&q=80', 67, 0, 'Wellness', null],
      [6, 'Learning guitar is harder than it looks, but so rewarding!', null, 'Alex Turner', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=600&q=80', 103, 0, 'Music', null],
      [7, 'Urban gardening in my small apartment \ud83c\udf31', null, 'Green Thumb', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', 156, 0, 'Gardening', null],
      [8, 'Late night writing session \u270d\ufe0f #novelinprogress', null, 'Writer Dan', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80', 92, 0, 'Writing', null],
      [9, 'Exploring hidden gems in Kyoto \ud83c\uddef\ud83c\uddf5', null, 'Travel Bug', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80', 340, 0, 'Travel', null],
      [10, 'DIY shelf project finally done! \ud83d\udd28', null, 'Maker Joe', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&w=600&q=80', 210, 0, 'DIY', null],
      [11, 'Latte art practice. Getting better! \u2615\ufe0f', null, 'Barista Bob', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80', 180, 0, 'Coffee', null],
      [12, 'Sunday abstract painting vibes \ud83c\udfa8', null, 'Art Vibe', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80', 115, 0, 'Art', null],
      [13, 'Hiking the Rockies. The view! \ud83c\udfd4\ufe0f', null, 'Hiker Gal', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', 290, 0, 'Hiking', null],
      [14, 'Chess strategy study. White to move.', null, 'Grandmaster', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80', 75, 0, 'Chess', null],
      [15, 'Vegan meal prep for the week \ud83e\udd57', null, 'Veggie Life', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', 195, 0, 'Food', null],
    ];
    for (const p of posts) {
      insertPost.run(...p);
    }

    // --- Community Updates ---
    const communityUpdates = [
      [1, 'Sophie just learned Python with Mark!', '2m ago', '\ud83d\ude80', 'bg-blue-100 text-blue-600'],
      [2, "New 'Watercolor' group started downtown.", '15m ago', '\ud83c\udfa8', 'bg-purple-100 text-purple-600'],
      [3, "Liam earned the 'Super Swapper' badge.", '1h ago', '\ud83c\udfc6', 'bg-yellow-100 text-yellow-600'],
      [4, "Sarah joined the 'Urban Photography' challenge.", '2h ago', '\ud83d\udcf8', 'bg-pink-100 text-pink-600'],
      [5, "David updated his 'React Mastery' course.", '3h ago', '\ud83d\udcbb', 'bg-indigo-100 text-indigo-600'],
      [6, "Emma commented on 'Sourdough Baking'.", '4h ago', '\ud83d\udcac', 'bg-green-100 text-green-600'],
      [7, 'Tom is looking for a guitar swap partner.', '5h ago', '\ud83c\udfb8', 'bg-orange-100 text-orange-600'],
      [8, 'Anna and Robert swapped skills.', '6h ago', 'qh', 'bg-teal-100 text-teal-600'],
      [9, "James posted a new resource: 'SEO Guide'.", '8h ago', 'aaa', 'bg-cyan-100 text-cyan-600'],
      [10, "Linda liked your 'Vegan Cooking' skill.", '12h ago', '\u2764\ufe0f', 'bg-red-100 text-red-600'],
      [11, 'Alex followed you.', '1d ago', '\ud83d\udc64', 'bg-slate-100 text-slate-600'],
      [12, "Barista Bob is live: 'Latte Art 101'", '1d ago', '\u2615\ufe0f', 'bg-amber-100 text-amber-600'],
    ];
    for (const cu of communityUpdates) {
      insertCommunityUpdate.run(...cu);
    }

    // --- Similar Experts (price = 积分 credits, 与找技能卡片一致) ---
    const similarExperts = [
      ['Brent', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', 6099, 5.0, '2'],
      ['Michael R', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', 10857, 5.0, '1'],
      ['John K.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80', 16043, 5.0, '3'],
      ['Sarah L.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80', 420, 4.9, '2'],
    ];
    for (const se of similarExperts) {
      insertSimilarExpert.run(...se);
    }

    // --- User Posts (Jessica's profile posts) ---
    const userPosts = [
      [1, 'u_jessica', "Just finished a lovely pottery session with @Sarah! \ud83c\udff0 Can't wait to show you the final glazed results next week.", 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=80', 124, 18, '2h ago'],
      [2, 'u_jessica', "Sharing my top 5 Figma plugins for 2026. Check them out! \ud83d\udc47 #designtips", null, 89, 42, '1d ago'],
    ];
    for (const up of userPosts) {
      insertUserPost.run(...up);
    }

    // --- Reviews ---
    const reviews = [
      ['Sarah Jenks', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', 5, '2 days ago', 'Jessica is an amazing swap partner! She explains Figma auto-layout so clearly. I finally get how it works. Highly recommended!', 'Figma Mastery'],
      ['Mike Chen', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 5, '1 week ago', "Great pottery session. She was very patient with my clumsy hands haha. Can't wait for the next one.", 'Pottery Basics'],
      ['Elena Rodriguez', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 5, '2 weeks ago', 'Very professional and friendly. We swapped Spanish for Figma skills and it was a perfect exchange.', 'Skill Swap'],
      ['David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 4, '1 month ago', 'Good session, learned a lot about component properties.', 'Design Systems'],
    ];
    for (const r of reviews) {
      insertReview.run(...r);
    }
  });

  seed();
  console.log('Database seeded successfully!');
}