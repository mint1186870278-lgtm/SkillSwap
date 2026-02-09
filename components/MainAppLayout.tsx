import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, MessageCircle, User, Calendar, Search, Bell, 
  Menu, Filter, MapPin, Star, Heart, Share2, MoreHorizontal,
  Zap, ChevronRight, Clock, Sparkles, Compass, Video, BookOpen,
  LayoutGrid, Image as ImageIcon, Plus, X, Play
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// --- Detail Modal Component (Xiaohongshu Style) ---
const PostDetailModal = ({ item, onClose }: { item: any, onClose: () => void }) => {
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
                      <p className="text-xs text-slate-400 font-medium">Unknown Location</p>
                   </div>
                </div>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-colors">
                   Follow
                </button>
             </div>

             {/* Body: Scrollable Content */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{item.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                   Here is a detailed description of the skill or post. This would typically come from the database. 
                   
                   Imagine this area filled with rich text, emojis, and hashtags just like a Xiaohongshu post! 
                   
                   ✨ Features:
                   - Step by step guide
                   - Tips and tricks
                   - Q&A session
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                   {['#SkillSwap', '#Learning', `#${item.type || item.tag || 'Skill'}`].map(tag => (
                      <span key={tag} className="text-blue-600 text-sm font-bold cursor-pointer hover:underline">{tag}</span>
                   ))}
                </div>
                <div className="text-xs text-slate-400 font-medium pt-2">
                   Posted on {new Date().toLocaleDateString()}
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
                         <Star size={20} /> <span className="text-xs font-bold">Collect</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-700 hover:text-green-500 transition-colors">
                         <MessageCircle size={20} /> <span className="text-xs font-bold">Comment</span>
                      </button>
                   </div>
                   <button className="text-slate-400 hover:text-slate-600">
                      <Share2 size={20} />
                   </button>
                </div>
                
                {/* Comment Input */}
                <div className="relative">
                   <div className="w-8 h-8 rounded-full bg-slate-200 absolute left-1 top-1 overflow-hidden">
                      <ImageWithFallback src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" />
                   </div>
                   <input 
                      type="text" 
                      placeholder="Say something nice..." 
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

// ... (in MainAppLayout)
import SkillDetailView from './views/SkillDetailView';
import UserProfileView from './views/UserProfileView';
import MyExchangesView from './views/ExchangeView';
import MessagesView from './views/MessagesView';

import { ViewType } from '../types';
import { MOCK_SKILLS, UPCOMING_SESSIONS, MOCK_POSTS, COMMUNITY_UPDATES } from '../data/mock';

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
    {active && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full" />}
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
            <span>Online</span>
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
                  <p className="text-[10px] text-slate-400 font-medium truncate">Professional Teacher</p>
               </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-1">
               <div className="flex items-center gap-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-black text-slate-800">{item.rating || '5.0'}</span>
               </div>
               <span className="text-[9px] text-slate-500 font-bold mt-0.5">{item.lessons || 128} lessons</span>
            </div>
         </div>

         {/* Skill Tags - Fixed Height */}
         <div className="flex items-center gap-2 py-1 h-[26px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">Speaks:</span>
            <div className="flex gap-1 overflow-hidden">
               <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600 whitespace-nowrap">{item.speaks || 'English'} <span className="text-slate-400 font-normal">Native</span></span>
               <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600 shrink-0">+2</span>
            </div>
         </div>

         {/* Description - Fixed Height (Force 2 lines space) */}
         <div className="min-h-[2.5rem] h-[2.5rem]">
            <h4 className="font-bold text-slate-700 text-xs line-clamp-1 mb-0.5">{item.title}</h4>
            <p className="text-[10px] leading-relaxed text-slate-500 line-clamp-2">{item.description || "Certified instructor with over 6,000 lessons taught worldwide. I specialize in clear grammar explanations."}</p>
         </div>

         {/* Footer - Fixed Height */}
         <div className="mt-auto pt-3 flex items-center justify-between h-[42px] shrink-0">
            <div className="flex flex-col justify-center">
               <span className="block text-[9px] text-slate-400 font-medium leading-none mb-1">Trial Lesson</span>
               <div className="flex items-baseline gap-1 leading-none">
                 <span className="text-sm font-black text-slate-900">{item.price || 1} Credit</span>
               </div>
            </div>
            <button className="h-full px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center justify-center">
               Book Trial
            </button>
         </div>
      </div>
    </>
  );

  if (isPlaceholder) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm pointer-events-none ${className}`}>
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
      <div className={`bg-white rounded-[1.5rem] overflow-hidden shadow-sm flex flex-col h-full pointer-events-none border border-slate-100 ${className}`}>
        {CardContent}
      </div>
    );
  }

  return (
    <motion.div 
      layoutId={`card-${post.id}`} // Shared layout ID (Ensure IDs are unique globally or prefixed if data sources mix)
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group mb-0 break-inside-avoid border border-slate-100 flex flex-col h-[365px] ${className}`}
    >
      {CardContent}
    </motion.div>
  );
};

