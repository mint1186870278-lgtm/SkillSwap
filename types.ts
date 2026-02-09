// Existing types
export interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  text: string;
  skillIcon: string; 
}

export interface ValueProp {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

// --- New Domain Models for Application Logic ---

export type ViewType = 'home' | 'explore' | 'detail' | 'profile' | 'exchange' | 'messages';

export interface User {
  id: string | number;
  name: string;
  avatar: string;
  title?: string; // e.g. "Product Designer"
  location?: string;
  level?: number;
  trustScore?: number;
  credits?: number;
  bio?: string;
  isPro?: boolean;
}

export interface Skill {
  id: number;
  title: string;
  user: string;
  avatar: string;
  type: string; // Category e.g. Language, Tech
  distance?: string;
  image: string;
  rating: number;
  lessons?: number;
  speaks?: string;
  price?: number;
  description?: string;
  tag?: string; // Sometimes used interchangeably with type in UI
}

export interface Post {
  id: number;
  title?: string;
  content?: string; // Some mocks use 'content', some 'title'
  user: string; // Author name
  avatar: string;
  image?: string | null;
  likes: number;
  comments?: number;
  tag?: string;
  time?: string;
}

export interface Session {
  id: number;
  type: 'upcoming' | 'pending' | 'past' | 'Teaching' | 'Learning'; // Unified status
  title?: string; // Unified: sometimes 'title', sometimes 'skill'
  skill?: string; 
  partner?: string; // 'with' or 'partner' or 'user'
  with?: string;
  avatar: string;
  date?: string;
  time: string;
  status?: string;
  roomLink?: string;
  rated?: boolean;
  meetingLink?: string;
  rating?: number;
}

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  status: 'online' | 'offline';
  skill?: string;
}

export interface Message {
  id: number;
  sender: 'me' | 'them' | 'system';
  text?: string;
  time?: string;
  type?: 'text' | 'ai_trans' | 'proposal';
  icon?: any; // Lucide icon component
  status?: 'pending' | 'accepted' | 'rejected';
  skill_me?: string;
  skill_them?: string;
  time_slot?: string;
}

export interface CommunityUpdate {
  id: number;
  text: string;
  time: string;
  icon: string | any; // Emoji or Icon component
  color: string;
}

export interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  class?: string;
}
