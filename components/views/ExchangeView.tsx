import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Video, MessageCircle, Star, 
  MoreVertical, CheckCircle, XCircle, AlertCircle, TrendingUp,
  ArrowRight, Hourglass, FileText, ChevronRight
} from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSessions, fetchExchangeStats, type ExchangeStats } from '../../lib/api-client';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_DATA_ZH } from '../../lib/mock-data-zh';

const ExchangeView = ({ onNavigateToExchangeFeedback }: { onNavigateToExchangeFeedback?: () => void }) => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<'upcoming' | 'pending' | 'past'>('upcoming');
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState<ExchangeStats | null>(null);

  useEffect(() => {
    fetchSessions()
      .then(setSessions)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchExchangeStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const isZh = language === 'zh';

  // Translate sessions
  const translatedSessions = sessions.map(s => {
    if (!isZh) return s;
    const trans = MOCK_DATA_ZH.sessions?.[s.id];
    const skillMap: Record<string, string> = {
      'Conversational Spanish': '西班牙语会话',
      'React & Tailwind': 'React & Tailwind',
      'Piano Basics': '钢琴基础',
      'Digital Marketing 101': '数字营销 101',
      'French Cooking': '法式烹饪',
      'Photography Basics': '摄影基础',
      'Sourdough Baking': '酸种面包烘焙',
      'Guitar Fundamentals': '吉他基础'
    };
    return {
      ...s,
      ...trans,
      skill: skillMap[s.skill] || s.skill
    };
  });

  const filteredSessions = translatedSessions.filter(s => s.type === filter);

  const translateDate = (date: string) => {
    if (!isZh) return date;
    if (date === 'Today') return '今天';
    if (date === 'Tomorrow') return '明天';
    return date;
  };

  return (
    <div className="h-full pb-20">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('exchange.title')}</h1>
           <p className="text-slate-500 font-medium text-sm mt-1">{t('exchange.subtitle')}</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           {[
              { id: 'upcoming', label: t('exchange.upcoming') },
              { id: 'pending', label: t('exchange.pending') },
              { id: 'past', label: t('exchange.past') }
           ].map(tab => (
              <button 
                 key={tab.id}
                 onClick={() => setFilter(tab.id as any)}
                 className={`px-6 py-2 rounded-xl text-sm font-bold transition-all relative ${
                    filter === tab.id 
                    ? 'text-slate-900 shadow-sm bg-white ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                 }`}
              >
                 {tab.label}
                 {/* Notification Dot for Pending */}
                 {tab.id === 'pending' && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-white"></span>
                 )}
              </button>
           ))}
        </div>
      </div>

      {/* 交换反馈帖入口 - 双方确认交换后平台自动创建 */}
      {onNavigateToExchangeFeedback && (
        <div 
          onClick={onNavigateToExchangeFeedback}
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{isZh ? '交换反馈帖' : 'Exchange Feedback'}</h3>
              <p className="text-slate-500 text-xs">{isZh ? '双方确认交换后平台自动创建，记录学习进度' : 'Auto-created when you confirm a swap'}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">
         
         {/* LEFT: Session Cards */}
         <div className="space-y-4">
            <AnimatePresence mode="wait">
               {filteredSessions.length > 0 ? (
                  <div className="flex flex-col gap-4">
                     {filteredSessions.map((session) => (
                        <motion.div
                           key={session.id}
                           layout
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           transition={{ duration: 0.2 }}
                           className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                        >
                           {/* Status Indicator Bar */}
                           <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                              session.type === 'upcoming' ? 'bg-indigo-500' : 
                              session.type === 'pending' ? 'bg-amber-400' : 'bg-slate-200'
                           }`}></div>

                           <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                              
                              {/* Date & Time Block */}
                              <div className="flex items-center gap-4 min-w-[140px]">
                                 <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl shrink-0 ${
                                    session.type === 'upcoming' ? 'bg-indigo-50 text-indigo-700' : 
                                    session.type === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500'
                                 }`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{translateDate(session.date === 'Today' ? 'Today' : session.date === 'Tomorrow' ? 'Tomorrow' : session.date?.split(',')[0])}</span>
                                    <span className="text-xl font-black">{session.time.split('-')[0].trim()}</span>
                                 </div>
                                 <div className="md:hidden">
                                    <h4 className="font-bold text-slate-900">{session.skill}</h4>
                                    <p className="text-xs text-slate-500">with {session.partner}</p>
                                 </div>
                              </div>

                              {/* Main Info */}
                              <div className="flex-1 min-w-0 hidden md:block">
                                 <h3 className="font-bold text-lg text-slate-900 mb-1 flex items-center gap-2">
                                    {session.skill}
                                    {session.type === 'upcoming' && (
                                       <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></div> {isZh ? '2小时后开始' : '2h to start'}
                                       </span>
                                    )}
                                 </h3>
                                 <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-100">
                                       <ImageWithFallback src={session.avatar} alt={session.partner} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm text-slate-500 font-medium">{isZh ? '搭档' : 'with'} <strong className="text-slate-700">{session.partner}</strong></span>
                                 </div>
                              </div>

                              {/* Action Area */}
                              <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                 {session.type === 'upcoming' && (
                                    <>
                                       <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/50">
                                          <Video size={16} /> {t('exchange.join')}
                                       </button>
                                       <button className="w-12 h-11 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-700 transition-colors">
                                          <MessageCircle size={18} />
                                       </button>
                                    </>
                                 )}

                                 {session.type === 'pending' && (
                                    <div className="flex flex-col items-end gap-1 w-full md:w-auto">
                                       <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold bg-amber-50 px-3 py-1.5 rounded-lg w-full md:w-auto justify-center">
                                          <Hourglass size={14} /> {t('exchange.awaiting')}
                                       </div>
                                       <button className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors">{t('exchange.cancel')}</button>
                                    </div>
                                 )}

                                 {session.type === 'past' && (
                                    !session.rated ? (
                                       <button className="flex-1 md:flex-none px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 group">
                                          <Star size={16} className="fill-white/20 group-hover:fill-white transition-all" /> {t('exchange.rate')}
                                       </button>
                                    ) : (
                                       <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
                                          <CheckCircle size={14} className="text-green-500" /> {t('exchange.completed')}
                                       </div>
                                    )
                                 )}
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               ) : (
                  <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }}
                     className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 border-dashed"
                  >
                     <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-inner">
                        {filter === 'upcoming' ? '📅' : filter === 'pending' ? '⏳' : '🏁'}
                     </div>
                     <h3 className="font-bold text-xl text-slate-900 mb-2">{t('exchange.no_sessions')}</h3>
                     <p className="text-slate-500 mb-6">{isZh ? `暂时没有${filter === 'upcoming' ? '即将到来' : filter === 'pending' ? '待定' : '历史'}的交换。` : `You don't have any ${filter} sessions at the moment.`}</p>
                     <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors">
                        {t('exchange.find_skill')}
                     </button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* RIGHT: Stats Sidebar (Sticky) */}
         <div className="space-y-6 sticky top-6">
            
            {/* Impact Card - 真实数据 */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="font-bold opacity-80 text-sm mb-1 flex items-center gap-2">
                     <Clock size={16} /> {t('exchange.total_time')}
                  </h3>
                  <div className="text-5xl font-black mb-4 tracking-tight">{stats?.totalHours ?? 0} <span className="text-lg font-medium opacity-60">{t('exchange.hours')}</span></div>
                  
                  {/* Progress Bar */}
                  <div className="relative pt-2">
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide mb-1 opacity-80">
                        <span>{t('exchange.level')} {stats?.level ?? 1}</span>
                        <span>{t('exchange.level')} {(stats?.level ?? 1) + 1}</span>
                     </div>
                     <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all" style={{ width: `${stats?.levelProgress ?? 0}%` }}></div>
                     </div>
                     <p className="text-[10px] mt-2 opacity-70 font-medium">{Math.round((stats?.levelProgress ?? 0) / 10) * 0.5} {t('exchange.badge_progress')}</p>
                  </div>
               </div>
               
               {/* Decor */}
               <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            </div>

            {/* Savings Card - 真实数据 */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-[4rem] -z-0"></div>
               
               <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                  <TrendingUp size={20} className="text-green-500" /> {t('exchange.value')}
               </h3>
               
               <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="text-xs font-bold text-slate-500">{t('exchange.money_saved_label')}</div>
                     <span className="text-lg font-black text-green-600">${stats?.moneySaved ?? 0}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div className="text-2xl font-black text-slate-900">{stats?.friendsMade ?? 0}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{t('exchange.friends_made_label')}</div>
                     </div>
                     <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div className="text-2xl font-black text-slate-900">{stats?.newSkills ?? 0}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{t('exchange.new_skills_label')}</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Next Milestone */}
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-6 text-center opacity-70 hover:opacity-100 transition-opacity">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl grayscale">
                  🏅
               </div>
               <h4 className="font-bold text-slate-800 text-sm">{t('exchange.next_milestone')}</h4>
               <p className="text-xs text-slate-500 mt-1">{t('exchange.milestone_text')}</p>
            </div>

         </div>

      </div>
    </div>
  );
};

export default ExchangeView;