// --- Views ---

// 1. HOME VIEW: Personal Dashboard
const DashboardView = ({ onOpenDetail, onExplore, selectedItem }: { onOpenDetail: (item: any) => void, onExplore: () => void, selectedItem: any }) => (
  <div className="h-full pb-20">
      
      {/* Header Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          Hello, Jessica! 👋
        </h1>
        <p className="text-slate-500 font-medium mt-1">You have 2 sessions coming up this week.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Schedule & Tasks */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Sessions */}
            <section>
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-500" /> Your Schedule
                  </h3>
                  <button onClick={onExplore} className="hidden md:flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline">
                     Find more skills <ChevronRight size={16} />
                  </button>
               </div>
               <div className="space-y-4">
                  {UPCOMING_SESSIONS.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
               </div>
            </section>

            {/* Quick Actions / Progress */}
            <section className="grid grid-cols-2 gap-4">
               <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200 group cursor-pointer hover:scale-[1.02] transition-transform">
                  <div className="relative z-10">
                     <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-white">
                        <BookOpen size={20} />
                     </div>
                     <h3 className="font-bold text-lg mb-1">My Learning</h3>
                     <p className="text-indigo-100 text-sm">3 skills in progress</p>
                     <div className="mt-4 w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-white/80 w-[60%]"></div>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
               </div>
               
               <div className="bg-white border border-slate-100 rounded-[2rem] p-6 relative overflow-hidden shadow-sm group cursor-pointer hover:scale-[1.02] transition-transform hover:border-pink-200">
                  <div className="relative z-10">
                     <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center mb-4 text-pink-500">
                        <Heart size={20} fill="currentColor" />
                     </div>
                     <h3 className="font-bold text-slate-800 text-lg mb-1">Saved</h3>
                     <p className="text-slate-400 text-sm">12 skills to try</p>
                  </div>
               </div>
            </section>

            {/* Recommended for You (Grid Layout) */}
            <section>
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-black text-slate-800">Top Picks for You</h3>
                 <button onClick={onExplore} className="text-xs font-bold text-slate-400 hover:text-indigo-600">See all</button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {MOCK_SKILLS.slice(0, 4).map(item => (
                    <div key={item.id} className="relative">
                       {/* Placeholder (Visible if selected) */}
                       {selectedItem?.id === item.id && <SkillCard item={item} isPlaceholder className="absolute inset-0 z-0" />}
                       
                       {/* Animated Card (Hidden by layoutId when active) */}
                       <SkillCard item={item} onClick={() => onOpenDetail(item)} className="relative z-10" />
                    </div>
                  ))}
               </div>
            </section>
         </div>

         {/* Right Column: Community & Stats */}
         <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm mt-[44px]">
                <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2">
                   <Zap size={20} className="fill-yellow-400 text-yellow-400"/> Activity
                </h3>
                <div className="space-y-6 relative">
                   <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                   {COMMUNITY_UPDATES.map(u => (
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

            <div className="bg-[#111] text-white rounded-[2rem] p-6 relative overflow-hidden shadow-xl">
               <div className="relative z-10">
                  <h4 className="font-black text-xl mb-2">Pro Member</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">Unlock unlimited swaps and verify your skills with a Pro badge.</p>
                  <button className="w-full py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-200 transition-colors">
                    Upgrade Now
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

// 2. EXPLORE VIEW: Discovery
const ExploreView = ({ onOpenDetail, selectedItem }: { onOpenDetail: (item: any) => void, selectedItem: any }) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'community'>('skills');

  return (
  <div className="pb-20">
     
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
                       Find Skills
                    </button>
                    <button 
                       onClick={() => setActiveTab('community')}
                       className={`text-2xl font-black transition-colors ${activeTab === 'community' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       Inspiration
                    </button>
                 </div>

                 {/* Row 2: Categories (Below Tabs) */}
                 {activeTab === 'skills' && (
                     <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-linear-fade pt-1">
                         <button className="h-9 px-4 flex items-center justify-center bg-slate-900 text-white rounded-full text-xs font-bold shadow-md shadow-slate-200 shrink-0">
                           All Skills
                         </button>
                         {['Language', 'Fitness', 'Tech', 'Design', 'Discovery'].map(cat => (
                           <button key={cat} className="h-9 px-4 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600 shrink-0 transition-colors">
                             {cat}
                           </button>
                         ))}
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
                     {MOCK_SKILLS.map((item, i) => (
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
                      {MOCK_POSTS.map((post, i) => (
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

         {/* Right: Community Sidebar (Desktop Only) - GRID COLUMN */}
         <div className="hidden lg:block w-80">
             
             {/* STICKY CONTAINER: Keeps all right-side content fixed on scroll */}
             <div className="sticky top-4 flex flex-col">
             
                 {/* 1. ACTION BUTTON - Aligned with "Find Skills" */}
                 <div className={`h-[40px] w-full flex items-center ${activeTab === 'skills' ? 'mb-[60px]' : 'mb-5'}`}>
                     <button className="w-full h-full bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 font-black text-lg shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                        {activeTab === 'skills' ? <Plus size={20} strokeWidth={3} /> : <ImageIcon size={20} strokeWidth={3} />}
                        <span>{activeTab === 'skills' ? 'List a Skill' : 'Share Post'}</span>
                     </button>
                 </div>

                 {/* 2. COMMUNITY UPDATES (Aligned with First Row) */}
                 {/* Adjusted height to match SkillCard approx height (~365px) and margin to align with grid */}
                 <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-5 shadow-sm flex flex-col h-[365px] mb-5">
                     <div className="flex items-center justify-between mb-3 shrink-0">
                       <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                         <Zap size={16} className="fill-yellow-400 text-yellow-400"/> Community
                       </h3>
                       <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">View All</button>
                     </div>
                     
                     {/* Auto-Scrolling List */}
                     <div className="relative flex-1 overflow-hidden group scroll-mask">
                       {/* Styles for animation */}
                       <style>{`
                         @keyframes scroll-vertical {
                           0% { transform: translateY(0); }
                           100% { transform: translateY(-50%); }
                         }
                         .animate-scroll-vertical {
                           animation: scroll-vertical 40s linear infinite;
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
                         {/* Render Twice for Seamless Loop */}
                         {[...COMMUNITY_UPDATES, ...COMMUNITY_UPDATES].map((u, index) => (
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

                 {/* 3 & 4. TRENDING & INVITE (Compact Group) */}
                 <div className={`flex flex-col ${activeTab === 'skills' ? 'gap-2' : 'gap-10'}`}>
                    {/* TRENDING TAGS */}
                    <div className="bg-white/40 border border-white/50 rounded-2xl p-2.5 hover:bg-white/60 transition-colors">
                       <h3 className="font-black text-xs text-slate-800 mb-1.5 flex items-center gap-2">
                         Trending Now
                       </h3>
                       <div className="flex flex-wrap gap-1.5">
                          {['#DigitalArt', '#Sourdough', '#Python', '#Yoga'].map(tag => (
                             <span key={tag} className="px-2 py-0.5 bg-white rounded-md text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-100">
                                {tag}
                             </span>
                          ))}
                       </div>
                    </div>

                    {/* INVITE CARD */}
                    <div className="bg-white/40 border border-white/50 rounded-2xl p-2.5 hover:bg-white/60 transition-colors group shrink-0">
                        <div className="flex items-center justify-between gap-2">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 shrink-0 group-hover:scale-110 transition-transform">
                                  <Share2 size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-black text-slate-800 text-xs">Invite Friends</h4>
                                <p className="text-slate-400 text-[9px] font-medium truncate">Grow our galaxy</p>
                              </div>
                           </div>
                           
                           <button className="px-2 py-1 bg-white text-indigo-600 border border-slate-100 rounded-lg text-[9px] font-bold shadow-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                             Copy
                           </button>
                        </div>
                    </div>
                 </div>

            </div> {/* End Sticky */}
        </div>
     </div>
  </div>
);
};

// --- Layout ---

interface MainAppProps {
  user: any; 
}

const MainAppLayout: React.FC<MainAppProps> = ({ user }) => {
  const [currentView, setCurrentView] = useState<ViewType>('explore');
  const [selectedItem, setSelectedItem] = useState<any>(null); // State for modal (Inspiration/Community)
  const [selectedSkill, setSelectedSkill] = useState<any>(null); // State for full page view (Find Skills)

  const handleOpenDetail = (item: any) => {
    // Determine if it's a Skill (Full Page) or Post (Modal)
    // Skills have 'lessons' property in our mock data, Posts have 'likes'
    if (item.lessons !== undefined || item.price !== undefined) {
       setSelectedSkill(item);
    } else {
       setSelectedItem(item);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent font-sans text-slate-900 overflow-hidden flex flex-col">
      {/* Detail Modal Overlay (Inspiration) */}
      <AnimatePresence>
        {selectedItem && (
          <PostDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
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

      {/* Global background from App.tsx is now visible */}

      {/* --- Top Navigation Bar --- */}
      <header className="relative z-50 shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 lg:px-10 py-3 flex items-center justify-between">
         
         {/* Left: Logo */}
         <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('explore')}>
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-slate-200 transform transition-transform group-hover:rotate-12">S</div>
            <span className="font-black text-xl tracking-tight text-slate-900 hidden sm:block">SkillSwap</span>
         </div>

         {/* Center: Navigation Links (Desktop) */}
         <nav className="hidden md:flex items-center gap-8 relative">
             <TopNavItem icon={Compass} label="Explore" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
             <TopNavItem icon={Home} label="Dashboard" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
             <TopNavItem icon={Calendar} label="Exchanges" active={currentView === 'exchange'} onClick={() => setCurrentView('exchange')} />
             <TopNavItem icon={MessageCircle} label="Messages" active={currentView === 'messages'} onClick={() => setCurrentView('messages')} />
             <TopNavItem icon={User} label="Profile" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
         </nav>

         {/* Right: Search & Profile */}
         <div className="flex items-center gap-4 md:gap-5">
            {/* Search */}
            <div className="hidden lg:flex w-56 items-center gap-2 bg-slate-100/50 hover:bg-slate-100 rounded-full px-4 py-2 text-slate-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all border border-transparent focus-within:border-indigo-200">
                <Search size={16} />
                <input type="text" placeholder="Search skills..." className="bg-transparent border-none outline-none text-xs w-full font-medium" />
            </div>

            <div className="flex items-center gap-3">
               <button className="relative w-9 h-9 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-all">
                  <Bell size={18} />
                  <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
               </button>

               <div className="w-9 h-9 rounded-full border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentView('profile')}>
                  <ImageWithFallback src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Me" className="w-full h-full object-cover" />
               </div>
            </div>
         </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="relative z-10 flex-1 overflow-hidden">
        
        {/* Content View */}
        <div className="h-full px-6 lg:px-10 pb-4 pt-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <AnimatePresence mode="wait">
             <motion.div 
               key={currentView}
               initial={{opacity: 0, y: 10}} 
               animate={{opacity: 1, y: 0}} 
               exit={{opacity: 0, y: -10}} 
               transition={{duration: 0.25}}
               className="h-full"
             >
               {currentView === 'home' && <DashboardView selectedItem={selectedItem} onOpenDetail={handleOpenDetail} onExplore={() => setCurrentView('explore')} />}
               {currentView === 'explore' && <ExploreView selectedItem={selectedItem} onOpenDetail={handleOpenDetail} />}
               {currentView === 'exchange' && <MyExchangesView />}
               {currentView === 'messages' && <MessagesView />}
               {/* Detail view is now handled by overlay */}
               {currentView === 'profile' && <UserProfileView />}
             </motion.div>
           </AnimatePresence>
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
  );
};

export default MainAppLayout;