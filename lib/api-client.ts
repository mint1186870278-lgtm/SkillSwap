// Replaced real API calls with static mock data to ensure deployment stability on ModelScope
// This bypasses any backend/database requirements for the demo.

// --- API Client Infrastructure (Ready for Real Backend) ---
const API_BASE = '/api';

/**
 * Standard fetch wrapper with Auth & Error handling.
 * Switch to using this function when backend is ready.
 */
async function _realFetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const headers: any = { 'Content-Type': 'application/json', ...options?.headers };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  
  if (res.status === 401) {
    // Handle unauthorized (e.g., redirect to login)
    localStorage.removeItem('auth_token');
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || 'API request failed');
  }
  
  return res.json();
}

// --- Auth Helpers ---
export const auth = {
  getToken: () => localStorage.getItem('auth_token'),
  setToken: (token: string) => localStorage.setItem('auth_token', token),
  logout: () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  }
};

// --- Mock Data Definitions ---

const CURRENT_USER = {
  id: 'u_jessica',
  name: 'Jessica Parker',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  title: 'Product Designer',
  location: 'San Francisco, CA',
  level: 3,
  trustScore: 98,
  credits: 24,
  bio: 'Digital product designer by day, pottery enthusiast by night. I love sharing Figma tips and looking to learn how to bake the perfect sourdough!',
  isPro: true,
  tags: ['Travel', 'Coding', 'Design', 'Pottery']
};

