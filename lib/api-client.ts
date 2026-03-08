/**
 * API Client - 根据应用模式切换 Mock / 真实 API
 * - demo / guest: Mock 数据（竞赛展示、游客体验）
 * - authenticated: 真实后端 API（已登录用户）
 */
import { useMockData } from './app-mode';
import {
  MOCK_CURRENT_USER,
  MOCK_SKILLS,
  MOCK_SESSIONS,
  MOCK_CONTACTS,
  MOCK_MESSAGES,
  MOCK_POSTS,
  MOCK_EXCHANGE_FEEDBACK_POSTS,
  MOCK_COMMUNITY_UPDATES,
  MOCK_USER_POSTS,
  MOCK_REVIEWS,
  MOCK_SIMILAR_EXPERTS,
  MOCK_NFTS,
  mockDelay
} from './mock-data';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '') + '/api';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options?.headers as Record<string, string>) };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('auth_token');
    if (typeof window !== 'undefined') window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API request failed');
  }

  return res.json();
}

function buildQuery(params?: Record<string, string | boolean | undefined>): string {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

// --- Auth Helpers ---
export const auth = {
  getToken: () => (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null),
  setToken: (token: string) => localStorage.setItem('auth_token', token),
  logout: () => {
    localStorage.removeItem('auth_token');
    if (typeof window !== 'undefined') window.location.href = '/';
  }
};

// --- User ---
export function fetchCurrentUser() {
  if (useMockData()) return mockDelay(MOCK_CURRENT_USER);
  return fetchApi<any>('/user/me');
}

// --- Skills ---
export function fetchSkills(params?: { category?: string; search?: string }, opts?: { forceMock?: boolean }) {
  if (useMockData() || opts?.forceMock) {
    let result = [...MOCK_SKILLS];
    if (params?.category && params.category !== 'All Skills') {
      if (params.category === 'Design') {
        result = result.filter(s => s.type === 'Design' || s.type === 'Art');
      } else if (params.category === 'Other') {
        result = result.filter(s => !['Language', 'Fitness', 'Tech', 'Design', 'Art'].includes(s.type));
      } else {
        result = result.filter(s => s.type === params.category);
      }
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(s => s.title.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q));
    }
    return mockDelay(result);
  }
  const q = buildQuery({ category: params?.category, search: params?.search });
  return fetchApi<any[]>('/skills' + q);
}

// --- Sessions ---
export function fetchSessions(params?: { filter?: string; dashboard?: boolean }) {
  if (useMockData()) {
    let result = [...MOCK_SESSIONS];
    if (params?.dashboard) {
      result = result.filter(s => s.id > 100);
    } else if (params?.filter) {
      result = result.filter(s => s.type === params.filter);
    } else {
      result = result.filter(s => s.id < 100);
    }
    return mockDelay(result);
  }
  const q = buildQuery({ filter: params?.filter, dashboard: params?.dashboard ? 'true' : undefined });
  return fetchApi<any[]>('/sessions' + q);
}

// --- Contacts ---
export function fetchContacts() {
  if (useMockData()) return mockDelay(MOCK_CONTACTS);
  return fetchApi<any[]>('/contacts');
}

// --- Messages ---
export function fetchMessages(contactId: number) {
  if (useMockData()) {
    const list = MOCK_MESSAGES[contactId] || [];
    return mockDelay(list);
  }
  return fetchApi<any[]>(`/messages/${contactId}`);
}

export function sendMessage(contactId: number, message: {
  text?: string; type?: string; sender?: string;
  skill_me?: string; skill_them?: string; time_slot?: string;
}) {
  if (useMockData()) return mockDelay({ id: Date.now(), success: true });
  return fetchApi<{ id: number; success: boolean }>(`/messages/${contactId}`, {
    method: 'POST',
    body: JSON.stringify(message)
  });
}

// --- Posts ---
export function fetchPosts(opts?: { forceMock?: boolean }) {
  if (useMockData() || opts?.forceMock) return mockDelay(MOCK_POSTS);
  return fetchApi<any[]>('/posts');
}

// --- Community Updates ---
export function fetchCommunityUpdates(opts?: { forceMock?: boolean }) {
  if (useMockData() || opts?.forceMock) return mockDelay(MOCK_COMMUNITY_UPDATES);
  return fetchApi<any[]>('/community');
}

// --- Exchange Feedback Posts (交换反馈帖，双方确认交换后自动创建) ---
export function fetchExchangeFeedbackPosts(opts?: { forceMock?: boolean }) {
  if (useMockData() || opts?.forceMock) return mockDelay(MOCK_EXCHANGE_FEEDBACK_POSTS);
  return fetchApi<any[]>('/exchange-feedback').catch(() => []);
}

