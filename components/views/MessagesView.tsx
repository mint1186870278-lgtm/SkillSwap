import React, { useState, useEffect } from 'react';
import { 
  Search, Phone, Video, MoreVertical, Paperclip, Mic, Send, 
  Bot, Clock, Calendar, CheckCircle, XCircle, Shield, Globe, 
  FileText, ChevronRight, Star, MapPin
} from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { fetchContacts, fetchMessages, sendMessage as sendMessageApi, processAI } from '../../lib/api-client';

const MessagesView = () => {
  const [activeContactId, setActiveContactId] = useState(1);
  const [contacts, setContacts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    fetchContacts().then(data => {
      setContacts(data);
      if (data.length > 0) setActiveContactId(data[0].id);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeContactId) {
      fetchMessages(activeContactId).then(setMessages).catch(console.error);
    }
  }, [activeContactId]);

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];

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
      const result = await processAI({ action: 'translate', context: lastThemMsg.text, targetLanguage: 'zh-CN' });
      setMessages(prev => [...prev, { id: Date.now(), sender: 'system', type: 'ai_trans', text: `Translation: ${result.result}`, icon: 'Globe' }]);
    } catch (e) {
      console.error('AI translate failed:', e);
    }
  };

  if (!activeContact) return <div className="flex items-center justify-center h-full text-slate-400">Loading...</div>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 h-full">
      
      {/* LEFT GROUP: CONTACTS + CHAT */}
      <div className="flex h-full bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
        
        {/* 1. LEFT SIDEBAR: CONTACTS */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          {/* Search */}
          <div className="p-5">
             <h2 className="text-2xl font-black text-slate-900 mb-4">Messages</h2>
             <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
             </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
             {contacts.map(contact => (
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
        <div className="flex-1 flex flex-col bg-[#F8FAFC]">
           
           {/* Chat Header */}
           <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 z-10">
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
                    <p className="text-xs text-slate-500">Exchanging: <span className="font-medium text-slate-700">Spanish ⇄ Figma</span></p>
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

           {/* Messages List */}
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Date Divider */}
              <div className="flex justify-center">
                 <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-wide">Today</span>
              </div>

              {messages.map((msg) => (
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
                                   <h4 className="font-bold text-slate-800 text-sm">Swap Proposal</h4>
                                   <p className="text-[10px] text-slate-400">Proposed by You</p>
                                </div>
                             </div>
                             <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-xs">
                                   <span className="text-slate-500">Time</span>
                                   <span className="font-bold text-slate-800">{msg.time_slot}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                   <span className="text-slate-500">You Teach</span>
                                   <span className="font-bold text-indigo-600">{msg.skill_me}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                   <span className="text-slate-500">You Learn</span>
                                   <span className="font-bold text-emerald-600">{msg.skill_them}</span>
                                </div>
                             </div>
                             <button className="w-full py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed">
                                Waiting for response...
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
                    <Bot size={12} /> AI Translate
                 </button>
                 <button onClick={async () => {
                    const context = messages.map(m => `${m.sender}: ${m.text || ''}`).join('\n');
                    try {
                      const result = await processAI({ action: 'schedule', context });
                      setMessages(prev => [...prev, { id: Date.now(), sender: 'system', type: 'ai_trans', text: result.result, icon: 'Globe' }]);
                    } catch(e) { console.error(e); }
                 }} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full hover:bg-emerald-100 transition-colors">
                    <Calendar size={12} /> Suggest Time
                 </button>
                 <button onClick={async () => {
                    const context = messages.map(m => `${m.sender}: ${m.text || ''}`).join('\n');
                    try {
                      const result = await processAI({ action: 'contract', context });
                      setMessages(prev => [...prev, { id: Date.now(), sender: 'system', type: 'ai_trans', text: result.result, icon: 'Globe' }]);
                    } catch(e) { console.error(e); }
                 }} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full hover:bg-amber-100 transition-colors">
                    <FileText size={12} /> Draft Contract
                 </button>
              </div>

              <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                 <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-colors">
                    <Paperclip size={20} />
                 </button>
                 <textarea 
                    placeholder="Type a message..." 
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
      <div className="hidden xl:flex flex-col bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-full overflow-y-auto">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6">Current Exchange</h3>
         
         <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 mb-4 overflow-hidden shadow-md rotate-3">
               <ImageWithFallback src={activeContact.avatar} alt={activeContact.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-1">{activeContact.name}</h2>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
               <MapPin size={12} /> Madrid, Spain
            </div>
            <div className="flex gap-1 mt-3">
               {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
               <span className="text-xs font-bold ml-1">5.0</span>
            </div>
         </div>

         {/* Skill Swap Info Card */}
         <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
            <div className="flex justify-between items-center mb-3">
               <span className="text-[10px] font-bold text-slate-400 uppercase">The Deal</span>
               <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Drafting</span>
            </div>
            
            <div className="space-y-3 relative">
               {/* Connector Line */}
               <div className="absolute left-[15px] top-8 bottom-4 w-0.5 bg-slate-200 border-l border-dashed border-slate-300"></div>

               <div className="flex gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-lg">🇪🇸</div>
                  <div>
                     <p className="text-xs font-bold text-slate-800">Conversational Spanish</p>
                     <p className="text-[10px] text-slate-400">Offer (30m)</p>
                  </div>
               </div>

               <div className="flex gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-lg">🎨</div>
                  <div>
                     <p className="text-xs font-bold text-slate-800">Figma Auto-Layout</p>
                     <p className="text-[10px] text-slate-400">Receive (30m)</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-auto">
            <h4 className="text-xs font-bold text-slate-800 mb-3">Shared Files</h4>
            <div className="space-y-2">
               <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                  <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                     <FileText size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-slate-700 truncate">grammar_notes.pdf</p>
                     <p className="text-[10px] text-slate-400">2.4 MB</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                  <div className="w-8 h-8 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                     <FileText size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-slate-700 truncate">project_v2.fig</p>
                     <p className="text-[10px] text-slate-400">Link</p>
                  </div>
               </div>
            </div>
         </div>

      </div>

    </div>
  );
};

export default MessagesView;