const SKILLS = [
  { id: 1, title: 'Conversational Spanish', user: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', type: 'Language', distance: '0.5km', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', rating: 4.9, lessons: 342, speaks: 'Spanish', price: 2, description: 'Native Spanish speaker from Madrid. I focus on conversational fluency and idioms.' },
  { id: 2, title: 'React & Tailwind Mastery', user: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', type: 'Tech', distance: 'Online', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80', rating: 5.0, lessons: 120, speaks: 'English', price: 3, description: 'Senior Frontend Engineer. Learn how to build modern, responsive UIs with the latest React patterns.' },
  { id: 3, title: 'Urban Photography', user: 'Sarah Jenks', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', type: 'Art', distance: '2.1km', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', rating: 4.8, lessons: 85, speaks: 'English', price: 2, description: 'Capture the soul of the city. We will walk through downtown and practice composition and lighting.' },
  { id: 4, title: 'Intro to Yoga', user: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', type: 'Fitness', distance: '1.2km', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80', rating: 4.9, lessons: 560, speaks: 'Chinese', price: 1, description: 'Hatha Yoga certified. Gentle introduction to basic asanas, breathing techniques, and mindfulness.' },
  { id: 5, title: 'Sourdough Baking', user: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&w=150&q=80', type: 'Cooking', distance: '3.0km', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', rating: 4.7, lessons: 45, speaks: 'English', price: 1, description: 'From starter to loaf. Learn the art of fermentation and bake the perfect sourdough at home.' },
  { id: 6, title: 'Guitar Basics', user: 'Alex Turner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', type: 'Music', distance: '4.5km', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80', rating: 4.8, lessons: 210, speaks: 'English', price: 2, description: 'Acoustic guitar fundamentals. Chords, strumming patterns, and reading tabs. Fun and chill vibes.' },
  { id: 7, title: 'Watercolor Painting', user: 'Anna Li', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', type: 'Art', distance: '1.5km', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80', rating: 4.9, lessons: 150, speaks: 'Chinese', price: 2, description: 'Express yourself with watercolors. Techniques for landscapes, florals, and abstract art.' },
  { id: 8, title: 'Python for Data Science', user: 'James O.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', type: 'Tech', distance: 'Online', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', rating: 5.0, lessons: 800, speaks: 'English', price: 4, description: 'Data analysis with Pandas, visualization with Matplotlib, and intro to Machine Learning.' },
  { id: 9, title: 'Vegan Cooking', user: 'Linda Green', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', type: 'Cooking', distance: '2.0km', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', rating: 4.6, lessons: 90, speaks: 'English', price: 1, description: 'Delicious plant-based recipes that are easy to make and nutritious.' },
  { id: 10, title: 'Piano Masterclass', user: 'Robert Fox', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', type: 'Music', distance: '5.0km', image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=600&q=80', rating: 4.9, lessons: 400, speaks: 'German', price: 3, description: 'Advanced technique and interpretation for classical piano repertoire. Audition prep.' },
  { id: 11, title: 'Crossfit Training', user: 'Tom Hardy', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', type: 'Fitness', distance: '0.8km', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80', rating: 4.8, lessons: 300, speaks: 'English', price: 2, description: 'High-intensity functional training. Build strength, endurance, and agility.' },
  { id: 12, title: 'French for Travel', user: 'Sophie Marceau', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', type: 'Language', distance: 'Online', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', rating: 4.7, lessons: 180, speaks: 'French', price: 2, description: 'Essential phrases and cultural tips for your trip to France. Ordering food, asking directions, etc.' },
  { id: 13, title: 'Pottery Workshop', user: 'Pat M.', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=150&q=80', type: 'Art', distance: '3.5km', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80', rating: 4.9, lessons: 220, speaks: 'English', price: 2, description: 'Hand-building and wheel throwing techniques. Glazing and firing. All levels welcome.' },
  { id: 14, title: 'SEO Basics', user: 'Gary V.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80', type: 'Business', distance: 'Online', image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=600&q=80', rating: 4.5, lessons: 1000, speaks: 'English', price: 5, description: 'Rank higher on Google. Keyword research, on-page optimization, and backlink strategies.' },
  { id: 15, title: 'Mixology 101', user: 'Barney S.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', type: 'Cooking', distance: '1.0km', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', rating: 4.8, lessons: 150, speaks: 'English', price: 2, description: 'Craft classic cocktails like a pro. Understanding spirits, mixers, and garnishes.' },
];

const SESSIONS = [
  { id: 1, type: 'upcoming', skill: 'Conversational Spanish', partner: 'Elena Rodriguez', with: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', date: 'Today', time: '14:00 - 15:00', status: 'Confirmed' },
  { id: 2, type: 'upcoming', skill: 'React & Tailwind', partner: 'David Kim', with: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', date: 'Tomorrow', time: '10:00 - 11:00', status: 'Confirmed' },
  { id: 6, type: 'upcoming', skill: 'Piano Basics', partner: 'Marcus Chen', with: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', date: 'Feb 15, 2026', time: '19:00 - 20:00', status: 'Confirmed' },
  { id: 7, type: 'upcoming', skill: 'Digital Marketing 101', partner: 'Sophie Anderson', with: 'Sophie Anderson', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', date: 'Feb 18, 2026', time: '09:00 - 10:30', status: 'Confirmed' },
  { id: 8, type: 'upcoming', skill: 'French Cooking', partner: 'Jean-Pierre', with: 'Jean-Pierre', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', date: 'Feb 20, 2026', time: '18:00 - 19:30', status: 'Confirmed' },
  { id: 3, type: 'pending', skill: 'Photography Basics', partner: 'Sarah Jenks', with: 'Sarah Jenks', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', date: 'Feb 12, 2026', time: '16:30 - 17:30', status: 'Pending Acceptance' },
  { id: 4, type: 'past', skill: 'Sourdough Baking', partner: 'Emma Wilson', with: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&w=150&q=80', date: 'Feb 01, 2026', time: '09:00 - 10:00', status: 'Completed', rated: true, rating: 5 },
  { id: 5, type: 'past', skill: 'Guitar Fundamentals', partner: 'Alex Turner', with: 'Alex Turner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', date: 'Jan 28, 2026', time: '18:00 - 19:00', status: 'Completed', rated: false },
  // Dashboard upcoming
  { id: 101, type: 'Learning', title: 'Advanced CSS Layouts', with: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', time: 'Today, 4:00 PM' },
  { id: 102, type: 'Teaching', title: 'Piano 101', with: 'Alice Mu', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', time: 'Tomorrow, 10:00 AM' },
];

const CONTACTS = [
  { id: 1, name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', lastMsg: 'Hola! Are we still on for tomorrow?', time: '2m ago', unread: 2, status: 'online', skill: 'Conversational Spanish' },
  { id: 2, name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', lastMsg: 'I sent you the project files.', time: '1h ago', unread: 0, status: 'offline', skill: 'React Mentorship' },
  { id: 3, name: 'Sarah Jenks', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', lastMsg: 'Thanks for the pottery tips!', time: '1d ago', unread: 0, status: 'online', skill: 'Pottery Basics' },
];

const MESSAGES = [
  { id: 1, contact_id: 1, sender: 'them', text: 'Hola Jessica! I noticed you were interested in improving your Spanish conversation skills.', time: '10:30 AM', type: 'text' },
  { id: 2, contact_id: 1, sender: 'me', text: 'Hi Elena! Yes, I took some classes in college but I really need practice speaking.', time: '10:32 AM', type: 'text' },
  { id: 3, contact_id: 1, sender: 'them', text: 'Perfect! I would love to help you. I am looking for someone to help me with Figma auto-layout.', time: '10:33 AM', type: 'text' },
  { id: 4, contact_id: 1, sender: 'system', text: 'Translation: Perfect! I would love to help you. I am looking for someone to help me with Figma auto-layout.', type: 'ai_trans', icon: 'Globe' },
  { id: 5, contact_id: 1, sender: 'me', text: 'That sounds like a perfect match! I use Figma every day.', time: '10:34 AM', type: 'text' },
  { id: 6, contact_id: 1, sender: 'me', text: 'How about we do a 1 hour exchange? 30 mins Spanish, 30 mins Figma.', time: '10:35 AM', type: 'text' },
  { id: 7, contact_id: 1, sender: 'them', text: 'Sounds fair. When are you free?', time: '10:36 AM', type: 'text' },
  { id: 8, contact_id: 1, sender: 'me', type: 'proposal', status: 'pending', skill_me: 'Figma Skills', skill_them: 'Spanish Practice', time_slot: 'Tomorrow, 2:00 PM' },
];

const POSTS = [
  { id: 1, title: 'Finally baked my first perfect sourdough loaf! 🍞✨', user: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80', likes: 124, tag: 'Baking' },
  { id: 2, title: 'Sketching in the park today. Anyone want to join next time?', user: 'Sarah Jenks', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80', likes: 89, tag: 'Art' },
  { id: 3, title: 'Pottery progress after 3 weeks with @MikeChen. 🏺', user: 'Jessica L.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=80', likes: 256, tag: 'Pottery' },
  { id: 4, title: 'Coding setup upgrade! Ready to teach some React.', user: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=600&q=80', likes: 412, tag: 'Tech' },
  { id: 5, title: 'Morning yoga flow 🧘‍♀️ Best way to start the day.', user: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=600&q=80', likes: 67, tag: 'Wellness' },
  { id: 6, title: 'Learning guitar is harder than it looks, but so rewarding!', user: 'Alex Turner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=600&q=80', likes: 103, tag: 'Music' },
  { id: 7, title: 'Urban gardening in my small apartment 🌱', user: 'Green Thumb', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', likes: 156, tag: 'Gardening' },
  { id: 8, title: 'Late night writing session ✍️ #novelinprogress', user: 'Writer Dan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80', likes: 92, tag: 'Writing' },
  { id: 9, title: 'Exploring hidden gems in Kyoto 🇯🇵', user: 'Travel Bug', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80', likes: 340, tag: 'Travel' },
  { id: 10, title: 'DIY shelf project finally done! 🔨', user: 'Maker Joe', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&w=600&q=80', likes: 210, tag: 'DIY' },
  { id: 11, title: 'Latte art practice. Getting better! ☕️', user: 'Barista Bob', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80', likes: 180, tag: 'Coffee' },
  { id: 12, title: 'Sunday abstract painting vibes 🎨', user: 'Art Vibe', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80', likes: 115, tag: 'Art' },
  { id: 13, title: 'Hiking the Rockies. The view! 🏔️', user: 'Hiker Gal', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', likes: 290, tag: 'Hiking' },
  { id: 14, title: 'Chess strategy study. White to move.', user: 'Grandmaster', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80', likes: 75, tag: 'Chess' },
  { id: 15, title: 'Vegan meal prep for the week 🥗', user: 'Veggie Life', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', likes: 195, tag: 'Food' },
];

const COMMUNITY_UPDATES = [
  { id: 1, text: 'Sophie just learned Python with Mark!', time: '2m ago', icon: '🚀', color: 'bg-blue-100 text-blue-600' },
  { id: 2, text: "New 'Watercolor' group started downtown.", time: '15m ago', icon: '🎨', color: 'bg-purple-100 text-purple-600' },
  { id: 3, text: "Liam earned the 'Super Teacher' badge.", time: '1h ago', icon: '🏆', color: 'bg-yellow-100 text-yellow-600' },
  { id: 4, text: "Sarah joined the 'Urban Photography' challenge.", time: '2h ago', icon: '📷', color: 'bg-pink-100 text-pink-600' },
  { id: 5, text: "David updated his 'React Mastery' course.", time: '3h ago', icon: '💻', color: 'bg-indigo-100 text-indigo-600' },
  { id: 6, text: "Emma commented on 'Sourdough Baking'.", time: '4h ago', icon: '💬', color: 'bg-green-100 text-green-600' },
  { id: 7, text: 'Tom is looking for a guitar teacher.', time: '5h ago', icon: '🎸', color: 'bg-orange-100 text-orange-600' },
  { id: 8, text: 'Anna and Robert swapped skills.', time: '6h ago', icon: 'qh', color: 'bg-teal-100 text-teal-600' },
  { id: 9, text: "James posted a new resource: 'SEO Guide'.", time: '8h ago', icon: 'aaa', color: 'bg-cyan-100 text-cyan-600' },
  { id: 10, text: "Linda liked your 'Vegan Cooking' skill.", time: '12h ago', icon: '❤️', color: 'bg-red-100 text-red-600' },
  { id: 11, text: 'Alex followed you.', time: '1d ago', icon: '👤', color: 'bg-slate-100 text-slate-600' },
  { id: 12, text: "Barista Bob is live: 'Latte Art 101'", time: '1d ago', icon: '☕️', color: 'bg-amber-100 text-amber-600' },
];

const USER_POSTS = [
  { id: 1, user_id: 'u_jessica', content: "Just finished a lovely pottery session with @Sarah! 🏺 Can't wait to show you the final glazed results next week.", image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=80', likes: 124, comments: 18, time: '2h ago' },
  { id: 2, user_id: 'u_jessica', content: "Sharing my top 5 Figma plugins for 2026. Check them out! 👇 #designtips", likes: 89, comments: 42, time: '1d ago' },
];

const REVIEWS = [
  { user_name: 'Sarah Jenks', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', rating: 5, date: '2 days ago', text: 'Jessica is an amazing teacher! She explains Figma auto-layout so clearly. I finally get how it works. Highly recommended!', class: 'Figma Mastery' },
  { user_name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', rating: 5, date: '1 week ago', text: "Great pottery session. She was very patient with my clumsy hands haha. Can't wait for the next one.", class: 'Pottery Basics' },
  { user_name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', rating: 5, date: '2 weeks ago', text: 'Very professional and friendly. We swapped Spanish for Figma skills and it was a perfect exchange.', class: 'Skill Swap' },
  { user_name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', rating: 4, date: '1 month ago', text: 'Good session, learned a lot about component properties.', class: 'Design Systems' },
];

const SIMILAR_EXPERTS = [
  { name: 'Brent', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', lessons: 6099, rating: 5.0, price: '15.00' },
  { name: 'Michael R', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', lessons: 10857, rating: 5.0, price: '10.00' },
  { name: 'John K.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80', lessons: 16043, rating: 5.0, price: '17.00' },
  { name: 'Sarah L.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80', lessons: 420, rating: 4.9, price: '12.00' },
];

// --- Mock API Implementation ---

async function mockDelay<T>(data: T, ms = 300): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

// --- User ---
export function fetchCurrentUser() {
  return mockDelay(CURRENT_USER);
}

// --- Skills ---
export function fetchSkills(params?: { category?: string; search?: string }) {
  let result = [...SKILLS];
  if (params?.category) {
    result = result.filter(s => s.type === params.category);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }
  return mockDelay(result);
}

// --- Sessions ---
export function fetchSessions(params?: { filter?: string; dashboard?: boolean }) {
  let result = [...SESSIONS];
  if (params?.dashboard) {
    result = result.filter(s => s.id > 100); // Hacky way to separate dashboard items
  } else if (params?.filter) {
    result = result.filter(s => s.type === params.filter);
  } else {
    // Return main sessions by default if no filter
    result = result.filter(s => s.id < 100);
  }
  return mockDelay(result);
}

// --- Contacts ---
export function fetchContacts() {
  return mockDelay(CONTACTS);
}

// --- Messages ---
export function fetchMessages(contactId: number) {
  return mockDelay(MESSAGES.filter(m => m.contact_id === contactId));
}

export function sendMessage(contactId: number, message: {
  text?: string; type?: string; sender?: string;
  skill_me?: string; skill_them?: string; time_slot?: string;
}) {
  return mockDelay({ id: Date.now(), success: true });
}

// --- Posts ---
export function fetchPosts() {
  return mockDelay(POSTS);
}

// --- Community Updates ---
export function fetchCommunityUpdates() {
  return mockDelay(COMMUNITY_UPDATES);
}

// --- User Posts ---
export function fetchUserPosts() {
  return mockDelay(USER_POSTS);
}

// --- Reviews ---
export function fetchReviews() {
  return mockDelay(REVIEWS);
}

// --- Similar Experts ---
export function fetchSimilarExperts() {
  return mockDelay(SIMILAR_EXPERTS);
}

// --- AI ---
export function processAI(data: {
  action: 'translate' | 'contract' | 'schedule';
  context: string;
  targetLanguage?: string;
}) {
  let result = '';
  if (data.action === 'translate') {
    result = "Translation: " + data.context + " (Mock AI)";
  } else if (data.action === 'schedule') {
    result = "Suggested time: Tomorrow at 2 PM based on your chat history.";
  } else if (data.action === 'contract') {
    result = "Draft contract created for 1 hour skill swap.";
  }
  return mockDelay({ result, confidence: 0.95 }, 1000);
}
