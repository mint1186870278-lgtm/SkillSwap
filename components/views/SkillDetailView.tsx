import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MessageCircle, MapPin, Star, Shield, 
  ChevronLeft, Video, Play, Globe, CheckCircle2, Heart,
  Languages, ChevronRight, Zap, Bot, ImageIcon, Trophy
} from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { fetchSimilarExperts, fetchUserNFTs, fetchNFTDetail } from '../../lib/api-client';
import { useLanguage } from '../../contexts/LanguageContext';
import { NFTDetailModal } from '../NFTDetailModal';

interface SkillDetailProps {
  onBack: () => void;
  item: any;
}

const SkillDetailView: React.FC<SkillDetailProps> = ({ onBack, item }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'about' | 'lessons'>('about');
  const [similarExperts, setSimilarExperts] = useState<any[]>([]);
  const [providerNfts, setProviderNfts] = useState<any[]>([]);
  const [showProviderNftModal, setShowProviderNftModal] = useState(false);
  const [selectedNftId, setSelectedNftId] = useState<number | null>(null);
  const [nftDetail, setNftDetail] = useState<any>(null);

  const providerIdMap: Record<string, string> = { 'Elena Rodriguez': 'u_elena', 'David Kim': 'u_david', 'Sarah Jenks': 'u_sarah' };
  const user = item?.user || 'Elena Rodriguez';
  const providerId = item?.providerId || providerIdMap[user] || null;

  useEffect(() => {
    fetchSimilarExperts().then(setSimilarExperts).catch(console.error);
  }, []);

  useEffect(() => {
    if (providerId) {
      fetchUserNFTs(providerId).then(setProviderNfts).catch(() => setProviderNfts([]));
    }
  }, [providerId]);

  useEffect(() => {
    if (selectedNftId) {
      fetchNFTDetail(selectedNftId).then(setNftDetail).catch(() => setNftDetail(null));
    } else {
      setNftDetail(null);
    }
  }, [selectedNftId]);

  // Fallbacks if item is missing properties (for safety)
  const avatar = item?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';
  const image = item?.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
  const title = item?.title || 'Conversational Spanish & Culture';
  const rating = item?.rating || 4.9;
  const lessons = item?.lessons || 843;
  const price = item?.price || 1;
  const speaks = item?.speaks || 'Spanish';
  const description = item?.description || (language === 'zh' ? "你好！我是母语者，热爱分享语言与文化。有 5 年+ 技能互换经验，专注实战会话。" : "Hola! I'm a native speaker passionate about sharing my language and culture. 5+ years of skill swap experience, focused on practical conversation.");

  const getLessonContent = (type: string, speaks: string) => {
    const isZh = language === 'zh';
    
    switch(type) {
      case 'Fitness':
      case '健身':
        return [
          { title: isZh ? '瑜伽入门' : 'Intro to Yoga', subtitle: isZh ? '适合初学者' : 'Beginner Friendly', badge: isZh ? '1 积分' : '1 Credit' },
          { title: isZh ? '流瑜伽' : 'Vinyasa Flow', subtitle: isZh ? '中级' : 'Intermediate', badge: isZh ? '2 积分' : '2 Credits', details: isZh ? '呼吸与体式' : 'Breath & Posture' }
        ];
      case 'Tech':
      case '技术':
        return [
          { title: isZh ? '代码审查' : 'Code Review', subtitle: 'React & TS', badge: isZh ? '1 积分' : '1 Credit' },
          { title: isZh ? '项目规划' : 'Project Planning', subtitle: isZh ? '架构' : 'Architecture', badge: isZh ? '2 积分' : '2 Credits', details: isZh ? '系统设计' : 'System Design' }
        ];
      case 'Cooking':
      case '烹饪':
        return [
          { title: isZh ? '刀工技巧' : 'Knife Skills', subtitle: isZh ? '基础' : 'Basics', badge: isZh ? '1 积分' : '1 Credit' },
          { title: isZh ? '完整备餐' : 'Full Meal Prep', subtitle: isZh ? '高级' : 'Advanced', badge: isZh ? '2 积分' : '2 Credits', details: isZh ? '摆盘与时间' : 'Plating & Timing' }
        ];
      case 'Art':
      case '艺术':
        return [
          { title: isZh ? '素描 101' : 'Sketching 101', subtitle: isZh ? '铅笔与炭笔' : 'Pencil & Charcoal', badge: isZh ? '1 积分' : '1 Credit' },
          { title: isZh ? '色彩理论' : 'Color Theory', subtitle: isZh ? '水彩' : 'Watercolor', badge: isZh ? '2 积分' : '2 Credits', details: isZh ? '构图' : 'Composition' }
        ];
      default: // Language
        return [
          { title: isZh ? '试听课' : 'Trial Lesson', subtitle: isZh ? '150 已完成' : '150 Completed', badge: isZh ? '1 积分' : '1 Credit' },
          { title: isZh ? `${speaks} 会话` : `${speaks} Conversation`, subtitle: 'A2 - C1', badge: isZh ? '2 积分' : '2 Credits', details: isZh ? '口语' : 'Speaking' }
        ];
    }
  };

  const lessonContent = getLessonContent(item?.type, speaks);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Top Navigation Bar (Within View) */}
      <div className="flex items-center gap-4 px-6 lg:px-10 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 shrink-0 z-20">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
          <ChevronLeft size={18} /> {t('skill_detail.back')}
        </button>
        <div className="h-4 w-[1px] bg-slate-200"></div>
        <span className="font-bold text-slate-800">{t('skill_detail.teacher_profile')}</span>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="w-full px-6 lg:px-10 py-8">
          
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start mb-12">
            
            {/* LEFT COLUMN: Main Profile Info */}
            <div className="space-y-6">
              
              {/* 1. Header Section */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6">
                    <button className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-colors">
                       <Heart size={24} />
                    </button>
                 </div>

                 <div className="flex gap-6">
                    <div className="relative shrink-0">
                       <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                          <ImageWithFallback src={avatar} alt={user} className="w-full h-full object-cover" />
                       </div>
                       <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-lg">
                          🇪🇸
                       </div>
                    </div>
                    
                    <div className="flex-1 pt-1">
                       <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-2xl font-black text-slate-900">{user}</h1>
                          <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded tracking-wider">PLUS+</span>
                          <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                             <CheckCircle2 size={12} /> Verified
                          </span>
                       </div>
                       
                       <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-600 mb-4">
                          <div className="flex items-center gap-2">
                             <span className="text-slate-400">{t('skill_detail.teaches')}</span>
                             <span className="font-bold text-slate-800">{speaks}</span>
                             <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">{t('skill_card.native')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-slate-400">{t('skill_detail.speaks')}</span>
                             <div className="flex items-center gap-1">
                                <span className="font-medium">English</span>
                                <div className="flex gap-[1px] h-3 items-end"><div className="w-1 h-2 bg-green-400 rounded-sm"></div><div className="w-1 h-3 bg-green-400 rounded-sm"></div><div className="w-1 h-3 bg-green-400 rounded-sm"></div><div className="w-1 h-3 bg-slate-200 rounded-sm"></div></div>
                             </div>
                          </div>
                       </div>

                       <h2 className="font-bold text-slate-700 text-lg">{title}</h2>
                    </div>
                 </div>

                 {/* Stats Row */}
                 <div className="mt-8 grid grid-cols-4 divide-x divide-slate-100 border-t border-slate-100 pt-6">
                    <div className="text-center px-2">
                       <div className="flex items-center justify-center gap-1 font-black text-slate-900 text-lg">
                          <Star size={18} className="fill-yellow-400 text-yellow-400" /> {rating}
                       </div>
                       <div className="text-xs text-slate-400 font-medium mt-1">{t('profile.rating')}</div>
                    </div>
                    <div className="text-center px-2">
                       <div className="font-black text-slate-900 text-lg">843</div>
                       <div className="text-xs text-slate-400 font-medium mt-1">{t('skill_detail.students')}</div>
                    </div>
                    <div className="text-center px-2">
                       <div className="font-black text-slate-900 text-lg">{lessons}</div>
                       <div className="text-xs text-slate-400 font-medium mt-1">{t('skill_detail.lessons')}</div>
                    </div>
                    <div className="text-center px-2">
                       <div className="font-black text-slate-900 text-lg">99%</div>
                       <div className="text-xs text-slate-400 font-medium mt-1">{t('skill_detail.attendance')}</div>
                    </div>
                 </div>
              </div>

              {/* 2. Tabs Navigation */}
              <div className="flex items-center gap-8 border-b border-slate-200">
                 {[
                    { id: 'about', label: t('skill_detail.about_me') },
                    { id: 'lessons', label: t('skill_detail.swap_ways') }
                 ].map((tab) => (
                    <button 
                       key={tab.id}
                       type="button"
                       onClick={() => setActiveTab(tab.id as any)}
                       className={`pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer select-none ${activeTab === tab.id ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 hover:text-slate-800 border-transparent hover:border-slate-300'}`}
                    >
                       {tab.label}
                    </button>
                 ))}
              </div>

              {/* 3. About Section */}
              {activeTab === 'about' && (
              <>
              <div className="space-y-6">
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} />
                    <span>Living in <strong className="text-slate-700">Madrid, Spain</strong> (14:20 UTC+02:00)</span>
                 </div>

                 <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-bold text-slate-400 mr-2 py-1">{t('skill_detail.interests')}</span>
                    {['Travel', 'Cooking', 'Music', 'History', 'Movies'].map(tag => (
                       <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full hover:bg-slate-200 cursor-default transition-colors">
                          {tag}
                       </span>
                    ))}
                 </div>

                 <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed">
                    <p>
                       {description}
                    </p>
                    <p>
                       My lessons focus on conversation and building confidence. We'll discuss real-life topics, culture, and current events. I believe learning a language should be fun and immersive!
                    </p>
                    <button className="text-indigo-600 font-bold hover:underline">{t('skill_detail.read_more')}</button>
                 </div>
              </div>
              
              {/* 交换互评 - Mutual reviews between exchange partners */}
              <div>
                 <h3 className="font-black text-2xl text-slate-800 mb-6">150 {t('skill_detail.mutual_reviews')}</h3>
                 <div className="flex flex-wrap gap-3 mb-8">
                    {['Patient · 3', 'Fun lessons · 5', 'Great accent · 4', 'Beginner friendly · 9'].map(tag => (
                       <span key={tag} className="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-400 cursor-pointer transition-colors bg-white">
                          {tag}
                       </span>
                    ))}
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 互评卡片 1: Mike ⇄ Elena */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 relative group hover:shadow-md transition-shadow">
                       <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl">{language === 'zh' ? '优选精选' : "Editor's Pick"}</div>
                       <div className="flex items-center gap-2 mb-4">
                          <div className="flex -space-x-2">
                             <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                <ImageWithFallback src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Mike" className="w-full h-full object-cover" />
                             </div>
                             <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                <ImageWithFallback src={avatar} alt={user} className="w-full h-full object-cover" />
                             </div>
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-800 text-sm">Mike {language === 'zh' ? '⇄' : '⇄'} {user.split(' ')[0]}</h4>
                             <p className="text-xs text-slate-500">{language === 'zh' ? 'Figma × 西班牙语' : 'Figma × Spanish'}</p>
                          </div>
                       </div>
                       <div className="space-y-3">
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mike {t('skill_detail.review_from')} {user.split(' ')[0]}</p>
                             <p className="text-sm text-slate-600 leading-relaxed">{user.split(' ')[0]} is amazing! I learned so much in just a few sessions. She makes it simple and fun.</p>
                          </div>
                          <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100">
                             <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">{user.split(' ')[0]} {t('skill_detail.review_from')} Mike</p>
                             <p className="text-sm text-slate-600 leading-relaxed">{language === 'zh' ? 'Mike 把 Figma 自动布局讲得很清楚，帮我省了太多时间！' : 'Mike explained Figma auto-layout so clearly—saved me tons of time!'}</p>
                          </div>
                       </div>
                       <span className="text-xs text-slate-400 font-medium mt-3 block">Jan 28, 2026</span>
                    </div>
                    {/* 互评卡片 2: Sarah ⇄ Elena */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 relative group hover:shadow-md transition-shadow">
                       <div className="flex items-center gap-2 mb-4">
                          <div className="flex -space-x-2">
                             <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                <ImageWithFallback src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Sarah" className="w-full h-full object-cover" />
                             </div>
                             <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                <ImageWithFallback src={avatar} alt={user} className="w-full h-full object-cover" />
                             </div>
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-800 text-sm">Sarah {language === 'zh' ? '⇄' : '⇄'} {user.split(' ')[0]}</h4>
                             <p className="text-xs text-slate-500">{language === 'zh' ? '摄影 × 西班牙语' : 'Photography × Spanish'}</p>
                          </div>
                       </div>
                       <div className="space-y-3">
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sarah {t('skill_detail.review_from')} {user.split(' ')[0]}</p>
                             <p className="text-sm text-slate-600 leading-relaxed">{language === 'zh' ? `会话练习很实用，${user.split(' ')[0]} 很耐心。` : `Great conversation practice. ${user.split(' ')[0]} is very patient and corrects my mistakes gently.`}</p>
                          </div>
                          <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100">
                             <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">{user.split(' ')[0]} {t('skill_detail.review_from')} Sarah</p>
                             <p className="text-sm text-slate-600 leading-relaxed">{language === 'zh' ? 'Sarah 的构图技巧分享很干货，期待下次交换！' : "Sarah's composition tips were super practical. Can't wait for next swap!"}</p>
                          </div>
                       </div>
                       <span className="text-xs text-slate-400 font-medium mt-3 block">Jan 31, 2026</span>
                    </div>
                 </div>
              </div>
              </>
              )}

              {/* 4. 交换方式 - 技能交换导向 */}
              {activeTab === 'lessons' && (
              <>
              {/* TA 擅长 / TA 想学 - 强调互相交换 */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 space-y-4">
                    <div>
                       <h3 className="font-bold text-slate-500 text-xs uppercase mb-2">{t('skill_detail.they_offer')}</h3>
                       <p className="font-bold text-slate-800">{title}</p>
                       <p className="text-sm text-slate-500 mt-1">{description}</p>
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-500 text-xs uppercase mb-2">{t('skill_detail.they_want_to_learn')}</h3>
                       <div className="flex flex-wrap gap-2">
                          {(language === 'zh' ? ['中文', 'Figma', '产品思维'] : ['Mandarin', 'Figma', 'Product thinking']).map(s => (
                             <span key={s} className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-100">{s}</span>
                          ))}
                       </div>
                       <p className="text-xs text-slate-400 mt-2">{language === 'zh' ? '用你擅长的技能来交换吧' : 'Offer your skills in exchange'}</p>
                    </div>
                 </div>
              </div>

              {/* 可交换形式 - 非约课，是交换形式 */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="font-black text-lg text-slate-800">{t('skill_detail.exchange_formats')}</h3>
                 </div>
                 <div className="divide-y divide-slate-100">
                    <div className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group cursor-pointer">
                       <div>
                          <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors">{lessonContent[0].title}</h4>
                          <p className="text-sm text-slate-400 italic">{lessonContent[0].subtitle}</p>
                       </div>
                       <div className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl font-black text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          {lessonContent[0].badge}
                       </div>
                    </div>
                    <div className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group cursor-pointer">
                       <div>
                          <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors">{lessonContent[1].title}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                             <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded text-xs">{lessonContent[1].subtitle}</span>
                             {lessonContent[1].details && (
                                <>
                                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                   <span>{lessonContent[1].details}</span>
                                </>
                             )}
                             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                             <span className="italic text-slate-400">Popular</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl font-black text-sm group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all shadow-sm">
                             {lessonContent[1].badge}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 font-medium">{t('skill_detail.package_off')} <span className="text-green-600">10% OFF</span></div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* 可用时间 - 约交换时间 */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                 <h3 className="font-black text-lg text-slate-800 mb-6">{t('skill_detail.availability')}</h3>
                 <div className="mb-4 flex items-center gap-2 text-sm">
                    <span className="text-slate-500">{t('skill_detail.available')}</span>
                    <span className="text-teal-600 font-bold">18:00 {language === 'zh' ? '今天' : 'Today'}</span>
                 </div>
                 
                 {/* Mock Calendar Grid */}
                 <div className="w-full overflow-x-auto pb-2">
                    <div className="min-w-[500px]">
                       <div className="grid grid-cols-8 gap-1 mb-2 text-center">
                          <div className="text-xs font-bold text-slate-400"></div>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                             <div key={day} className="text-xs font-bold text-slate-600">
                                {language === 'zh' ? ['一','二','三','四','五','六','日'][i] : day} <br/> <span className="text-slate-400 font-normal">{9 + i}</span>
                             </div>
                          ))}
                       </div>
                       {[
                          '08 - 12', '12 - 16', '16 - 20', '20 - 24'
                       ].map((time, rowIdx) => (
                          <div key={time} className="grid grid-cols-8 gap-1 h-8 mb-1">
                             <div className="text-[10px] font-medium text-slate-400 flex items-center justify-end pr-2">{time}</div>
                             {[...Array(7)].map((_, colIdx) => {
                                // Random availability generation for visual mock
                                const isAvailable = (rowIdx % 2 === 0 && colIdx % 2 !== 0) || (colIdx === 3);
                                return (
                                   <div 
                                      key={colIdx} 
                                      className={`rounded-md ${isAvailable ? 'bg-green-400/80 cursor-pointer hover:bg-green-500' : 'bg-slate-50 border border-slate-100'}`}
                                   ></div>
                                );
                             })}
                          </div>
                       ))}
                    </div>
                 </div>
                 <button className="w-full mt-6 py-3 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                    {t('skill_detail.view_schedule')}
                 </button>
              </div>
              </>
              )}

            </div>

            {/* RIGHT COLUMN: Sticky Booking Card */}
            <div className="hidden xl:block sticky top-6 space-y-4">
               
               {/* AI 可信度评分 Card */}
               <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                     <Bot size={18} className="text-indigo-600" />
                     <h4 className="font-black text-slate-800 text-sm">{t('skill_detail.ai_credibility')}</h4>
                  </div>
                  <div className="text-3xl font-black text-indigo-600 mb-1">92<span className="text-lg font-bold text-slate-400">/100</span></div>
                  <p className="text-xs text-slate-600 mb-2">{t('skill_detail.ai_credibility_desc')}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{t('skill_detail.ai_credibility_source')}</p>
               </div>

               {/* TA 的交换 NFT - 展示最厉害的两个，其余点开查看 */}
               {providerId && (
                  <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-4">
                     <div className="flex items-center gap-2 mb-3">
                        <ImageIcon size={18} className="text-purple-600" />
                        <h4 className="font-black text-slate-800 text-sm">{t('skill_detail.view_their_nfts')}</h4>
                     </div>
                     {providerNfts.length === 0 ? (
                        <p className="text-slate-500 text-xs py-4 text-center">{language === 'zh' ? '暂无 NFT' : 'No NFTs yet'}</p>
                     ) : (
                        <>
                           <div className="space-y-2 mb-3">
                              {[...providerNfts]
                                 .sort((a, b) => ((b.contributionMe || 0) + (b.contributionThem || 0)) - ((a.contributionMe || 0) + (a.contributionThem || 0)))
                                 .slice(0, 2)
                                 .map((nft, i) => {
                                    const gradients = ['from-amber-400/20 via-orange-100/50 to-rose-200/30', 'from-emerald-400/20 via-teal-100/50 to-cyan-200/30'];
                                    const borders = ['border-amber-200/60', 'border-emerald-200/60'];
                                    const accents = ['text-amber-600', 'text-emerald-600'];
                                    const g = gradients[i % 2]; const b = borders[i % 2]; const a = accents[i % 2];
                                    return (
                                       <div
                                          key={nft.id}
                                          onClick={() => setSelectedNftId(nft.id)}
                                          className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${g} border ${b} p-3 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group`}
                                       >
                                          <div className="flex items-center gap-2.5">
                                             <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/80 shadow-sm shrink-0">
                                                <ImageWithFallback src={nft.partnerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'} alt={nft.partner} className="w-full h-full object-cover" />
                                             </div>
                                             <div className="min-w-0 flex-1">
                                                <p className="text-xs font-black text-slate-800 line-clamp-1">{nft.title}</p>
                                                <p className="text-[10px] font-bold text-slate-500">{nft.partner}</p>
                                             </div>
                                             <Trophy size={16} className={`shrink-0 ${a} opacity-80`} />
                                          </div>
                                       </div>
                                    );
                                 })}
                           </div>
                           <button
                              onClick={() => setShowProviderNftModal(true)}
                              className="w-full py-2 text-xs font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50/50 rounded-lg transition-colors flex items-center justify-center gap-1"
                           >
                              {providerNfts.length > 2 ? `${t('skill_detail.view_all')} (${providerNfts.length})` : t('skill_detail.view_all')} <ChevronRight size={14} />
                           </button>
                        </>
                     )}
                  </div>
               )}

               {/* Video Card (试听) */}
               <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                  <div className="relative h-44 bg-slate-900 group cursor-pointer">
                     <ImageWithFallback src={image} alt="Video Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                           <Play size={24} className="fill-white text-white ml-1" />
                        </div>
                     </div>
                  </div>

                  <div className="p-4">
                     <div className="flex justify-between items-baseline mb-4">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                           {t('skill_card.trial')} <span className="text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5"><Languages size={12}/></span>
                        </h3>
                        <span className="text-2xl font-black text-slate-900">{price} {t('skill_card.credit')}</span>
                     </div>
                     
                     <div className="space-y-2">
                        <button className="w-full py-3 bg-rose-500 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-[0.98]">
                           {t('skill_detail.request_swap')}
                        </button>
                        <button className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 border border-slate-200 transition-colors">
                           {t('skill_detail.contact_teacher')}
                        </button>
                     </div>

                     <div className="mt-4 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                           <Clock size={14} /> <span>{t('skill_detail.response_time')}: <b className="text-slate-700">~1 hour</b></span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                           <Zap size={14} /> <span>{t('skill_detail.instant_booking')}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Trust Card */}
               <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-slate-100 text-xs text-slate-500 text-center">
                  <p className="flex items-center justify-center gap-2 mb-1 font-bold text-slate-700">
                     <Shield size={14} className="text-green-500"/> {t('skill_detail.guarantee')}
                  </p>
                  {t('skill_detail.free_cancel')}
               </div>
            </div>

          </div>

          {/* SIMILAR TEACHERS SECTION */}
             <div className="border-t border-slate-200 pt-10">
             <h3 className="text-xl font-black text-slate-900 mb-6">{t('skill_detail.similar_experts')}</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarExperts.map((teacher, i) => (
                   <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                      <div className="relative h-48 bg-slate-900">
                         <ImageWithFallback src={teacher.image} alt={teacher.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/50">
                               <Play size={20} className="fill-white text-white ml-1" />
                            </div>
                         </div>
                         <div className="absolute bottom-3 right-3 text-white text-[10px] font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                            Professional
                         </div>
                      </div>
                      <div className="p-4">
                         <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100">
                                  <ImageWithFallback src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                               </div>
                               <div>
                                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                     {teacher.name} <span className="bg-indigo-600 text-white text-[8px] px-1 rounded uppercase">Plus+</span>
                                  </h4>
                                  <div className="text-[10px] text-slate-500">English <span className="text-teal-600 font-bold">{t('skill_card.native')}</span></div>
                               </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                               <Star size={12} className="fill-yellow-400 text-yellow-400" /> {teacher.rating}
                            </div>
                         </div>
                         <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">
                            {language === 'zh' ? `技能互换达人，已完成 ${teacher.lessons} 次交换。专注会话与实战。` : `Skill swap partner with ${teacher.lessons} exchanges completed. Focus on conversation & practice.`}
                         </p>
                         <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                            <div className="text-slate-900 font-black">
                               {teacher.price ?? 1} <span className="text-slate-400 text-[10px] font-medium">{t('skill_card.credit')} / {t('skill_card.trial')}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
             <div className="mt-8 mb-12 flex justify-center">
               <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2">
                  {t('skill_detail.find_more')} <ChevronRight size={16} />
               </button>
             </div>
          </div>
          
          {/* Mobile Booking Bar (Fixed Bottom) */}
          <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between gap-4">
             <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">{t('skill_card.trial')}</div>
                <div className="text-lg font-black text-slate-900">1 {t('skill_card.credit')}</div>
             </div>
             <button className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-sm uppercase shadow-lg shadow-rose-200">
                {t('skill_detail.request_swap')}
             </button>
          </div>

        </div>
      </div>

      {/* Provider NFT 橱窗 Modal */}
      {showProviderNftModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => { setShowProviderNftModal(false); setSelectedNftId(null); }}>
          <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative z-[101]" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <ImageIcon size={20} className="text-purple-500" /> {user} {t('nft_showcase.title')}
                </h3>
                <button onClick={() => setShowProviderNftModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                  <ChevronLeft size={18} />
                </button>
              </div>
              {providerNfts.length === 0 ? (
                <p className="text-slate-500 text-sm py-8 text-center">{language === 'zh' ? '暂无 NFT' : 'No NFTs yet'}</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {providerNfts.map((nft, i) => {
                    const gradients = ['from-amber-400/20 via-orange-100/50 to-rose-200/30', 'from-emerald-400/20 via-teal-100/50 to-cyan-200/30', 'from-violet-400/20 via-purple-100/50 to-fuchsia-200/30'];
                    const borders = ['border-amber-200/60', 'border-emerald-200/60', 'border-violet-200/60'];
                    const accents = ['text-amber-600', 'text-emerald-600', 'text-violet-600'];
                    const g = gradients[i % 3]; const b = borders[i % 3]; const a = accents[i % 3];
                    return (
                      <div
                        key={nft.id}
                        onClick={() => setSelectedNftId(nft.id)}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${g} border ${b} p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform" />
                        <div className="relative flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/80 shadow-lg shrink-0 ring-2 ring-slate-200/50">
                            <ImageWithFallback src={nft.partnerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'} alt={nft.partner} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-slate-800 line-clamp-2 group-hover:text-slate-900">{nft.title}</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-0.5">{nft.partner}</p>
                            <span className={`inline-block mt-1.5 text-[9px] font-black uppercase tracking-wider ${a}`}>⇄ Swap</span>
                          </div>
                          <Trophy size={20} className={`shrink-0 ${a} opacity-80 group-hover:scale-110 transition-transform`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNftId !== null && (
        <NFTDetailModal
          detail={nftDetail}
          currentUserName={user}
          onClose={() => setSelectedNftId(null)}
        />
      )}
    </div>
  );
};

export default SkillDetailView;