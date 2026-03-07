import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, MessageCircle, User, Calendar, Search, Bell, 
  Menu, Filter, MapPin, Star, Heart, Share2, MoreHorizontal,
  Zap, ChevronRight, Clock, Sparkles, Compass, Video, BookOpen,
  LayoutGrid, Image as ImageIcon, Plus, X, Play, Languages, ChevronDown, Check,
  Bot, ChevronLeft, Send, Loader2
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';
import { MOCK_DATA_ZH } from '../lib/mock-data-zh';

import SkillDetailView from './views/SkillDetailView';
import UserProfileView from './views/UserProfileView';
import MyExchangesView from './views/ExchangeView';
import MessagesView from './views/MessagesView';

import { ViewType } from '../types';
import { fetchSkills, fetchSessions, fetchPosts, fetchCommunityUpdates, fetchExchangeFeedbackPosts, fetchUserLearningStats, sendAiMatchMessage } from '../lib/api-client';
import { CARD_HEIGHT, SIDEBAR_CARD_HEIGHT, GAP_ABOVE_TOP_PICKS, GAP_ABOVE_PRO_MEMBER } from '../lib/layout-config';
import { getAvatarForUserId } from '../lib/avatar-options';

// Helper to merge translation if language is ZH
const useTranslatedData = (data: any[], type: 'posts' | 'skills' | 'community_updates' | 'sessions') => {
  const { language } = useLanguage();
  
  if (language !== 'zh' || !data) return data;

  return data.map(item => {
    const translation = MOCK_DATA_ZH[type]?.[item.id];
    if (translation) {
      return { ...item, ...translation };
    }
    return item;
  });
};

