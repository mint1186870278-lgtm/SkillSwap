import React, { useState, useEffect } from 'react';
import { 
  Search, Phone, Video, MoreVertical, Paperclip, Mic, Send, 
  Bot, Clock, Calendar, CheckCircle, XCircle, Shield, Globe, 
  FileText, ChevronRight, Star, MapPin, MessageCircle, Compass,
  Zap, Sparkles
} from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { fetchContacts, fetchMessages, sendMessage as sendMessageApi, processAI } from '../../lib/api-client';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_DATA_ZH } from '../../lib/mock-data-zh';
import { MOCK_CONTACT_EXCHANGE_PROGRESS } from '../../lib/mock-data';

// Per-contact exchange info (layout same as Elena, different content)
const CONTACT_EXCHANGE_INFO: Record<number, { location: { en: string; zh: string }; skillMe: { en: string; zh: string }; skillThem: { en: string; zh: string }; skillMeIcon: string; skillThemIcon: string; files: { name: { en: string; zh: string }; size: string }[] }> = {
  1: {
    location: { en: 'Madrid, Spain', zh: '马德里, 西班牙' },
    skillMe: { en: 'Spanish Conversation', zh: '西班牙语会话' },
    skillThem: { en: 'Figma Auto-Layout', zh: 'Figma 自动布局' },
    skillMeIcon: '🇪🇸',
    skillThemIcon: '🎨',
    files: [
      { name: { en: 'Grammar Notes.pdf', zh: '语法笔记.pdf' }, size: '2.4 MB' },
      { name: { en: 'Project_v2.fig', zh: 'Project_v2.fig' }, size: 'Link' },
    ],
  },
  2: {
    location: { en: 'San Francisco, CA', zh: '旧金山, 加州' },
    skillMe: { en: 'Figma Design Review', zh: 'Figma 设计评审' },
    skillThem: { en: 'React & Tailwind', zh: 'React & Tailwind' },
    skillMeIcon: '🎨',
    skillThemIcon: '⚛️',
    files: [
      { name: { en: 'Component Library.fig', zh: '组件库.fig' }, size: 'Link' },
      { name: { en: 'React Setup Guide.pdf', zh: 'React 配置指南.pdf' }, size: '1.2 MB' },
    ],
  },
  3: {
    location: { en: 'Portland, OR', zh: '波特兰, 俄勒冈' },
    skillMe: { en: 'Pottery Basics', zh: '陶艺入门' },
    skillThem: { en: 'Urban Photography', zh: '城市摄影' },
    skillMeIcon: '🏺',
    skillThemIcon: '📷',
    files: [
      { name: { en: 'Photo Tips.pdf', zh: '摄影技巧.pdf' }, size: '0.8 MB' },
      { name: { en: 'Glazing Guide.pdf', zh: '上釉指南.pdf' }, size: '1.5 MB' },
    ],
  },
};

