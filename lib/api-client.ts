const API_BASE = '/api';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || 'API request failed');
  }
  return res.json();
}

// --- User ---
export function fetchCurrentUser() {
  return fetchApi<{
    id: string; name: string; avatar: string; title?: string;
    location?: string; level?: number; trustScore?: number;
    credits?: number; bio?: string; isPro?: boolean; tags?: string[];
  }>('/user/me');
}

// --- Skills ---
export function fetchSkills(params?: { category?: string; search?: string }) {
  const sp = new URLSearchParams();
  if (params?.category) sp.set('category', params.category);
  if (params?.search) sp.set('search', params.search);
  const qs = sp.toString();
  return fetchApi<any[]>(`/skills${qs ? '?' + qs : ''}`);
}

// --- Sessions ---
export function fetchSessions(params?: { filter?: string; dashboard?: boolean }) {
  const sp = new URLSearchParams();
  if (params?.filter) sp.set('filter', params.filter);
  if (params?.dashboard) sp.set('dashboard', 'true');
  const qs = sp.toString();
  return fetchApi<any[]>(`/sessions${qs ? '?' + qs : ''}`);
}

// --- Contacts ---
export function fetchContacts() {
  return fetchApi<any[]>('/contacts');
}

// --- Messages ---
export function fetchMessages(contactId: number) {
  return fetchApi<any[]>(`/messages/${contactId}`);
}

export function sendMessage(contactId: number, message: {
  text?: string; type?: string; sender?: string;
  skill_me?: string; skill_them?: string; time_slot?: string;
}) {
  return fetchApi<{ id: number; success: boolean }>(`/messages/${contactId}`, {
    method: 'POST',
    body: JSON.stringify(message),
  });
}

// --- Posts ---
export function fetchPosts() {
  return fetchApi<any[]>('/posts');
}

// --- Community Updates ---
export function fetchCommunityUpdates() {
  return fetchApi<any[]>('/community');
}

// --- User Posts ---
export function fetchUserPosts() {
  return fetchApi<any[]>('/user-posts');
}

// --- Reviews ---
export function fetchReviews() {
  return fetchApi<any[]>('/reviews');
}

// --- Similar Experts ---
export function fetchSimilarExperts() {
  return fetchApi<any[]>('/similar-experts');
}

// --- AI ---
export function processAI(data: {
  action: 'translate' | 'contract' | 'schedule';
  context: string;
  targetLanguage?: string;
}) {
  return fetchApi<{ result: string; confidence: number }>('/ai/process', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