// --- Detail Modal Component (Xiaohongshu Style) ---
const PostDetailModal = ({ item, onClose }: { item: any, onClose: () => void }) => {
  const { t } = useLanguage(); // Added useLanguage hook

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-8"
      >
        {/* Modal Card */}
        <motion.div 
          layoutId={`card-${item.id}`} // Shared Container
          className="bg-white w-full max-w-5xl h-[85vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative z-[101]"
          onClick={(e) => e.stopPropagation()}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Close Button (Floating) */}
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={20} strokeWidth={3} />
          </button>

          {/* Left: Image (Hero) */}
          <motion.div 
            layoutId={`img-${item.id}`} // Shared Image
            className="w-full md:w-[60%] h-1/2 md:h-full bg-slate-100 relative"
          >
             <ImageWithFallback 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover" 
             />
          </motion.div>

          {/* Right: Content (Scrollable) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-full md:w-[40%] h-1/2 md:h-full flex flex-col bg-white"
          >
             
             {/* Header: User Info */}
             <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full border border-slate-100 overflow-hidden">
                      <ImageWithFallback src={item.avatar} alt={item.user} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.user}</h4>
                      <p className="text-xs text-slate-400 font-medium">{t('modal.unknown_location')}</p>
                   </div>
                </div>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-colors">
                   {t('modal.follow')}
                </button>
             </div>

             {/* Body: Scrollable Content */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{item.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                   {item.content || t('modal.placeholder_content')}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                   {['#SkillSwap', '#Learning', `#${item.type || item.tag || 'Skill'}`].map(tag => (
                      <span key={tag} className="text-blue-600 text-sm font-bold cursor-pointer hover:underline">{tag}</span>
                   ))}
                </div>
                <div className="text-xs text-slate-400 font-medium pt-2">
                   {t('modal.posted_on')} {new Date().toLocaleDateString()}
                </div>
             </div>

             {/* Footer: Interactions */}
             <div className="p-4 border-t border-slate-100 shrink-0">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-slate-700 hover:text-red-500 transition-colors">
                         <Heart size={20} /> <span className="text-xs font-bold">{item.likes || item.rating || 0}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-700 hover:text-blue-500 transition-colors">
                         <Star size={20} /> <span className="text-xs font-bold">{t('modal.save')}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-700 hover:text-green-500 transition-colors">
                         <MessageCircle size={20} /> <span className="text-xs font-bold">{t('modal.comment')}</span>
                      </button>
                   </div>
                   <button className="text-slate-400 hover:text-slate-600">
                      <Share2 size={20} />
                   </button>
                </div>
                
                {/* Comment Input */}
                <div className="relative">
                   <div className="w-8 h-8 rounded-full bg-slate-200 absolute left-1 top-1 overflow-hidden">
                      <ImageWithFallback src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="" className="w-full h-full object-cover" />
                   </div>
                   <input 
                      type="text" 
                      placeholder={t('modal.say_something')} 
                      className="w-full bg-slate-100 rounded-full pl-11 pr-4 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                   />
                </div>
             </div>

          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

// --- Exchange Feedback Detail Modal (交换反馈帖详情) ---
const ExchangeFeedbackDetailModal = ({ item, onClose }: { item: any; onClose: () => void }) => {
  const { t, language } = useLanguage();
  const isZh = language === 'zh';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const progressUpdates = item?.progressUpdates || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-8"
    >
      <motion.div 
        layoutId={`card-ef-${item.id}`}
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col relative z-[101]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
          <X size={20} strokeWidth={3} />
        </button>

        <div className="p-6 border-b border-slate-100">
          <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-full mb-3">
            {isZh ? '交换反馈 · 平台自动创建' : 'Exchange Feedback · Auto-created'}
          </span>
          <h2 className="text-xl font-black text-slate-900 leading-tight">{item.title}</h2>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                <ImageWithFallback src={item.avatar} alt={item.user} className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                <ImageWithFallback src={item.partnerAvatar} alt={item.partner} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="text-sm font-bold text-slate-600">
              {item.skillMe} ⇄ {item.skillThem}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
          
          {progressUpdates.length > 0 && (
            <div>
              <h4 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Zap size={16} className="text-amber-500" /> {t('exchange_feedback.progress_updates')}
              </h4>
              <div className="space-y-3">
                {progressUpdates.map((u: any, i: number) => (
                  <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-indigo-600 shrink-0">{u.user}</span>
                    <p className="text-sm text-slate-700 flex-1">{u.text}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{u.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
            <Plus size={18} /> {t('exchange_feedback.add_progress')}
          </button>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Heart size={18} /> <span className="text-sm font-bold">{item.likes}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MessageCircle size={18} /> <span className="text-sm font-bold">{item.comments}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Components ---

const TopNavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-2 py-1 transition-colors duration-200 group relative ${
      active 
        ? 'text-indigo-600' 
        : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} className={`transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-110"}`} />
    <span className={`text-sm ${active ? "font-bold" : "font-medium"}`}>{label}</span>
  </button>
);

const NavBarItem = ({ icon: Icon, label, active, onClick }: any) => ( // Mobile/Bottom Nav
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 ${active ? 'text-indigo-600' : 'text-slate-400'}`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    {label && <span className="text-[10px] font-bold">{label}</span>}
  </button>
);

const SkillCard = ({ item, onClick, className = "", isPlaceholder = false }: { item: any, onClick?: () => void, className?: string, isPlaceholder?: boolean }) => {
  const { t, language } = useLanguage();
  const CardContent = (
    <>
      {/* 1. VIDEO PREVIEW AREA (Italki Style) */}
      <div className="relative h-40 shrink-0 bg-slate-900 overflow-hidden">
         {/* Image/Thumbnail - SHARED ELEMENT */}
         {isPlaceholder ? (
            <div className="w-full h-full relative">
               <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover opacity-90" />
            </div>
         ) : (
            <motion.div layoutId={`img-${item.id}`} className="w-full h-full relative">
               <ImageWithFallback 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
               />
            </motion.div>
         )}
         
         {/* Dark Overlay & Play Button (Static overlay on top of image) */}
         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
               <Play size={16} className="fill-white text-white ml-0.5" />
            </div>
         </div>

         {/* Online Status Badge */}
         <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-green-500/90 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>{t('skill_card.online')}</span>
         </div>

         {/* Like Button */}
         <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white hover:text-red-500 transition-all">
            <Heart size={14} />
         </button>
      </div>

      <div className="p-3 flex flex-col flex-1 gap-2">
         {/* User Profile Row - Fixed Height for Alignment */}
         <div className="flex items-start justify-between gap-3 h-[42px]">
            <div className="flex items-center gap-2 min-w-0 flex-1">
               <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full border border-slate-100 p-0.5">
                     <ImageWithFallback src={item.avatar} alt={item.user} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[8px] shadow-sm">
                     🇺🇸
                  </div>
               </div>
               <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                     <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">{item.user}</h3>
                     <span className="px-1 py-[1px] rounded bg-indigo-100 text-indigo-700 text-[8px] font-black uppercase tracking-wider shrink-0">PRO</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{t('skill_card.pro_teacher')}</p>
               </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-1">
               <div className="flex items-center gap-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-black text-slate-800">{item.rating || '5.0'}</span>
               </div>
               <span className="text-[9px] text-slate-500 font-bold mt-0.5">{item.lessons || 128} {t('skill_card.lessons')}</span>
            </div>
         </div>

         {/* Skill Tags - Fixed Height */}
         <div className="flex items-center gap-2 py-1 h-[26px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">{t('skill_card.lang')}</span>
            <div className="flex gap-1 overflow-hidden">
               <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600 whitespace-nowrap">{item.speaks || 'English'} <span className="text-slate-400 font-normal">{t('skill_card.native')}</span></span>
               <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600 shrink-0">+2</span>
            </div>
         </div>

         {/* Description - Fixed Height (Force 2 lines space) */}
         <div className="min-h-[2.5rem] h-[2.5rem]">
            <h4 className="font-bold text-slate-700 text-xs line-clamp-1 mb-0.5">{item.title}</h4>
            <p className="text-[10px] leading-relaxed text-slate-500 line-clamp-2">{item.description || (language === 'zh' ? "技能互换达人，专注实战与清晰讲解。" : "Skill swap partner. Focus on practice & clear explanations.")}</p>
         </div>

         {/* Footer - Fixed Height */}
         <div className="mt-auto pt-3 flex items-center justify-between h-[42px] shrink-0">
            <div className="flex flex-col justify-center">
               <span className="block text-[9px] text-slate-400 font-medium leading-none mb-1">{t('skill_card.trial')}</span>
               <div className="flex items-baseline gap-1 leading-none">
                 <span className="text-sm font-black text-slate-900">{item.price || 1} {t('skill_card.credit')}</span>
               </div>
            </div>
            <button className="h-full px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center justify-center">
               {t('skill_card.book')}
            </button>
         </div>
      </div>
    </>
  );

  if (isPlaceholder) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm pointer-events-none ${className}`} style={{ height: CARD_HEIGHT }}>
        {CardContent}
      </div>
    );
  }

  return (
    <motion.div 
      layoutId={`card-${item.id}`} // Shared Layout ID
      onClick={onClick}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer group flex flex-col hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 ${className}`}
      style={{ height: CARD_HEIGHT }}
    >
      {CardContent}
    </motion.div>
  );
};

const SessionCard = ({ session }: { session: any }) => (
  <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
     <div className="flex items-center gap-4">
        <div className="relative">
           <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100">
             <ImageWithFallback src={session.avatar} alt={session.with} className="w-full h-full object-cover" />
           </div>
           <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white p-1 rounded-full border-2 border-white">
              <Video size={10} />
           </div>
        </div>
        <div>
           <h4 className="font-bold text-slate-800">{session.title}</h4>
           <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="font-medium">with {session.with}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="flex items-center gap-1 text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                <Clock size={10} /> {session.time}
              </span>
           </div>
        </div>
     </div>
     <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-colors">
        Join
     </button>
  </div>
);

const CommunityPostCard = ({ post, onClick, className = "", isPlaceholder = false }: { post: any, onClick?: () => void, className?: string, isPlaceholder?: boolean }) => {
  const CardContent = (
    <>
      <div className="relative w-full h-48 bg-slate-100 shrink-0">
         {isPlaceholder ? (
            <div className="w-full h-full relative">
               <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover" />
               <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
                  {post.tag}
               </div>
            </div>
         ) : (
            <motion.div layoutId={`img-${post.id}`} className="w-full h-full relative">
               <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
                  {post.tag}
               </div>
            </motion.div>
         )}
      </div>
      
      <div className="p-4 flex flex-col flex-1 h-full">
         <h4 className="font-bold text-slate-800 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors flex-1">{post.title}</h4>
         
         <div className="mt-auto flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                  <ImageWithFallback src={post.avatar} alt={post.user} className="w-full h-full object-cover" />
               </div>
               <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">{post.user}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 group-hover:text-pink-500 transition-colors">
               <Heart size={14} />
               <span className="text-[10px] font-bold">{post.likes}</span>
            </div>
         </div>
      </div>
    </>
  );

  if (isPlaceholder) {
    return (
      <div className={`bg-white rounded-[1.5rem] overflow-hidden shadow-sm flex flex-col pointer-events-none border border-slate-100 ${className}`} style={{ height: CARD_HEIGHT }}>
        {CardContent}
      </div>
    );
  }

  return (
    <motion.div 
      layoutId={`card-${post.id}`} // Shared layout ID (Ensure IDs are unique globally or prefixed if data sources mix)
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group mb-0 break-inside-avoid border border-slate-100 flex flex-col ${className}`}
      style={{ height: CARD_HEIGHT }}
    >
      {CardContent}
    </motion.div>
  );
};

// --- Views ---

// 1. HOME VIEW: Personal Dashboard
const DashboardView = ({ onOpenDetail, onExplore, onNavigateToExchangeFeedback, selectedItem, skills, upcomingSessions, communityUpdates, learningStats, testMode }: { onOpenDetail: (item: any) => void, onExplore: () => void, onNavigateToExchangeFeedback?: () => void, selectedItem: any, skills: any[], upcomingSessions: any[], communityUpdates: any[], learningStats: { learningInProgress: number; savedCount: number }, testMode?: boolean }) => {
  const { t, language } = useLanguage();
  const isZh = language === 'zh';
  const translatedSkills = useTranslatedData(skills, 'skills');
  const translatedSessions = useTranslatedData(upcomingSessions, 'sessions');
  const translatedUpdates = useTranslatedData(communityUpdates, 'community_updates');

  return (
  <div className="h-full pb-20">
      
      {/* Header Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          {t('dashboard.greeting')}
        </h1>
        <p className="text-slate-500 font-medium mt-1">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="space-y-8 lg:col-span-2">
            <section>
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-500" /> {t('dashboard.schedule')}
                  </h3>
                  <button onClick={onExplore} className="hidden md:flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline">
                     {t('dashboard.find_more')} <ChevronRight size={16} />
                  </button>
               </div>
               <div className="space-y-4">
                  {translatedSessions.map((session: any) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
               </div>
            </section>
            <section className="grid grid-cols-2 gap-4">
               <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200 group cursor-pointer hover:scale-[1.02] transition-transform">
                  <div className="relative z-10">
                     <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-white">
                        <BookOpen size={20} />
                     </div>
                     <h3 className="font-bold text-lg mb-1">{t('dashboard.my_learning')}</h3>
                     <p className="text-indigo-100 text-sm">{learningStats.learningInProgress > 0 ? (isZh ? `${learningStats.learningInProgress} 项技能进行中` : `${learningStats.learningInProgress} skills in progress`) : (isZh ? '暂无进行中的技能' : 'No skills in progress')}</p>
                     <div className="mt-4 w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-white/80 transition-all" style={{ width: `${Math.min(100, learningStats.learningInProgress * 20)}%` }}></div>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
               </div>
               <div className="bg-white border border-slate-100 rounded-[2rem] p-6 relative overflow-hidden shadow-sm group cursor-pointer hover:scale-[1.02] transition-transform hover:border-pink-200">
                  <div className="relative z-10">
                     <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center mb-4 text-pink-500">
                        <Heart size={20} fill="currentColor" />
                     </div>
                     <h3 className="font-bold text-slate-800 text-lg mb-1">{t('dashboard.saved')}</h3>
                     <p className="text-slate-400 text-sm">{learningStats.savedCount > 0 ? (isZh ? `${learningStats.savedCount} 项待尝试技能` : `${learningStats.savedCount} skills to try`) : (isZh ? '暂无收藏' : 'No saved skills')}</p>
                  </div>
               </div>
            </section>
            {testMode && <div className="h-8" />}
            <section style={{ marginTop: GAP_ABOVE_TOP_PICKS }}>
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-black text-slate-800">{t('dashboard.top_picks')}</h3>
                 <button onClick={onExplore} className="text-xs font-bold text-slate-400 hover:text-indigo-600">{t('dashboard.see_all')}</button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {translatedSkills.slice(0, 4).map((item: any) => (
                    <div key={item.id} className="relative">
                       {selectedItem?.id === item.id && <SkillCard item={item} isPlaceholder className="absolute inset-0 z-0" />}
                       <SkillCard item={item} onClick={() => onOpenDetail(item)} className="relative z-10" />
                    </div>
                  ))}
               </div>
            </section>
         </div>
         <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm mt-[44px] flex flex-col overflow-hidden" style={{ height: SIDEBAR_CARD_HEIGHT }}>
                <div className="flex items-center justify-between mb-6 shrink-0">
                   <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                      <Zap size={20} className="fill-yellow-400 text-yellow-400"/> {t('dashboard.activity')}
                   </h3>
                   {onNavigateToExchangeFeedback && (
                      <button onClick={onNavigateToExchangeFeedback} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                         {t('explore.exchange_feedback')} →
                      </button>
                   )}
                </div>
                <div className="relative space-y-6 flex-1 overflow-y-auto min-h-0">
                   <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                   {translatedUpdates.map((u: any) => (
                     <div key={u.id} className="flex gap-4 items-start relative z-10">
                       <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${u.color.replace('text-', 'bg-').replace('100', '500')} text-white text-[10px]`}>
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-700 leading-snug mb-1">{u.text}</p>
                         <span className="text-[10px] text-slate-400 font-medium">{u.time}</span>
                       </div>
                     </div>
                   ))}
                </div>
            </div>
            {testMode && <div className="h-8" />}
            <div className="bg-[#111] text-white rounded-[2rem] p-6 relative overflow-hidden shadow-xl" style={{ marginTop: GAP_ABOVE_PRO_MEMBER }}>
               <div className="relative z-10">
                  <h4 className="font-black text-xl mb-2">{t('dashboard.pro_member')}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">{t('dashboard.upgrade_text')}</p>
                  <button className="w-full py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-200 transition-colors">
                    {t('dashboard.upgrade')}
                  </button>
               </div>
               {/* Decorative Gradient */}
               <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-indigo-600 blur-[80px] opacity-40"></div>
            </div>
            
            {/* Spacer to ensure bottom margin similar to Explore view */}
            <div className="h-10 w-full"></div>
         </div>
      </div>
  </div>
  );
};

// 2. EXPLORE VIEW: Discovery
const ExploreView = ({ onOpenDetail, selectedItem, skills, posts, exchangeFeedbackPosts, communityUpdates, testMode, initialTab, initialCommunityFilter, onMounted }: { onOpenDetail: (item: any) => void, selectedItem: any, skills: any[], posts: any[], exchangeFeedbackPosts: any[], communityUpdates: any[], testMode?: boolean, initialTab?: 'community', initialCommunityFilter?: 'exchange_feedback', onMounted?: () => void }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'skills' | 'community'>(initialTab || 'skills');
  const [communityFilter, setCommunityFilter] = useState<'all' | 'exchange_feedback'>(initialCommunityFilter || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Skills');

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    if (initialCommunityFilter) setCommunityFilter(initialCommunityFilter);
    onMounted?.();
  }, []);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiPanelHeight, setAiPanelHeight] = useState(540);
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; text: string; skillIds?: number[] }[]>([]);
  const [aiInputValue, setAiInputValue] = useState('');
  const [aiSending, setAiSending] = useState(false);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendAiMessage = async () => {
    const text = aiInputValue.trim();
    if (!text || aiSending) return;
    setAiMessages(prev => [...prev, { role: 'user', text }]);
    setAiInputValue('');
    setAiSending(true);
    try {
      const history = aiMessages.map(m => ({ role: m.role, text: m.text }));
      const res = await sendAiMatchMessage([...history, { role: 'user', text }]);
      setAiMessages(prev => [...prev, { role: 'assistant', text: res.text, skillIds: res.skillIds }]);
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', text: t('explore.ai_error') }]);
    } finally {
      setAiSending(false);
    }
  };

  useEffect(() => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);
  const trendingSectionRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (trendingSectionRef.current && rightColRef.current) {
        const trendingRect = trendingSectionRef.current.getBoundingClientRect();
        const colRect = rightColRef.current.getBoundingClientRect();
        setAiPanelHeight(Math.round(trendingRect.bottom - colRect.top));
      }
    };
    updateHeight();
    const el = rightColRef.current;
    if (el) {
      const ro = new ResizeObserver(updateHeight);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [activeTab, aiAssistantOpen]);

  const translatedSkills = useTranslatedData(skills, 'skills');
  const translatedPosts = useTranslatedData(posts, 'posts');
  const translatedExchangeFeedback = exchangeFeedbackPosts;
  const translatedUpdates = useTranslatedData(communityUpdates, 'community_updates');

  // 全部帖子 = 用户自发帖（小红书风格）；交换反馈 = 平台自动创建的交换记录
  const communityPostsToShow = communityFilter === 'exchange_feedback'
    ? translatedExchangeFeedback
    : translatedPosts;

  const filteredSkills = selectedCategory === 'All Skills' 
    ? translatedSkills 
    : translatedSkills.filter((skill: any) => {
        if (selectedCategory === 'Design') return skill.type === 'Design' || skill.type === 'Art' || skill.type === '设计' || skill.type === '艺术';
        if (selectedCategory === 'Other') return !['Language', 'Fitness', 'Tech', 'Design', 'Art', '语言', '健身', '技术', '设计', '艺术'].includes(skill.type);
        // Map category ID to translation if needed for filtering
        const typeMap: any = { 'Language': '语言', 'Fitness': '健身', 'Tech': '技术', 'Design': '设计', 'Art': '艺术' };
        return skill.type === selectedCategory || skill.type === typeMap[selectedCategory];
    });

  return (
  <div className="pb-20 relative">
     
      {/* 测试页：首屏大图区（与 landing 颜色体系对齐） */}
      {testMode && (
        <div className="mb-4 relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 md:p-5 text-white shadow-lg border border-white/20">
          <div className="relative z-10 max-w-2xl flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5 border border-white/30 text-white">
                <Sparkles className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                NEW: 智能技能匹配
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold mb-1 leading-tight text-white">
                {t('explore.ai_hero_title')}
              </h1>
              <p className="text-white/90 text-sm mb-0 sm:mb-2">
                {t('explore.ai_hero_subtitle')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button 
                onClick={() => setAiAssistantOpen(true)}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-1 group text-sm shadow-md"
              >
                立即开始 AI 匹配
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
            <Sparkles className="w-32 h-32 rotate-12 text-pastelPurple" />
          </div>
        </div>
      )}

      {/* Main Layout: Grid Structure for Perfect Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
         
         {/* Left: Content Area */}
         <div className="min-w-0">
            {/* HEADER ROW (Left Side) - Adjusted for new layout */}
            <div className="mb-4 flex flex-col gap-2">
                 {/* Row 1: Tab Switcher (Text Style) */}
                 <div className="flex items-center gap-6 h-[40px]">
                    <button 
                       onClick={() => setActiveTab('skills')}
                       className={`text-2xl font-black transition-colors ${activeTab === 'skills' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       {t('explore.find_skills')}
                    </button>
                    <button 
                       onClick={() => setActiveTab('community')}
                       className={`text-2xl font-black transition-colors ${activeTab === 'community' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       {t('explore.forum')}
                    </button>
                 </div>

                 {/* Row 2: Categories (Below Tabs) */}
                 {activeTab === 'skills' && (
                     <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-linear-fade pt-1">
                         <button 
                           onClick={() => setSelectedCategory('All Skills')}
                           className={`h-9 px-4 flex items-center justify-center rounded-full text-xs font-bold shrink-0 transition-all ${selectedCategory === 'All Skills' ? 'bg-slate-900 text-white shadow-md shadow-slate-200' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'}`}
                         >
                           {t('explore.all_skills')}
                         </button>
                         {['Language', 'Fitness', 'Tech', 'Design', 'Other'].map(cat => (
                           <button 
                             key={cat} 
                             onClick={() => setSelectedCategory(cat)}
                             className={`h-9 px-4 flex items-center justify-center rounded-full text-xs font-bold shrink-0 transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-md shadow-slate-200' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'}`}
                           >
                             {t(`hero.skills.${cat.toLowerCase()}`)}
                           </button>
                         ))}
                     </div>
                 )}
                 {activeTab === 'community' && (
                     <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-linear-fade pt-1">
                         <button 
                           onClick={() => setCommunityFilter('all')}
                           className={`h-9 px-4 flex items-center justify-center rounded-full text-xs font-bold shrink-0 transition-all ${communityFilter === 'all' ? 'bg-slate-900 text-white shadow-md shadow-slate-200' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'}`}
                         >
                           {t('explore.all_posts')}
                         </button>
                         <button 
                           onClick={() => setCommunityFilter('exchange_feedback')}
                           className={`h-9 px-4 flex items-center justify-center rounded-full text-xs font-bold shrink-0 transition-all ${communityFilter === 'exchange_feedback' ? 'bg-slate-900 text-white shadow-md shadow-slate-200' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'}`}
                         >
                           {t('explore.exchange_feedback')}
                         </button>
                     </div>
                 )}
            </div>

            {/* CONTENT GRID */}
            <AnimatePresence mode="wait">
               {activeTab === 'skills' ? (
                  <motion.div 
                     key="skills-grid"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.2 }}
                     className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
                  >
                     {filteredSkills.map((item: any, i: any) => (
                        <div key={`${item.id}-${i}`} className="relative h-full flex flex-col">
                           {/* Placeholder */}
                           {selectedItem?.id === item.id && <SkillCard item={item} isPlaceholder className="absolute inset-0 z-0 h-full" />}
                           
                           {/* Animated Card */}
                           <SkillCard 
                             item={item} 
                             onClick={() => onOpenDetail(item)} 
                             className="relative z-10 h-full flex-1" 
                           />
                        </div>
                     ))}
                  </motion.div>
               ) : (
                  <motion.div
                     key="community-grid"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.2 }}
                     className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                      {communityPostsToShow.map((post: any, i: any) => (
                         <div key={`${post.id}-${i}`} className="relative h-full">
                           {/* Placeholder */}
                           {selectedItem?.id === post.id && <CommunityPostCard post={post} isPlaceholder className="absolute inset-0 z-0 h-full" />}
                           
                           {/* Animated Card */}
                           <CommunityPostCard post={post} onClick={() => onOpenDetail(post)} className="relative z-10 h-full" />
                         </div>
                      ))}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Right: 红框内 - 侧边栏始终存在，AI 助手为悬浮层 */}
         <div ref={rightColRef} className="hidden lg:block w-80 relative">
             {/* 侧边栏内容 - 始终渲染，不被替换 */}
             <div className="sticky top-4 flex flex-col">
                 <div className={`h-[40px] w-full flex items-center ${activeTab === 'skills' ? 'mb-[60px]' : 'mb-5'}`}>
                     <button className="w-full h-full bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 font-black text-lg shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                        {activeTab === 'skills' ? <Plus size={20} strokeWidth={3} /> : <ImageIcon size={20} strokeWidth={3} />}
                        <span>{activeTab === 'skills' ? t('explore.list_skill') : t('explore.share_post')}</span>
                     </button>
                 </div>
                 <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-5 shadow-sm flex flex-col mb-5" style={{ height: SIDEBAR_CARD_HEIGHT }}>
                     <div className="flex items-center justify-between mb-3 shrink-0">
                       <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                         <Zap size={16} className="fill-yellow-400 text-yellow-400"/> {t('explore.community')}
                       </h3>
                       <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">{t('explore.view_all')}</button>
                     </div>
                     <div className="relative flex-1 overflow-hidden group scroll-mask">
                       <style>{`
                         @keyframes scroll-vertical {
                           0% { transform: translateY(0); }
                           100% { transform: translateY(-50%); }
                         }
                         .animate-scroll-vertical {
                           animation: scroll-vertical 40s linear infinite;
                           animation-play-state: running;
                         }
                         .group:hover .animate-scroll-vertical {
                           animation-play-state: paused;
                         }
                         .scroll-mask {
                           mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                           -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                         }
                       `}</style>
                       <div className="animate-scroll-vertical">
                         {[...translatedUpdates, ...translatedUpdates].map((u: any, index: any) => (
                           <div key={`${u.id}-${index}`} className="flex gap-3 items-start relative z-10 mb-4 px-1">
                             <div className="absolute left-2.5 top-0 bottom-[-16px] w-0.5 bg-slate-200/50 rounded-full"></div>
                             <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-4 border-[#F8FAFC] shadow-sm ${u.color.replace('text-', 'bg-').replace('100', '500')} text-white text-[8px] ring-2 ring-white mt-0.5 relative z-20`}>
                             </div>
                             <div>
                               <p className="text-xs font-bold text-slate-700 leading-snug mb-0.5 group-hover/item:text-indigo-600 transition-colors line-clamp-2">{u.text}</p>
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{u.time}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                 </div>
                 <div className={`flex flex-col ${activeTab === 'skills' ? 'gap-2' : 'gap-10'}`}>
                    <div ref={trendingSectionRef} className="bg-white/40 border border-white/50 rounded-2xl p-2.5 hover:bg-white/60 transition-colors">
                       <h3 className="font-black text-xs text-slate-800 mb-1.5 flex items-center gap-2">
                         {t('explore.trending')}
                       </h3>
                       <div className="flex flex-wrap gap-1.5">
                          {['#DigitalArt', '#Sourdough', '#Python', '#Yoga'].map(tag => (
                             <span key={tag} className="px-2 py-0.5 bg-white rounded-md text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-100">
                                {tag}
                             </span>
                          ))}
                       </div>
                    </div>
                    {!testMode && (
                    <div className="bg-white/40 border border-white/50 rounded-2xl p-2.5 hover:bg-white/60 transition-colors group shrink-0">
                       <button 
                          onClick={() => setAiAssistantOpen(true)}
                          className="w-full flex items-center justify-between gap-2 group text-left"
                       >
                          <div className="flex items-center gap-2 min-w-0">
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 shrink-0 group-hover:scale-110 transition-transform">
                                <Bot size={14} />
                             </div>
                             <div className="min-w-0">
                                <h4 className="font-black text-slate-800 text-xs">{t('explore.ai_assistant')}</h4>
                                <p className="text-slate-400 text-[9px] font-medium truncate">{t('explore.ai_assistant_subtitle')}</p>
                             </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-400 shrink-0" />
                       </button>
                    </div>
                    )}
                 </div>
             </div>

             {/* AI 配对助手 - 悬浮层（非 testMode 时显示） */}
             {!testMode && (
             <AnimatePresence>
               {aiAssistantOpen && (
                  <motion.div
                     initial={{ opacity: 0, scale: 0.96 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.96 }}
                     transition={{ duration: 0.2, ease: 'easeOut' }}
                     className="absolute top-0 left-0 right-0 z-10 flex flex-col rounded-2xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 bg-white"
                     style={{ height: aiPanelHeight }}
                  >
                     <div className="bg-slate-900 text-white px-4 py-3 flex items-center gap-3 shrink-0">
                        <button onClick={() => setAiAssistantOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                           <ChevronLeft size={20} />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                           <Bot size={16} />
                        </div>
                        <span className="font-black text-sm truncate">{t('explore.ai_assistant')}</span>
                     </div>
                     <div className="flex-1 min-h-[280px] overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
                        <div className="flex justify-start">
                           <div className="max-w-[85%] px-4 py-2.5 bg-white text-slate-700 text-sm rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
                              {t('explore.ai_bot_welcome')}
                           </div>
                        </div>
                        {aiMessages.map((m, i) => (
                           <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] px-4 py-2.5 text-sm rounded-2xl border shadow-sm ${
                                 m.role === 'user'
                                    ? 'bg-indigo-500 text-white rounded-br-none border-indigo-500'
                                    : 'bg-white text-slate-700 rounded-bl-none border-slate-100'
                              }`}>
                                 {m.text}
                              </div>
                           </div>
                        ))}
                        {aiSending && (
                           <div className="flex justify-start">
                              <div className="max-w-[85%] px-4 py-2.5 bg-white text-slate-500 text-sm rounded-2xl rounded-bl-none border border-slate-100 shadow-sm animate-pulse">
                                 {t('explore.ai_loading')}
                              </div>
                           </div>
                        )}
                        <div ref={aiMessagesEndRef} />
                     </div>
                     <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                        <form onSubmit={(e) => { e.preventDefault(); handleSendAiMessage(); }} className="flex items-center gap-2 bg-slate-100/50 hover:bg-slate-100 rounded-full px-4 py-2.5 border border-transparent focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-200 transition-all">
                           <input 
                              type="text" 
                              value={aiInputValue}
                              onChange={(e) => setAiInputValue(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendAiMessage(); } }}
                              placeholder={t('explore.ai_type_message')} 
                              disabled={aiSending}
                              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 disabled:opacity-60"
                           />
                           <button type="submit" disabled={!aiInputValue.trim() || aiSending} className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors shrink-0">
                              <Send size={18} />
                           </button>
                        </form>
                     </div>
                  </motion.div>
               )}
             </AnimatePresence>
             )}
        </div>
     </div>

      {/* 测试页：悬浮 AI 助手 */}
      {testMode && (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
          {aiAssistantOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{t('explore.ai_assistant')}</h4>
                    <p className="text-[10px] opacity-80">智能匹配中...</p>
                  </div>
                </div>
                <button onClick={() => setAiAssistantOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 rounded-2xl rounded-tl-none bg-white text-slate-700 border border-slate-100 shadow-sm text-sm">
                    {t('explore.ai_bot_welcome')}
                  </div>
                </div>
                {aiMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {aiSending && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                      <span className="text-xs text-slate-400">{t('explore.ai_loading')}</span>
                    </div>
                  </div>
                )}
                <div ref={aiMessagesEndRef} />
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleSendAiMessage(); }} className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
                <input 
                  type="text" 
                  value={aiInputValue}
                  onChange={(e) => setAiInputValue(e.target.value)}
                  placeholder={t('explore.ai_type_message')} 
                  disabled={aiSending}
                  className="flex-1 bg-slate-100 border-none rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <button type="submit" disabled={!aiInputValue.trim() || aiSending} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="flex flex-col items-end gap-3">
              <div 
                className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] cursor-pointer hover:shadow-2xl transition-shadow" 
                onClick={() => setAiAssistantOpen(true)}
                style={{ animation: 'bounce-subtle 3s infinite ease-in-out' }}
              >
                <p className="text-xs font-bold text-slate-700">👋 需要我帮你找找看最合适的匹配吗？</p>
              </div>
              <button 
                onClick={() => setAiAssistantOpen(true)}
                className="relative w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-full flex items-center justify-center shadow-xl shadow-indigo-200 hover:scale-110 transition-all active:scale-95"
              >
                <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20" style={{ animationDuration: '2s' }} />
                <Sparkles className="w-7 h-7 text-white" />
              </button>
            </div>
          )}
        </div>
      )}
  </div>
  );
};

// --- Layout ---

interface MainAppProps {
  user: { name?: string; id?: string; imageUrl?: string };
  testMode?: boolean;
  appMode?: 'demo' | 'guest' | 'authenticated';
}

const MainAppLayout: React.FC<MainAppProps> = ({ user, testMode, appMode }) => {
  const { t, language, setLanguage } = useLanguage();
  const [currentView, setCurrentView] = useState<ViewType>('explore');
  const [selectedItem, setSelectedItem] = useState<any>(null); // State for modal (Inspiration/Community)
  const [selectedSkill, setSelectedSkill] = useState<any>(null); // State for full page view (Find Skills)
  const [exploreInitialState, setExploreInitialState] = useState<{ tab?: 'community'; communityFilter?: 'exchange_feedback' } | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const mockNotifications = [
    { id: 1, type: 'swap_request', from: 'Elena Rodriguez', text: language === 'zh' ? '请求与你交换西班牙语 × Figma' : 'Requested to swap Spanish × Figma', time: '10m ago', unread: true },
    { id: 2, type: 'swap_confirmed', from: 'David Kim', text: language === 'zh' ? '交换已确认：周六 14:00' : 'Swap confirmed: Sat 14:00', time: '1h ago', unread: true },
    { id: 3, type: 'new_message', from: 'Sarah J.', text: language === 'zh' ? '发来一条新消息' : 'Sent you a new message', time: '2h ago', unread: false }
  ];
  const unreadCount = mockNotifications.filter(n => n.unread).length;

  // API data states
  const [skills, setSkills] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [exchangeFeedbackPosts, setExchangeFeedbackPosts] = useState<any[]>([]);
  const [communityUpdates, setCommunityUpdates] = useState<any[]>([]);
  const [learningStats, setLearningStats] = useState<{ learningInProgress: number; savedCount: number }>({ learningInProgress: 0, savedCount: 0 });

  const useDiscoveryMock = appMode === 'authenticated';

  useEffect(() => {
    fetchSkills(undefined, useDiscoveryMock ? { forceMock: true } : undefined).then(setSkills).catch(console.error);
    fetchSessions({ dashboard: true }).then(setUpcomingSessions).catch(console.error);
    fetchPosts(useDiscoveryMock ? { forceMock: true } : undefined).then(setPosts).catch(console.error);
    fetchExchangeFeedbackPosts(useDiscoveryMock ? { forceMock: true } : undefined).then(setExchangeFeedbackPosts).catch(() => []);
    fetchCommunityUpdates(useDiscoveryMock ? { forceMock: true } : undefined).then(setCommunityUpdates).catch(console.error);
    if (appMode === 'authenticated') {
      fetchUserLearningStats().then(setLearningStats).catch(() => setLearningStats({ learningInProgress: 0, savedCount: 0 }));
    } else {
      setLearningStats({ learningInProgress: 3, savedCount: 12 });
    }
  }, [appMode, useDiscoveryMock]);

  // Close language/notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) setLangMenuOpen(false);
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) setNotificationMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenDetail = (item: any) => {
    // Determine if it's a Skill (Full Page) or Post (Modal)
    // Skills have 'lessons' property in our mock data, Posts have 'likes'
    if (item.lessons !== undefined || item.price !== undefined) {
       setSelectedSkill(item);
    } else {
       setSelectedItem(item);
    }
  };

  const handleLanguageSelect = (lang: 'en' | 'zh') => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-transparent font-sans text-slate-900 overflow-hidden flex flex-col">
      {/* Detail Modal Overlay (Inspiration / Exchange Feedback) */}
      <AnimatePresence>
        {selectedItem && (
          selectedItem.type === 'exchange_feedback' ? (
            <ExchangeFeedbackDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
          ) : (
            <PostDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
          )
        )}
      </AnimatePresence>
      
      {/* Skill Detail Full Page Overlay (Find Skills) */}
      <AnimatePresence>
         {selectedSkill && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: 20 }}
               transition={{ duration: 0.3 }}
               className="absolute inset-0 z-[60] bg-[#F8FAFC]"
            >
               <SkillDetailView item={selectedSkill} onBack={() => setSelectedSkill(null)} />
            </motion.div>
         )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {/* --- Top Navigation Bar --- */}
      <header className={`relative z-50 shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 ${testMode ? 'h-16' : 'py-3'}`}>
         
         {/* Left: Logo */}
         <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('explore')}>
            <div className={`bg-slate-900 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-slate-200 transform transition-transform group-hover:rotate-12 ${testMode ? 'w-10 h-10 text-lg' : 'w-9 h-9 text-lg'}`}>S</div>
            <span className="font-black text-xl tracking-tight text-slate-900 hidden sm:block">SkillSwap</span>
         </div>

         {/* Center: Navigation Links (Desktop) */}
         <nav className="hidden md:flex items-center gap-8 relative">
             <TopNavItem icon={Compass} label={t('navbar.explore')} active={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
             <TopNavItem icon={Home} label={t('navbar.about')} active={currentView === 'home'} onClick={() => setCurrentView('home')} /> {/* Using 'About' as Dashboard label temporarily or add new key */}
             <TopNavItem icon={Calendar} label={t('profile.exchanges')} active={currentView === 'exchange'} onClick={() => setCurrentView('exchange')} />
             <TopNavItem icon={MessageCircle} label={t('messages.title')} active={currentView === 'messages'} onClick={() => setCurrentView('messages')} />
             <TopNavItem icon={User} label={t('navbar.profile')} active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
         </nav>

         {/* Right: Search & Profile */}
         <div className="flex items-center gap-4 md:gap-5">
            {/* Search */}
            <div className="hidden lg:flex w-56 items-center gap-2 bg-slate-100/50 hover:bg-slate-100 rounded-full px-4 py-2 text-slate-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all border border-transparent focus-within:border-indigo-200">
                <Search size={16} />
                <input type="text" placeholder={t('messages.search')} className="bg-transparent border-none outline-none text-xs w-full font-medium" />
            </div>

            {/* Language Switcher */}
            <div className="relative" ref={langMenuRef}>
               <button 
                 onClick={() => setLangMenuOpen(!langMenuOpen)}
                 className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
               >
                 <Languages size={18} />
                 <ChevronDown size={14} className={`transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
               </button>
               
               {langMenuOpen && (
                 <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden z-[100]">
                   <button
                     onClick={() => handleLanguageSelect('en')}
                     className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors ${language === 'en' ? 'text-purple-600 font-bold bg-purple-50/50' : 'text-slate-700'}`}
                   >
                     <span>English</span>
                     {language === 'en' && <Check size={16} />}
                   </button>
                   <button
                     onClick={() => handleLanguageSelect('zh')}
                     className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors ${language === 'zh' ? 'text-purple-600 font-bold bg-purple-50/50' : 'text-slate-700'}`}
                   >
                     <span>中文</span>
                     {language === 'zh' && <Check size={16} />}
                   </button>
                 </div>
               )}
            </div>

            <div className={`flex items-center gap-3 ${testMode ? 'gap-4' : ''}`}>
               <div className="relative" ref={notificationMenuRef}>
                  <button 
                     onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                     className={`relative hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-all ${testMode ? 'w-10 h-10' : 'w-9 h-9'} ${notificationMenuOpen ? 'bg-slate-100' : ''}`}
                  >
                     <Bell size={testMode ? 20 : 18} />
                     {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 min-w-[6px] h-1.5 px-0.5 bg-red-500 rounded-full border border-white flex items-center justify-center text-[9px] font-black text-white">
                           {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                     )}
                  </button>
                  {notificationMenuOpen && (
                     <div className="absolute top-full right-0 mt-2 w-80 max-h-[400px] bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden z-[100] flex flex-col">
                     <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="font-black text-slate-800 text-sm">{t('navbar.notifications')}</h4>
                        {unreadCount > 0 && <span className="text-xs font-bold text-indigo-600">{unreadCount} {language === 'zh' ? '条未读' : 'unread'}</span>}
                     </div>
                     <div className="overflow-y-auto max-h-[320px]">
                        {mockNotifications.length === 0 ? (
                           <div className="px-4 py-8 text-center text-slate-400 text-sm">{t('navbar.no_notifications')}</div>
                        ) : (
                           mockNotifications.map(n => (
                              <button
                                 key={n.id}
                                 onClick={() => { setNotificationMenuOpen(false); n.type === 'new_message' && setCurrentView('messages'); }}
                                 className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-3 transition-colors ${n.unread ? 'bg-indigo-50/30' : ''}`}
                              >
                                 <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0 flex items-center justify-center">
                                    <Bell size={14} className="text-slate-500" />
                                 </div>
                                 <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-800 truncate">{n.from}</p>
                                    <p className="text-xs text-slate-500 line-clamp-2">{n.text}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                                 </div>
                              </button>
                           ))
                        )}
                     </div>
                  </div>
                  )}
               </div>
               <div className={`rounded-full border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${testMode ? 'w-10 h-10' : 'w-9 h-9'}`} onClick={() => setCurrentView('profile')}>
                  <ImageWithFallback src={user?.imageUrl || (user?.id ? getAvatarForUserId(user.id) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')} alt="Me" className="w-full h-full object-cover" />
               </div>
            </div>
         </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="relative z-10 flex-1 min-h-0 overflow-hidden">
        
        {/* Content View (testMode: 内容区约束在红线范围内) */}
        <div className={`h-full min-h-0 px-6 lg:px-10 pb-4 pt-6 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${
          currentView === 'messages' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'
        }`}>
            <div className={`${testMode ? 'max-w-[1400px] mx-auto' : ''} ${currentView === 'messages' ? 'flex-1 min-h-0 flex flex-col' : ''}`}>
            <AnimatePresence mode="wait">
               {currentView === 'profile' ? (
                 <div key="profile" className="h-full overflow-y-auto"><UserProfileView user={user} appMode={appMode} /></div>
               ) : currentView === 'messages' ? (
                 <div key="messages" className="flex-1 min-h-0 flex flex-col overflow-hidden">
                   <MessagesView onNavigateToExplore={() => setCurrentView('explore')} />
                 </div>
               ) : (
                 <motion.div 
                   key={currentView}
                   initial={{opacity: 0, y: 10}} 
                   animate={{opacity: 1, y: 0}} 
                   exit={{opacity: 0, y: -10}} 
                   transition={{duration: 0.25}}
                   className="h-full overflow-y-auto"
                 >
                   {currentView === 'home' && <DashboardView selectedItem={selectedItem} onOpenDetail={handleOpenDetail} onExplore={() => setCurrentView('explore')} onNavigateToExchangeFeedback={() => { setExploreInitialState({ tab: 'community', communityFilter: 'exchange_feedback' }); setCurrentView('explore'); }} skills={skills} upcomingSessions={upcomingSessions} communityUpdates={communityUpdates} learningStats={learningStats} testMode={testMode} />}
                   {currentView === 'explore' && <ExploreView selectedItem={selectedItem} onOpenDetail={handleOpenDetail} skills={skills} posts={posts} exchangeFeedbackPosts={exchangeFeedbackPosts} communityUpdates={communityUpdates} testMode={testMode} initialTab={exploreInitialState?.tab} initialCommunityFilter={exploreInitialState?.communityFilter} onMounted={() => setExploreInitialState(null)} />}
                   {currentView === 'exchange' && <MyExchangesView onNavigateToExchangeFeedback={() => { setExploreInitialState({ tab: 'community', communityFilter: 'exchange_feedback' }); setCurrentView('explore'); }} />}
                 </motion.div>
               )}
           </AnimatePresence>
            </div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-2xl border border-slate-200/50 p-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 flex justify-around items-center">
            <NavBarItem icon={Compass} label="" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
            <NavBarItem icon={Home} label="" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-300 -mt-8 border-4 border-[#F8FAFC] cursor-pointer" onClick={() => setCurrentView('exchange')}>
               <Zap size={24} fill="currentColor" />
            </div>
            <NavBarItem icon={MessageCircle} label="" active={currentView === 'messages'} onClick={() => setCurrentView('messages')} />
            <NavBarItem icon={User} label="" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
        </nav>
      </main>
      </div>
    </div>
  );
};

export default MainAppLayout;