// --- User Posts ---
export function fetchUserPosts() {
  if (useMockData()) return mockDelay(MOCK_USER_POSTS);
  return fetchApi<any[]>('/user-posts');
}

// --- Reviews ---
export function fetchReviews() {
  if (useMockData()) return mockDelay(MOCK_REVIEWS);
  return fetchApi<any[]>('/reviews');
}

// --- Similar Experts ---
export function fetchSimilarExperts() {
  if (useMockData()) return mockDelay(MOCK_SIMILAR_EXPERTS);
  return fetchApi<any[]>('/similar-experts');
}

// --- Exchange Stats (真实数据：总交换时长、创造价值) ---
export interface ExchangeStats {
  totalHours: number;
  level: number;
  levelProgress: number;
  moneySaved: number;
  friendsMade: number;
  newSkills: number;
  nextMilestoneText: string;
}

const MOCK_EXCHANGE_STATS: ExchangeStats = {
  totalHours: 24.5,
  level: 3,
  levelProgress: 70,
  moneySaved: 1250,
  friendsMade: 12,
  newSkills: 4,
  nextMilestoneText: 'Complete 5 more sessions for "Consistent" badge.'
};

export function fetchExchangeStats() {
  if (useMockData()) return mockDelay(MOCK_EXCHANGE_STATS);
  return fetchApi<ExchangeStats>('/exchange-stats');
}

// --- User Learning Stats (真实数据：我的学习、已收藏) ---
export interface UserLearningStats {
  learningInProgress: number;
  savedCount: number;
}

const MOCK_LEARNING_STATS: UserLearningStats = { learningInProgress: 3, savedCount: 12 };

export function fetchUserLearningStats() {
  if (useMockData()) return mockDelay(MOCK_LEARNING_STATS);
  return fetchApi<UserLearningStats>('/user/learning-stats').catch(() => ({ learningInProgress: 0, savedCount: 0 }));
}

// --- AI (translate / contract / schedule) ---
export function processAI(data: {
  action: 'translate' | 'contract' | 'schedule';
  context: string;
  targetLanguage?: string;
}) {
  if (useMockData()) {
    let result = '';
    if (data.action === 'translate') result = 'Translation: ' + data.context + ' (Mock)';
    else if (data.action === 'schedule') result = 'Suggested time: Tomorrow at 2 PM based on your chat history.';
    else if (data.action === 'contract') result = 'Draft contract created for 1 hour skill swap.';
    return mockDelay({ result, confidence: 0.95 }, 1000);
  }
  return fetchApi<{ result: string; confidence: number }>('/ai/process', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// --- NFTs ---
export interface UserNFT {
  id: number;
  title: string;
  partner: string;
  partnerAvatar?: string;
  skillMe: string;
  skillThem: string;
  contributionMe: number;
  contributionThem: number;
  date?: string;
}

export interface NFTDetail {
  id: number;
  title: string;
  skillMe: string;
  skillThem: string;
  partnerName: string;
  partnerAvatar?: string;
  contributionMe: number;
  contributionThem: number;
  story: string;
  createdAt: string;
  timeline: { label: string; date: string }[];
}

export function fetchUserNFTs(userId?: string, opts?: { forceMock?: boolean }) {
  if (useMockData() || opts?.forceMock) {
    const list = MOCK_NFTS.map(n => ({ id: n.id, title: n.title, partner: n.partner, partnerAvatar: n.partnerAvatar, skillMe: n.skillMe, skillThem: n.skillThem, contributionMe: n.contributionMe, contributionThem: n.contributionThem, date: n.createdAt?.slice(0, 7) }));
    return mockDelay(list);
  }
  const q = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  return fetchApi<UserNFT[]>(`/nfts${q}`);
}

export function fetchNFTDetail(id: number, opts?: { forceMock?: boolean }) {
  if (useMockData() || opts?.forceMock) {
    const n = MOCK_NFTS.find(x => x.id === id) || MOCK_NFTS[0];
    return mockDelay({ ...n, partnerName: n.partner });
  }
  return fetchApi<NFTDetail>(`/nfts/${id}`);
}

// --- AI 配对助手 ---
export interface AiMatchMessage {
  role: 'user' | 'assistant';
  text: string;
  skillIds?: number[];
}

export interface AiMatchResponse {
  text: string;
  skillIds?: number[];
}

export async function sendAiMatchMessage(
  messages: { role: 'user' | 'assistant'; text: string }[]
): Promise<AiMatchResponse> {
  if (useMockData()) {
    await mockDelay(null, 600);
    return { text: '收到！正在为你匹配最合适的技能交换伙伴...', skillIds: [] };
  }
  return fetchApi<AiMatchResponse>('/ai/match/chat', {
    method: 'POST',
    body: JSON.stringify({ messages })
  });
}