const MessagesView = ({ onNavigateToExplore }: { onNavigateToExplore?: () => void }) => {
  const { t, language } = useLanguage();
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  const isZh = language === 'zh';

  useEffect(() => {
    fetchContacts()
      .then(data => {
        setContacts(data);
        if (data.length > 0) setActiveContactId(data[0].id);
        setContactsLoaded(true);
      })
      .catch(() => setContactsLoaded(true));
  }, []);

  useEffect(() => {
    if (activeContactId) {
      fetchMessages(activeContactId).then(setMessages).catch(console.error);
    }
  }, [activeContactId]);

  // Translate contacts
  const translatedContacts = contacts.map(c => {
    if (!isZh) return c;
    const trans = MOCK_DATA_ZH.contacts?.[c.id];
    return trans ? { ...c, ...trans } : c;
  });

  const activeContact = translatedContacts.find(c => c.id === activeContactId) || translatedContacts[0];
  const exchangeInfo = activeContactId ? (CONTACT_EXCHANGE_INFO[activeContactId] || CONTACT_EXCHANGE_INFO[1]) : null;
  const exchangeProgress = activeContactId ? (MOCK_CONTACT_EXCHANGE_PROGRESS[activeContactId] || { stage: 0, totalStages: 5, achievements: [] }) : null;

  // Translate messages
  const translatedMessages = messages.map(m => {
    if (!isZh) return m;
    const trans = MOCK_DATA_ZH.messages?.[m.id];
    
    // Translate message content if available
    let newMsg = trans ? { ...m, ...trans } : m;

    // Translate dynamic fields if proposal
    if (m.type === 'proposal') {
      if (trans) {
         newMsg = { ...newMsg, ...trans };
      } else if (isZh) {
         const slotZh: Record<string, string> = {
            'Tomorrow, 2:00 PM': '明天, 下午 2:00',
            'Thursday, 4:00 PM': '周四, 下午 4:00',
            'Saturday, 10:00 AM': '周六, 上午 10:00',
         };
         const skillMeZh: Record<string, string> = {
            'Figma Skills': 'Figma 技能',
            'Figma Design Review': 'Figma 设计评审',
            'Pottery Basics': '陶艺入门',
         };
         const skillThemZh: Record<string, string> = {
            'Spanish Practice': '西班牙语练习',
            'React & Tailwind': 'React & Tailwind',
            'Urban Photography': '城市摄影',
         };
         newMsg = {
            ...newMsg,
            skill_me: skillMeZh[m.skill_me] || m.skill_me,
            skill_them: skillThemZh[m.skill_them] || m.skill_them,
            time_slot: slotZh[m.time_slot || ''] || m.time_slot,
         };
      }
    }
    return newMsg;
  });

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    // Optimistic update
    setMessages(prev => [...prev, { id: Date.now(), sender: 'me', text, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }), type: 'text' }]);
    try {
      await sendMessageApi(activeContactId, { text, sender: 'me' });
    } catch (e) {
      console.error('Failed to send message:', e);
    }
  };

  const handleAITranslate = async () => {
    const lastThemMsg = [...messages].reverse().find(m => m.sender === 'them');
    if (!lastThemMsg?.text) return;
    try {
      // Mock logic for demo
      if (isZh) {
         setMessages(prev => [...prev, { id: Date.now(), sender: 'system', type: 'ai_trans', text: `翻译: ${lastThemMsg.text} (Translated text)`, icon: 'Globe' }]);
      } else {
         const result = await processAI({ action: 'translate', context: lastThemMsg.text, targetLanguage: 'zh-CN' });
         setMessages(prev => [...prev, { id: Date.now(), sender: 'system', type: 'ai_trans', text: `Translation: ${result.result}`, icon: 'Globe' }]);
      }
    } catch (e) {
      console.error('AI translate failed:', e);
    }
  };

  if (!contactsLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-slate-400 text-sm font-medium">Loading...</div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-6">
        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
          <MessageCircle size={40} className="text-indigo-400" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2 text-center">{t('messages.empty_title')}</h3>
        <p className="text-slate-500 text-sm text-center max-w-sm mb-8 leading-relaxed">{t('messages.empty_text')}</p>
        <button
          onClick={onNavigateToExplore}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
        >
          <Compass size={20} />
          {t('messages.empty_btn')}
        </button>
      </div>
    );
  }

  if (!activeContact) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 h-full min-h-0 flex-1">
      
      {/* LEFT GROUP: CONTACTS + CHAT - 布局与图片一致，切换联系人不变 */}
      <div className="flex min-h-0 flex-1 bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
        
        {/* 1. LEFT SIDEBAR: CONTACTS */}
        <div className="w-80 shrink-0 border-r border-slate-100 flex flex-col min-h-0 bg-slate-50/50">
          {/* Search */}
          <div className="p-5">
             <h2 className="text-2xl font-black text-slate-900 mb-4">{t('messages.title')}</h2>
             <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={t('messages.search')} 
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
             </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
             {translatedContacts.map(contact => (
               <div 
                 key={contact.id}
                 onClick={() => setActiveContactId(contact.id)}
                 className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 group ${
                   activeContactId === contact.id ? 'bg-white shadow-md shadow-slate-100 scale-[1.02]' : 'hover:bg-white hover:shadow-sm'
                 }`}
               >
                  <div className="relative">
                     <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100">
                        <ImageWithFallback src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                     </div>
                     {contact.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                     )}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className={`text-sm font-bold truncate ${activeContactId === contact.id ? 'text-indigo-900' : 'text-slate-700'}`}>{contact.name}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{contact.time}</span>
                     </div>
                     <p className="text-xs text-slate-500 truncate leading-relaxed">
                        {contact.lastMsg}
                     </p>
                     {contact.skill && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded">
                           {contact.skill}
                        </span>
                     )}
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* 2. MIDDLE: CHAT AREA */}
        <div className="flex-1 min-h-0 flex flex-col bg-[#F8FAFC]">
           
           {/* Chat Header */}
           <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 shrink-0 z-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="relative">
                       <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100">
                          <ImageWithFallback src={activeContact.avatar} alt={activeContact.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          {activeContact.name}
                          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded tracking-wide">Pro</span>
                       </h3>
                       <p className="text-xs text-slate-500">{t('messages.current_exchange')}: <span className="font-medium text-slate-700">{exchangeInfo ? (isZh ? `${exchangeInfo.skillMe.zh} ⇄ ${exchangeInfo.skillThem.zh}` : `${exchangeInfo.skillMe.en} ⇄ ${exchangeInfo.skillThem.en}`) : ''}</span></p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                       <Phone size={20} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                       <Video size={20} />
                    </button>
                    <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                       <MoreVertical size={20} />
                    </button>
                 </div>
              </div>
              {/* 交换进度 & 阶段成就 (Soul 式) */}
              {exchangeProgress && exchangeProgress.achievements.length > 0 && (
                 <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('messages.exchange_progress')}</span>
                       <span className="text-xs font-black text-indigo-600">{exchangeProgress.stage}/{exchangeProgress.totalStages}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                       <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" 
                          style={{ width: `${(exchangeProgress.stage / exchangeProgress.totalStages) * 100}%` }}
                       />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                       {exchangeProgress.achievements.map((a) => (
                          <span 
                             key={a.id} 
                             className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                a.unlocked 
                                   ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm' 
                                   : 'bg-slate-50 text-slate-400 border border-slate-100'
                             }`}
                             title={a.unlocked ? t('messages.achievement_unlocked') : t('messages.achievement_locked')}
                          >
                             {a.unlocked ? <Sparkles size={10} className="text-amber-500" /> : <Zap size={10} className="opacity-50" />}
                             {isZh ? a.label : (a.labelEn || a.label)}
                          </span>
                       ))}
                    </div>
                 </div>
              )}
           </div>

           {/* Messages List */}
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Date Divider */}
              <div className="flex justify-center">
                 <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-wide">{t('messages.today')}</span>
              </div>

              {translatedMessages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    
                    {/* Avatar for Them */}
                    {msg.sender === 'them' && (
                       <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 mr-3 mt-1 shrink-0">
                          <ImageWithFallback src={activeContact.avatar} alt="Sender" className="w-full h-full object-cover" />
                       </div>
                    )}

                    <div className={`max-w-[70%] space-y-1 ${msg.sender === 'system' ? 'w-full max-w-none flex justify-center' : ''}`}>
                       
                       {/* BUBBLE CONTENT */}
                       {msg.sender === 'system' ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50/50 border border-indigo-100 text-indigo-600 rounded-xl text-xs font-medium w-fit mx-auto shadow-sm">
                             <Globe size={14} /> {msg.text}
                          </div>
                       ) : msg.type === 'proposal' ? (
                          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                             <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                   <Calendar size={16} />
                                </div>
                                <div>
                                   <h4 className="font-bold text-slate-800 text-sm">{t('messages.proposal')}</h4>
                                   <p className="text-[10px] text-slate-400">{t('messages.proposed_by')}</p>
                                </div>
                             </div>
                             <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-xs">
                                   <span className="text-slate-500">{t('messages.time')}</span>
                                   <span className="font-bold text-slate-800">{msg.time_slot}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                   <span className="text-slate-500">{t('messages.you_teach')}</span>
                                   <span className="font-bold text-indigo-600">{msg.skill_me}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                   <span className="text-slate-500">{t('messages.you_learn')}</span>
                                   <span className="font-bold text-emerald-600">{msg.skill_them}</span>
                                </div>
                             </div>
                             <button className="w-full py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed">
                                {t('messages.waiting')}
                             </button>
                          </div>
                       ) : (
                          <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                             msg.sender === 'me' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                          }`}>
                             {msg.text}
                          </div>
                       )}

                       {/* Timestamp */}
                       {msg.sender !== 'system' && (
                          <div className={`text-[10px] text-slate-400 font-medium ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                             {msg.time}
                          </div>
                       )}
                    </div>
                 </div>
              ))}
           </div>

           {/* Input Area */}
           <div className="p-4 bg-white border-t border-slate-100">
              {/* AI Tools Bar */}
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                 <button onClick={handleAITranslate} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full hover:bg-indigo-100 transition-colors">
                    <Bot size={12} /> {t('messages.ai_translate')}
                 </button>
                 <button onClick={async () => {
                    const context = messages.map(m => `${m.sender}: ${m.text || ''}`).join('\n');
                    try {
                      const result = await processAI({ action: 'schedule', context });
                      setMessages(prev => [...prev, { id: Date.now(), sender: 'system', type: 'ai_trans', text: isZh ? '系统: 建议时间已发送' : result.result, icon: 'Globe' }]);
                    } catch(e) { console.error(e); }
                 }} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full hover:bg-emerald-100 transition-colors">
                    <Calendar size={12} /> {t('messages.suggest_time')}
                 </button>
                 <button onClick={async () => {
                    const context = messages.map(m => `${m.sender}: ${m.text || ''}`).join('\n');
                    try {
                      const result = await processAI({ action: 'contract', context });
                      setMessages(prev => [...prev, { id: Date.now(), sender: 'system', type: 'ai_trans', text: isZh ? '系统: 合同草案已生成' : result.result, icon: 'Globe' }]);
                    } catch(e) { console.error(e); }
                 }} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full hover:bg-amber-100 transition-colors">
                    <FileText size={12} /> {t('messages.draft_contract')}
                 </button>
              </div>

              <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                 <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-colors">
                    <Paperclip size={20} />
                 </button>
                 <textarea 
                    placeholder={t('messages.type_message')} 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 min-h-[40px] max-h-[120px] py-2 resize-none"
                    rows={1}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                 />
                 <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-colors">
                    <Mic size={20} />
                 </button>
                 <button onClick={handleSend} className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:scale-105 transition-transform active:scale-95">
                    <Send size={18} fill="currentColor" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* 3. RIGHT GROUP: CONTEXT SIDEBAR */}
      <div className="hidden xl:flex flex-col min-h-0 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 overflow-y-auto">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6">{t('messages.current_exchange')}</h3>
         
         <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 mb-4 overflow-hidden shadow-md rotate-3">
               <ImageWithFallback src={activeContact.avatar} alt={activeContact.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-1">{activeContact.name}</h2>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
               <MapPin size={12} /> {isZh ? exchangeInfo.location.zh : exchangeInfo.location.en}
            </div>
            <div className="flex gap-1 mt-3">
               {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
               <span className="text-xs font-bold ml-1">5.0</span>
            </div>
         </div>

         {/* Skill Swap Info Card */}
         <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
            <div className="flex justify-between items-center mb-3">
               <span className="text-[10px] font-bold text-slate-400 uppercase">{t('messages.the_deal')}</span>
               <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{t('messages.drafting')}</span>
            </div>
            
            <div className="space-y-3 relative">
               {/* Connector Line */}
               <div className="absolute left-[15px] top-8 bottom-4 w-0.5 bg-slate-200 border-l border-dashed border-slate-300"></div>

               <div className="flex gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-lg">{exchangeInfo.skillMeIcon}</div>
                  <div>
                     <p className="text-xs font-bold text-slate-800">{isZh ? exchangeInfo.skillMe.zh : exchangeInfo.skillMe.en}</p>
                     <p className="text-[10px] text-slate-400">{t('messages.offer')} (30m)</p>
                  </div>
               </div>

               <div className="flex gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-lg">{exchangeInfo.skillThemIcon}</div>
                  <div>
                     <p className="text-xs font-bold text-slate-800">{isZh ? exchangeInfo.skillThem.zh : exchangeInfo.skillThem.en}</p>
                     <p className="text-[10px] text-slate-400">{t('messages.receive')} (30m)</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-auto">
            <h4 className="text-xs font-bold text-slate-800 mb-3">{t('messages.shared_files')}</h4>
            <div className="space-y-2">
               {exchangeInfo.files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:opacity-90 transition-colors ${i === 0 ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                        <FileText size={14} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate">{isZh ? f.name.zh : f.name.en}</p>
                        <p className="text-[10px] text-slate-400">{f.size}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

      </div>

    </div>
  );
};

export default MessagesView;