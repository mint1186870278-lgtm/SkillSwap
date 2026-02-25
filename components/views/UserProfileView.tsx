import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, MapPin, Calendar, Star, Zap, Crown, 
  Wallet, Gift, ShieldCheck, Heart, MessageCircle, Share2,
  MoreHorizontal, Medal, Sparkles, CheckCircle2, Hexagon, Trophy, Flame, ChevronRight, Plus,
  Globe, GraduationCap, Briefcase, User, Quote
} from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { fetchUserPosts, fetchReviews } from '../../lib/api-client';

// -----------------------------------------------------------------------------
// PREMIUM BADGE COMPONENT
// -----------------------------------------------------------------------------
const PremiumBadge = ({ 
  icon: Icon, 
  title, 
  variant = 'gold', // gold, blue, purple, holographic
  earnedDate
}: any) => {
  
  // Variant styles configuration
  const styles = {
    gold: {
      outer: "bg-gradient-to-br from-amber-300 via-amber-100 to-orange-200",
      border: "border-amber-200/40",
      icon: "text-amber-500 drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]",
      glow: "shadow-amber-400/30",
      innerGlow: "bg-amber-400/10"
    },
    blue: {
      outer: "bg-gradient-to-br from-cyan-300 via-blue-100 to-indigo-300",
      border: "border-blue-200/40",
      icon: "text-blue-500 drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]",
      glow: "shadow-blue-400/30",
      innerGlow: "bg-blue-400/10"
    },
    purple: {
      outer: "bg-gradient-to-br from-fuchsia-300 via-purple-100 to-indigo-300",
      border: "border-purple-200/40",
      icon: "text-purple-500 drop-shadow-[0_2px_4px_rgba(168,85,247,0.3)]",
      glow: "shadow-purple-400/30",
      innerGlow: "bg-purple-400/10"
    },
    holographic: {
      outer: "bg-gradient-to-br from-pink-300 via-white to-cyan-300",
      border: "border-white/60",
      icon: "text-slate-700 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
      glow: "shadow-pink-400/30",
      innerGlow: "bg-white/40"
    }
  }[variant] || styles.gold;

  return (
    <div className="group relative flex flex-col items-center">
      
      {/* GLOW EFFECT (Behind) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${styles.glow}`}></div>

      {/* 3D GEMSTONE CONTAINER */}
      <div className="relative w-20 h-20 mb-3 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105 perspective-1000">
        
        {/* The Gemstone Body */}
        <div className={`absolute inset-0 rounded-[1.6rem] rotate-45 shadow-xl transition-all duration-500 group-hover:shadow-2xl ${styles.outer} p-[1px]`}>
           
           {/* Glassy Surface */}
           <div className="w-full h-full bg-white/80 backdrop-blur-xl rounded-[1.55rem] flex items-center justify-center relative overflow-hidden border border-white/60">
              
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full blur-xl opacity-60 ${styles.innerGlow}`}></div>
              <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-20 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent opacity-80 pointer-events-none z-10"></div>

              {/* Icon Container */}
              <div className={`relative z-20 -rotate-45 transform transition-transform group-hover:rotate-0 duration-500 ease-out scale-110`}>
                 <Icon size={28} className={`${styles.icon} transition-all duration-500 group-hover:scale-110`} strokeWidth={2} />
              </div>

              <div className="absolute bottom-1 right-1 w-full h-full rounded-[1.55rem] shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.05)] pointer-events-none z-10"></div>
           </div>
        </div>
      </div>

      {/* TEXT INFO */}
      <div className="text-center relative z-10 mt-1">
        <h4 className="font-black text-slate-800 text-xs leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{title}</h4>
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">{earnedDate}</span>
      </div>
    </div>
  );
};
// -----------------------------------------------------------------------------

const UserProfileView = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'reviews'>('posts');
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchUserPosts().then(setUserPosts).catch(console.error);
    fetchReviews().then(setReviews).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto pb-20">
        
        {/* 1. HEADER SECTION - RESTORED BALANCE */}
        <div className="relative mb-6">
           {/* Cover Image - Medium height */}
           <div className="h-36 rounded-t-[2.5rem] bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 opacity-30 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
           </div>
           
           <div className="bg-white rounded-[2.5rem] px-8 py-6 shadow-sm border border-slate-100 -mt-12 relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                 {/* Avatar Group - Medium Size */}
                 <div className="relative shrink-0 -mt-2 md:-mt-10">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[5px] border-white shadow-lg overflow-hidden bg-white">
                       <ImageWithFallback src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt="Me" className="w-full h-full object-cover" />
                    </div>
                 </div>

                 {/* User Info */}
                 <div className="flex-1 w-full text-center md:text-left pt-2">
                    <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-4">
                       
                       {/* Identity */}
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                             <h1 className="text-2xl font-black text-slate-900 truncate">Jessica Parker</h1>
                             <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-yellow-900 border border-yellow-200/50 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
                                <Crown size={12} strokeWidth={3} /> Pro
                             </span>
                          </div>
                          <p className="text-slate-500 font-medium text-xs mb-3 flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1">
                             <span className="text-indigo-600 font-bold">@jess_creates</span>
                             <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                             <span>Digital Designer & Potter</span>
                             <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                             <span className="flex items-center gap-1"><MapPin size={12}/> San Francisco, CA</span>
                          </p>
                          
                          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto md:mx-0 line-clamp-2">
                             Digital designer by day, pottery enthusiast by night. I love teaching Figma tips and looking to learn how to bake the perfect sourdough bread! 🍞
                          </p>
                       </div>

                       {/* Stats Cards - Restored visibility */}
                       <div className="flex gap-3 shrink-0 mt-4 md:mt-0">
                          <div className="flex flex-col items-center justify-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 min-w-[80px] hover:bg-slate-100 transition-colors group">
                             <span className="block text-xl font-black text-slate-800 leading-none mb-1 group-hover:text-indigo-600 transition-colors">12</span>
                             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Exchanges</span>
                          </div>
                          <div className="flex flex-col items-center justify-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 min-w-[80px] hover:bg-slate-100 transition-colors group">
                             <span className="block text-xl font-black text-slate-800 leading-none mb-1 group-hover:text-indigo-600 transition-colors">4.9</span>
                             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Rating</span>
                          </div>
                          <div className="flex flex-col items-center justify-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 min-w-[80px] hover:bg-slate-100 transition-colors group">
                             <span className="block text-xl font-black text-slate-800 leading-none mb-1 group-hover:text-indigo-600 transition-colors">48h</span>
                             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Learned</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. MAIN GRID LAYOUT - ADJUSTED GAPS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
           
           {/* LEFT COLUMN (Content) - Spans 8 cols */}
           <div className="lg:col-span-8 flex flex-col gap-4"> {/* Reduced gap from 8 to 4 */}
              
              {/* BADGES WALL (Loop 2) */}
              <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                            <Trophy size={20} className="text-amber-500 fill-amber-500/20" /> 
                            Achievement Wall
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Collect badges to unlock exclusive community perks</p>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
                       View All (12)
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                    <PremiumBadge 
                       icon={Star} 
                       title="Super Teacher" 
                       variant="gold"
                       earnedDate="Jan 2024"
                    />
                    <PremiumBadge 
                       icon={CheckCircle2} 
                       title="Verified Pro" 
                       variant="blue"
                       earnedDate="Feb 2024"
                    />
                    <PremiumBadge 
                       icon={Flame} 
                       title="Week Streak" 
                       variant="purple"
                       earnedDate="3 Days"
                    />
                    <PremiumBadge 
                       icon={Sparkles} 
                       title="Early Adopter" 
                       variant="holographic"
                       earnedDate="Genesis"
                    />
                 </div>

                 {/* Progress Bar */}
                 <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
                    <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-wide">
                        <span className="text-slate-500">Next: Master Mentor Badge</span>
                        <span className="text-indigo-600">8/10 Sessions</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[80%] rounded-full shadow-lg shadow-indigo-200"></div>
                    </div>
                 </div>
              </section>

              {/* TABS & FEED (Loop 3) */}
              <section>
                 <div className="bg-slate-100/50 p-1.5 rounded-2xl inline-flex gap-1 mb-5">
                    {['Posts', 'About', 'Reviews'].map((tab) => (
                       <button 
                          key={tab}
                          onClick={() => setActiveTab(tab.toLowerCase() as any)}
                          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                             activeTab === tab.toLowerCase() 
                             ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' 
                             : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                          }`}
                       >
                          {tab}
                       </button>
                    ))}
                 </div>

                 {activeTab === 'posts' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {userPosts.map(post => (
                          <div key={post.id} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                             {/* Image Area */}
                             {post.image ? (
                                <div className="rounded-xl overflow-hidden mb-3 aspect-[4/3] bg-slate-100 relative">
                                   <ImageWithFallback src={post.image} alt="Post content" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                             ) : (
                                <div className="rounded-xl overflow-hidden mb-3 aspect-[4/3] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative p-6">
                                   <p className="text-slate-500 text-xs text-center font-medium italic">"{post.content.substring(0, 50)}..."</p>
                                </div>
                             )}
                             
                             {/* Content */}
                             <p className="text-slate-800 font-bold text-sm leading-snug line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors h-10">
                                {post.content}
                             </p>

                             {/* Footer */}
                             <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-50">
                                <span className="font-medium">{post.time}</span>
                                <div className="flex items-center gap-3">
                                   <div className="flex items-center gap-1 font-bold group-hover:text-rose-500 transition-colors">
                                      <Heart size={14} /> {post.likes}
                                   </div>
                                   <div className="flex items-center gap-1 font-bold group-hover:text-indigo-600 transition-colors">
                                      <MessageCircle size={14} /> {post.comments}
                                   </div>
                                </div>
                             </div>
                          </div>
                       ))}
                       
                       {/* Add New Placeholder */}
                       <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center aspect-[4/3] sm:aspect-auto text-slate-400 cursor-pointer hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all min-h-[240px]">
                          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                             <Plus size={24} /> 
                          </div>
                          <span className="font-bold text-sm">Create New Post</span>
                       </div>
                    </div>
                 )}

                 {activeTab === 'about' && (
                    <div className="space-y-6">
                       {/* 1. Bio Card */}
                       <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                          <h3 className="font-black text-lg text-slate-900 mb-4 flex items-center gap-2">
                             <User size={20} className="text-indigo-500" /> My Story
                          </h3>
                          <p className="text-slate-600 leading-relaxed mb-6">
                             Hi there! I'm Jessica, a Product Designer based in San Francisco with a passion for pottery and baking. 
                             I've been designing digital products for over 5 years, working with startups to build intuitive and beautiful interfaces.
                          </p>
                          <p className="text-slate-600 leading-relaxed">
                             When I'm not pushing pixels, you can find me at the local pottery studio throwing clay or in my kitchen experimenting with new sourdough recipes.
                             I joined SkillSwap to share my design knowledge and learn from other talented creators!
                          </p>
                       </div>

                       {/* 2. Info Grid */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Languages */}
                          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Globe size={18} className="text-blue-500" /> Languages
                             </h4>
                             <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                   <span className="text-slate-600 font-medium text-sm">English</span>
                                   <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded">Native</span>
                                </div>
                                <div className="flex items-center justify-between">
                                   <span className="text-slate-600 font-medium text-sm">Spanish</span>
                                   <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded">B1 Intermediate</span>
                                </div>
                             </div>
                          </div>

                          {/* Work & Edu */}
                          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Briefcase size={18} className="text-purple-500" /> Experience
                             </h4>
                             <div className="space-y-4">
                                <div className="flex gap-3">
                                   <div className="mt-1 w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                                      <Briefcase size={14} />
                                   </div>
                                   <div>
                                      <div className="font-bold text-slate-800 text-sm">Senior Product Designer</div>
                                      <div className="text-xs text-slate-500">TechFlow Inc. • 2021 - Present</div>
                                   </div>
                                </div>
                                <div className="flex gap-3">
                                   <div className="mt-1 w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                                      <GraduationCap size={14} />
                                   </div>
                                   <div>
                                      <div className="font-bold text-slate-800 text-sm">BFA in Interaction Design</div>
                                      <div className="text-xs text-slate-500">California College of the Arts</div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* 3. Interests Cloud */}
                       <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                             <Heart size={18} className="text-rose-500" /> Things I Love
                          </h4>
                          <div className="flex flex-wrap gap-2">
                             {['Pottery 🏺', 'Sourdough 🍞', 'Figma 🎨', 'Hiking 🏔️', 'Indie Rock 🎸', 'Sci-Fi Books 📚', 'Yoga 🧘‍♀️', 'Coffee ☕', 'Travel ✈️', 'Photography 📸'].map(tag => (
                                <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors cursor-default border border-slate-100">
                                   {tag}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'reviews' && (
                    <div className="space-y-6">
                       {/* Summary Header */}
                       <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2rem] p-8 text-white shadow-lg shadow-indigo-200">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                             <div className="text-center md:text-left">
                                <div className="text-5xl font-black mb-1">4.9</div>
                                <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                                   {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <p className="text-indigo-100 font-medium text-sm">Based on 150 verified reviews</p>
                             </div>
                             
                             <div className="h-16 w-[1px] bg-white/20 hidden md:block"></div>
                             
                             <div className="flex flex-wrap justify-center gap-2 max-w-md">
                                {['Patient (42)', 'Fun (38)', 'Expert (35)', 'Great Listener (24)', 'Prepared (18)'].map(tag => (
                                   <span key={tag} className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                                      {tag}
                                   </span>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Review List */}
                       <div className="grid grid-cols-1 gap-4">
                          {reviews.map(review => (
                             <div key={review.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100">
                                         <ImageWithFallback src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                         <h4 className="font-bold text-slate-900 text-sm">{review.user}</h4>
                                         <p className="text-xs text-slate-400 font-medium">{review.date}</p>
                                      </div>
                                   </div>
                                   <div className="flex gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                         <Star key={i} size={14} className={`${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} />
                                      ))}
                                   </div>
                                </div>
                                
                                <div className="mb-4 relative pl-4">
                                   <div className="absolute left-0 top-0 text-slate-200">
                                      <Quote size={20} className="transform rotate-180" />
                                   </div>
                                   <p className="text-slate-600 text-sm leading-relaxed italic relative z-10">
                                      "{review.text}"
                                   </p>
                                </div>

                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Session:</span>
                                   <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{review.class}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                       
                       <button className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors">
                          Load More Reviews
                       </button>
                    </div>
                 )}
              </section>
           </div>

           {/* RIGHT COLUMN (Sidebar) - Spans 4 cols */}
           <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6">
              
              {/* 1. TRUST SCORE CARD */}
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="font-black text-slate-900 text-lg">Trust Score</h3>
                       <p className="text-xs text-slate-400 font-medium mt-1">Based on verified reviews</p>
                    </div>
                    <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                       <ShieldCheck size={18} />
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-5">
                    {/* Circle Chart */}
                    <div className="relative w-20 h-20 shrink-0">
                       <svg className="w-full h-full transform -rotate-90">
                          <defs>
                            <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                          <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                          <circle cx="40" cy="40" r="32" stroke="url(#trustGradient)" strokeWidth="6" fill="none" strokeDasharray="201" strokeDashoffset="80.4" strokeLinecap="round" />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900">
                          <span className="text-2xl font-black">60</span>
                       </div>
                    </div>
                    
                    <div className="flex-1">
                       <div className="text-xs font-medium text-slate-600 leading-snug mb-2">
                          You are in the <strong className="text-indigo-600">top 40%</strong> of trusted members!
                       </div>
                       <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 underline">View Report</button>
                    </div>
                 </div>
              </div>

              {/* 2. WALLET CARD */}
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                 {/* Abstract Shapes */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-40 translate-x-10 -translate-y-10"></div>
                 <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500 rounded-full blur-[60px] opacity-30 -translate-x-10 translate-y-10"></div>
                 
                 <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                       <Wallet size={16} /> Balance
                    </div>
                    <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide hover:bg-white/20 transition-colors">
                       Top Up
                    </button>
                 </div>
                 
                 <div className="relative z-10 mb-4">
                    <div className="text-4xl font-black flex items-baseline gap-2">
                       24 <span className="text-sm font-bold text-slate-400">Credits</span>
                    </div>
                 </div>

                 <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                     <span className="text-slate-400">Expires in 30 days</span>
                     <button className="flex items-center gap-1 font-bold text-indigo-300 hover:text-white transition-colors">
                        View History <ChevronRight size={12}/>
                     </button>
                 </div>
              </div>

              {/* 3. INVITE CARD */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
                 <div className="absolute -right-6 -top-6 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 group-hover:rotate-12 transform">
                    <Gift size={120} />
                 </div>
                 
                 <div className="relative z-10 mb-6">
                    <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide mb-3 border border-white/20 shadow-sm">
                       Limited Time
                    </div>
                    <h3 className="font-black text-xl mb-2">Get 5 Free Credits</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                       Invite your friends and earn rewards for each signup!
                    </p>
                 </div>
                 
                 <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/10 relative z-10 flex items-center justify-center gap-2">
                    <Share2 size={16} /> Invite Friends
                 </button>
              </div>

           </div>
        </div>
      </div>
  );
};

export default UserProfileView;