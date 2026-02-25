import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Button from './Button';
import { Globe, Dumbbell, Rocket, Palette, CheckCircle2, Search, Sparkles, MessageCircle, ArrowRight, Check, Mail, Github, Smartphone, Chrome, Command, X, Plus } from 'lucide-react';
const mascotImage = "/Gemini_Generated_Image.png";

interface OnboardingProps {
  onFinish: () => void;
}

  // --- Planet Icons (Light Mode Optimized) ---
const PlanetBase = ({ color, children }: { color: string, children: React.ReactNode }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill={color} />
    <mask id={`mask-${color}`} maskUnits="userSpaceOnUse" x="2" y="2" width="96" height="96">
      <circle cx="50" cy="50" r="48" fill="white" />
    </mask>
    <g mask={`url(#mask-${color})`}>
      {children}
    </g>
    <path d="M75 25 Q 85 35 80 45" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const PlanetLanguage = ({ className }: { className?: string }) => (
  <div className={className}>
    <PlanetBase color="#A78BFA">
      <path d="M-10 20L110 80" stroke="#C4B5FD" strokeWidth="12" strokeLinecap="round" />
      <path d="M-10 50L110 110" stroke="#C4B5FD" strokeWidth="12" strokeLinecap="round" />
    </PlanetBase>
  </div>
);
const PlanetFitness = ({ className }: { className?: string }) => (
  <div className={className}>
    <PlanetBase color="#F472B6">
      <circle cx="30" cy="30" r="8" fill="#FBCFE8" />
      <circle cx="70" cy="40" r="12" fill="#FBCFE8" />
      <circle cx="45" cy="70" r="10" fill="#FBCFE8" />
    </PlanetBase>
  </div>
);
const PlanetTech = ({ className }: { className?: string }) => (
  <div className={className}>
    <PlanetBase color="#60A5FA">
      <path d="M10 50 Q 50 20 90 50" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M10 50 Q 50 80 90 50" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" fill="none" />
    </PlanetBase>
  </div>
);
const PlanetDesign = ({ className }: { className?: string }) => (
  <div className={className}>
    <PlanetBase color="#FCD34D">
      <path d="M15 40 Q 50 50 85 40" stroke="#FEF3C7" strokeWidth="6" fill="none" />
      <path d="M15 60 Q 50 70 85 60" stroke="#FEF3C7" strokeWidth="6" fill="none" />
      <path d="M10 65 Q 50 45 90 45" stroke="#7DD3FC" strokeWidth="8" strokeLinecap="round" />
    </PlanetBase>
  </div>
);
const PlanetDiscovery = ({ className }: { className?: string }) => (
  <div className={className}>
    <PlanetBase color="#34D399">
      {/* Saturn-like Ring Effect */}
      <circle cx="50" cy="50" r="20" fill="#10B981" opacity="0.5" />
      <path d="M-10 65 Q 50 35 110 65" stroke="#6EE7B7" strokeWidth="12" fill="none" />
      <path d="M-10 45 Q 50 15 110 45" stroke="#D1FAE5" strokeWidth="6" fill="none" opacity="0.8" />
      {/* Moons */}
      <circle cx="80" cy="30" r="6" fill="#ECFDF5" />
      <circle cx="20" cy="70" r="4" fill="#ECFDF5" />
    </PlanetBase>
  </div>
);

const SUGGESTIONS: Record<string, string[]> = {
  language: ['英语', '西班牙语', '普通话', '法语', '日语', '德语'],
  fitness: ['瑜伽', 'HIIT', '跑步', '举重', '普拉提', '冥想'],
  tech: ['Python', 'React', 'JavaScript', 'AI/ML', '数据科学', 'Rust'],
  design: ['Figma', 'Photoshop', 'UI/UX', '插画', '3D 建模', 'Canva'],
  other: ['天文学', '历史', '摄影', '写作', '旅行', '烹饪']
};


const FloatingFish: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 40 24"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M4 12 Q 12 4 24 6 Q 30 8 34 4 L 34 20 Q 30 16 24 18 Q 12 20 4 12 Z"
      fill="#FACC15"
      />
    <circle cx="8" cy="10" r="1.6" fill="#92400E" />
  </svg>
);

// Helper: Navigation Buttons
const NavButtons = ({ onBack, onClose, showBack = true }: { onBack?: () => void, onClose: () => void, showBack?: boolean }) => (
  <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-6 md:p-8">
    <div className="relative w-full h-full flex justify-between items-start pointer-events-auto">
      {showBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 tracking-widest uppercase transition-colors"
        >
          <ArrowRight className="rotate-180 w-4 h-4" /> 返回
        </button>
      )}
      {!showBack && <div></div>} {/* Spacer */}
      <button 
        onClick={onClose}
        className="text-sm font-bold text-slate-400 hover:text-slate-600 tracking-widest uppercase transition-colors"
      >
        关闭
      </button>
    </div>
  </div>
);

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Step 2 State: Skill Identity
  const [teachGalaxies, setTeachGalaxies] = useState<string[]>([]);
  const [isTeachInputStep, setIsTeachInputStep] = useState(false);
  const [teachTags, setTeachTags] = useState<string[]>([]);
  const [teachInputValue, setTeachInputValue] = useState('');
  
  // Step 3 State: Learning Goal
  const [learnGalaxies, setLearnGalaxies] = useState<string[]>([]);
  const [isLearnInputStep, setIsLearnInputStep] = useState(false);
  const [learnTags, setLearnTags] = useState<string[]>([]);
  const [learnInputValue, setLearnInputValue] = useState('');
  
  // Step 4 State: Matching
  const [isMatching, setIsMatching] = useState(true);

  // Galaxy Data with Components
  const galaxies = [
    { id: 'language', label: '语言', Component: PlanetLanguage },
    { id: 'fitness', label: '健身', Component: PlanetFitness },
    { id: 'tech', label: '技术', Component: PlanetTech },
    { id: 'design', label: '设计', Component: PlanetDesign },
    { id: 'other', label: '其他', Component: PlanetDiscovery }
  ];

  // Helper: Handle Step 2 (Teach)
  const handleTeachGalaxySelect = (id: string) => {
    if (teachGalaxies.includes(id)) {
        setTeachGalaxies(teachGalaxies.filter(g => g !== id));
    } else {
        setTeachGalaxies([...teachGalaxies, id]);
    }
  };

  const addTeachTag = (tag: string) => {
    if (!teachTags.includes(tag) && teachTags.length < 3) {
      setTeachTags([...teachTags, tag]);
    }
    setTeachInputValue('');
  };

  const removeTeachTag = (tag: string) => {
    setTeachTags(teachTags.filter(t => t !== tag));
  };
  
  const handleTeachSubmit = () => {
    if (teachTags.length > 0) {
      setStep(3);
    }
  };

  // Helper: Handle Step 3 (Learn)
  const handleLearnGalaxySelect = (id: string) => {
    if (learnGalaxies.includes(id)) {
        setLearnGalaxies(learnGalaxies.filter(g => g !== id));
    } else {
        setLearnGalaxies([...learnGalaxies, id]);
    }
  };

  const addLearnTag = (tag: string) => {
    if (!learnTags.includes(tag) && learnTags.length < 3) {
      setLearnTags([...learnTags, tag]);
    }
    setLearnInputValue('');
  };

  const removeLearnTag = (tag: string) => {
    setLearnTags(learnTags.filter(t => t !== tag));
  };

  const handleLearnSubmit = () => {
    if (learnTags.length > 0) {
      setStep(4);
    }
  };

  // Helper: Simulate AI Matching on Step 4
  useEffect(() => {
    if (step === 4) {
      // Simulate API call delay
      const timer = setTimeout(() => {
        setIsMatching(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // --- RENDER STEP 1: WELCOME & LOGIN ---
  if (step === 1) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center w-full max-w-lg mx-auto h-screen px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <NavButtons onClose={onFinish} showBack={false} />

        {/* Glass Card */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] text-center relative overflow-hidden w-full">
          
          {/* Logo Area */}
          <motion.div 
            className="mb-4 mx-auto w-16 h-16 bg-white rounded-2xl rotate-3 flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 12, scale: 1.1 }}
          >
             <Sparkles className="text-indigo-500 w-8 h-8" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2 font-heading">
            欢迎来到 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">SkillSwap</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 font-medium mb-6 leading-relaxed">
            在这里，技能就是货币。<br/>
            免费连接、教学和学习。
          </p>

          {/* Login Options (Light Theme) */}
          <div className="w-full space-y-3 mb-4">
            <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md">
               <Chrome size={20} className="text-slate-400" />
               通过 Google 继续
            </button>
            <div className="grid grid-cols-2 gap-3">
               <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md">
                 <Command size={18} className="text-slate-400" /> Apple
               </button>
               <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md">
                 <Mail size={18} className="text-slate-400" /> 邮箱
               </button>
            </div>
          </div>

          <div className="relative w-full flex items-center justify-center py-2 mb-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white/50 px-4 text-xs text-slate-400 font-bold uppercase tracking-wider backdrop-blur-sm">还没有账号？</span>
          </div>

          {/* Guest Mode CTA */}
          <button 
            onClick={() => setStep(2)}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 text-lg group transition-all"
          >
            以访客身份浏览
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </motion.div>
    );
  }

  // --- RENDER STEP 2: SKILL IDENTITY ---
  if (step === 2) {
    if (!isTeachInputStep) {
      // 2.1 Select Home Galaxy (Multi-select)
      return (
        <motion.div 
          className="flex flex-col items-center justify-center h-screen w-full max-w-5xl mx-auto px-4 overflow-hidden pt-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <NavButtons 
            onClose={onFinish} 
            onBack={() => setStep(1)} 
            showBack={true} 
          />

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-textMain drop-shadow-sm font-heading">
              你的专长是什么？
            </h2>
            <p className="text-textLight text-lg font-medium">选择你技能最闪耀的星系</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-16 px-4">
            {galaxies.map((galaxy) => {
              const isSelected = teachGalaxies.includes(galaxy.id);
              return (
                <motion.button
                  key={galaxy.id}
                  onClick={() => handleTeachGalaxySelect(galaxy.id)}
                  className="relative group focus:outline-none flex flex-col items-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <galaxy.Component 
                      className={`w-24 h-24 md:w-32 md:h-32 transition-all duration-300 drop-shadow-xl ${isSelected ? 'brightness-110 drop-shadow-[0_0_25px_rgba(167,139,250,0.6)]' : 'grayscale-[0.3] opacity-90 hover:grayscale-0 hover:opacity-100 hover:drop-shadow-[0_0_25px_rgba(167,139,250,0.6)]'}`} 
                    />
                    
                    {/* Checkmark Badge */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-lg z-10"
                        >
                          <Check size={20} strokeWidth={4} className="text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className={`block mt-4 text-center font-bold text-lg tracking-wide transition-colors ${isSelected ? 'text-textMain' : 'text-textLight group-hover:text-textMain'}`}>
                    {galaxy.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-center">
             <button 
                onClick={() => setIsTeachInputStep(true)}
                disabled={teachGalaxies.length === 0}
                className="px-12 py-4 rounded-2xl text-xl font-bold transition-all duration-300 shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none bg-slate-900 hover:bg-indigo-600 text-white shadow-indigo-200"
             >
                继续
             </button>
             <button
                onClick={onFinish}
                className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors tracking-wide hover:underline underline-offset-4"
             >
                暂时跳过
             </button>
          </div>
        </motion.div>
      );
    } else {
      // 2.2 Input Teach Skills
      const selectedLabels = galaxies.filter(g => teachGalaxies.includes(g.id)).map(g => g.label).join(', ');
      
      return (
        <div className="flex flex-col items-center justify-center h-screen px-6 animate-fadeIn w-full overflow-hidden relative">
             <NavButtons 
               onClose={onFinish} 
               showBack={false} // We have internal back button inside card
             />

            <div className="relative w-full max-w-xl mx-auto overflow-visible">
                {/* Mascot */}
                <div
                  className="absolute top-0 bottom-0 w-[320px] md:w-[380px] flex items-end justify-end z-0 animate-float"
                  style={{ right: '-190px' }}
                >
                  <img
                    src={mascotImage}
                    alt="SkillSwap mascot"
                    className="h-[85%] w-auto object-contain object-bottom drop-shadow-xl"
                    style={{ objectPosition: 'center bottom', transform: 'rotate(30deg)' }}
                  />
                </div>

                {/* Floating fish */}
                <FloatingFish className="pointer-events-none absolute -top-8 left-10 w-8 h-8 animate-float z-10" />
                <FloatingFish className="pointer-events-none absolute -top-12 right-20 w-6 h-6 animate-[float_8s_ease-in-out_infinite] z-10" />

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 w-full shadow-2xl relative border border-white/60 z-10">
                   {/* Internal Back Button (Keep as Change Galaxy icon or text) */}
                   <button 
                     onClick={() => setIsTeachInputStep(false)}
                     className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide"
                   >
                     <ArrowRight className="rotate-180 w-3 h-3" /> 更改星系
                   </button>
                   
                  <div className="flex items-center gap-4 mb-6 mt-4">
                    <div className="flex -space-x-3">
                        {teachGalaxies.map(gid => {
                           const g = galaxies.find(gl => gl.id === gid);
                           return (
                             <div key={gid} className="w-12 h-12 shrink-0 drop-shadow-md rounded-full bg-white/50 backdrop-blur-sm border border-white p-1">
                                {g && <g.Component className="w-full h-full" />}
                             </div>
                           )
                        })}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 leading-tight">我可以教...</h3>
                       <p className="text-slate-500 font-medium text-sm">添加最多3项你擅长的技能</p>
                    </div>
                  </div>

                  {/* Skills Display */}
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
                    {teachTags.map(s => (
                      <span key={s} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 animate-in fade-in zoom-in shadow-sm">
                        {s}
                        <button onClick={() => removeTeachTag(s)} className="hover:text-indigo-900 transition-colors"><X size={14}/></button>
                      </span>
                    ))}
                  </div>
                  
                  {/* Input */}
                  <div className="relative mb-6">
                     <input 
                       type="text" 
                       value={teachInputValue}
                       onChange={(e) => setTeachInputValue(e.target.value)}
                       onKeyDown={(e) => {
                          if (e.key === 'Enter' && teachInputValue.trim()) {
                             addTeachTag(teachInputValue.trim());
                          }
                       }}
                       placeholder={teachTags.length >= 3 ? "已达到最大3项技能" : "输入技能并回车"}
                       disabled={teachTags.length >= 3}
                       className="w-full bg-white border border-slate-200 focus:border-indigo-400 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all shadow-inner font-medium text-lg disabled:bg-slate-50 disabled:text-slate-400"
                       autoFocus
                     />
                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Plus className="text-slate-400" size={20} />
                     </div>
                  </div>

                  {/* Suggestions */}
                  <div className="mb-6">
                     <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">为你推荐</p>
                     <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                        {teachGalaxies.flatMap(gid => SUGGESTIONS[gid] || []).map((s, idx) => (
                           <button 
                             key={`${s}-${idx}`}
                             onClick={() => addTeachTag(s)}
                             disabled={teachTags.includes(s) || teachTags.length >= 3}
                             className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                           >
                             {s}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="flex justify-center">
                     <Button 
                        onClick={handleTeachSubmit}
                        variant="secondary"
                        size="lg"
                        disabled={teachTags.length === 0}
                        className="w-full shadow-lg shadow-purple-500/20 rounded-xl py-3 text-lg transition-all"
                     >
                        继续
                     </Button>
                  </div>
                </div>
            </div>
        </div>
      );
    }
  }

  // --- RENDER STEP 3: LEARNING GOAL ---
  if (step === 3) {
    if (!isLearnInputStep) {
      // 3.1 Select Target Galaxy
      return (
        <motion.div 
          className="flex flex-col items-center justify-center h-screen w-full max-w-5xl mx-auto px-4 overflow-hidden pt-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <NavButtons 
            onClose={onFinish} 
            onBack={() => { setStep(2); setIsTeachInputStep(true); }} 
            showBack={true} 
          />
          
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-textMain drop-shadow-sm font-heading">
              接下来你想学什么？
            </h2>
            <p className="text-textLight text-lg font-medium">选择星系以拓展视野</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-16 px-4">
            {galaxies.map((galaxy) => {
              const isSelected = learnGalaxies.includes(galaxy.id);
              return (
                <motion.button
                  key={galaxy.id}
                  onClick={() => handleLearnGalaxySelect(galaxy.id)}
                  className="relative group focus:outline-none flex flex-col items-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <galaxy.Component 
                      className={`w-24 h-24 md:w-32 md:h-32 transition-all duration-300 drop-shadow-xl ${isSelected ? 'brightness-110 drop-shadow-[0_0_25px_rgba(167,139,250,0.6)]' : 'grayscale-[0.3] opacity-90 hover:grayscale-0 hover:opacity-100 hover:drop-shadow-[0_0_25px_rgba(167,139,250,0.6)]'}`} 
                    />
                     {/* Checkmark Badge */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-lg z-10"
                        >
                          <Check size={20} strokeWidth={4} className="text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className={`block mt-4 text-center font-bold text-lg tracking-wide transition-colors ${isSelected ? 'text-textMain' : 'text-textLight group-hover:text-textMain'}`}>
                    {galaxy.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-center">
             <button 
                onClick={() => setIsLearnInputStep(true)}
                disabled={learnGalaxies.length === 0}
                className="px-12 py-4 rounded-2xl text-xl font-bold transition-all duration-300 shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none bg-slate-900 hover:bg-indigo-600 text-white shadow-indigo-200"
             >
                继续
             </button>
             <button
                onClick={onFinish}
                className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors tracking-wide hover:underline underline-offset-4"
             >
                暂时跳过
             </button>
          </div>
        </motion.div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-screen px-6 animate-fadeIn w-full overflow-hidden relative">
             <NavButtons 
               onClose={onFinish} 
               showBack={false} // Internal back used
             />

            <div className="relative w-full max-w-xl mx-auto overflow-visible">
                {/* Mascot */}
                <div
                  className="absolute top-0 bottom-0 w-[320px] md:w-[380px] flex items-end justify-end z-0 animate-float"
                  style={{ right: '-190px' }}
                >
                  <img
                    src={mascotImage}
                    alt="SkillSwap mascot"
                    className="h-[85%] w-auto object-contain object-bottom drop-shadow-xl"
                    style={{ objectPosition: 'center bottom', transform: 'rotate(30deg)' }}
                  />
                </div>
                
                {/* Floating fish */}
                <FloatingFish className="pointer-events-none absolute -top-8 left-10 w-8 h-8 animate-float z-10" />
                <FloatingFish className="pointer-events-none absolute -top-12 right-20 w-6 h-6 animate-[float_8s_ease-in-out_infinite] z-10" />

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 w-full shadow-2xl relative border border-white/60 z-10">
                   {/* Internal Back Button */}
                   <button 
                     onClick={() => setIsLearnInputStep(false)}
                     className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide"
                   >
                     <ArrowRight className="rotate-180 w-3 h-3" /> 更改星系
                   </button>
                  
                  <div className="flex items-center gap-4 mb-6 mt-4">
                    <div className="flex -space-x-3">
                        {learnGalaxies.map(gid => {
                           const g = galaxies.find(gl => gl.id === gid);
                           return (
                             <div key={gid} className="w-12 h-12 shrink-0 drop-shadow-md rounded-full bg-white/50 backdrop-blur-sm border border-white p-1">
                                {g && <g.Component className="w-full h-full" />}
                             </div>
                           )
                        })}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 leading-tight">我想学...</h3>
                       <p className="text-slate-500 font-medium text-sm">添加最多3项你想掌握的技能</p>
                    </div>
                  </div>

                  {/* Skills Display */}
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
                    {learnTags.map(s => (
                      <span key={s} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 animate-in fade-in zoom-in shadow-sm">
                        {s}
                        <button onClick={() => removeLearnTag(s)} className="hover:text-indigo-900 transition-colors"><X size={14}/></button>
                      </span>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="relative mb-6">
                     <input 
                       type="text" 
                       value={learnInputValue}
                       onChange={(e) => setLearnInputValue(e.target.value)}
                       onKeyDown={(e) => {
                          if (e.key === 'Enter' && learnInputValue.trim()) {
                             addLearnTag(learnInputValue.trim());
                          }
                       }}
                       placeholder={learnTags.length >= 3 ? "已达到最大3项技能" : "输入技能并回车"}
                       disabled={learnTags.length >= 3}
                       className="w-full bg-white border border-slate-200 focus:border-indigo-400 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all shadow-inner font-medium text-lg disabled:bg-slate-50 disabled:text-slate-400"
                       autoFocus
                     />
                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Plus className="text-slate-400" size={20} />
                     </div>
                  </div>

                  {/* Suggestions */}
                  <div className="mb-6">
                     <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">为你推荐</p>
                     <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                        {learnGalaxies.flatMap(gid => SUGGESTIONS[gid] || []).map((s, idx) => (
                           <button 
                             key={`${s}-${idx}`}
                             onClick={() => addLearnTag(s)}
                             disabled={learnTags.includes(s) || learnTags.length >= 3}
                             className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                           >
                             {s}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="flex justify-center">
                     <Button 
                        onClick={handleLearnSubmit}
                        variant="secondary"
                        size="lg"
                        disabled={learnTags.length === 0}
                        className="w-full shadow-lg shadow-purple-500/20 rounded-xl py-3 text-lg transition-all"
                     >
                        寻找匹配
                     </Button>
                  </div>
                </div>
            </div>
        </div>
      );
    }
  }

  // --- RENDER STEP 4: MATCHING & RESULT (Previously Step 3) ---
  if (step === 4) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 animate-fadeIn w-full">
        
        {isMatching ? (
          <div className="text-center">
             <div className="mb-10 relative inline-block">
                {/* Rocket Animation */}
                <div className="text-7xl animate-bounce relative z-10">🚀</div>
                {/* Engine Glow */}
                <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-20 h-32 bg-orange-400 rounded-full mix-blend-screen filter blur-xl opacity-80 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
             </div>
             <h2 className="text-3xl font-black text-textMain mb-3">正在扫描星系...</h2>
             <p className="text-textLight font-medium animate-pulse">正在分析附近的 12,403 个信号</p>
          </div>
        ) : (
          <div className="max-w-md w-full perspective-1000">
             {/* Match Card */}
             <div className="glass-panel p-2 rounded-[3rem] bg-gradient-to-br from-white/90 to-white/50 shadow-2xl animate-[blob_0.6s_cubic-bezier(0.34,1.56,0.64,1)] transform hover:scale-[1.02] transition-transform duration-500">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white">
                  
                  {/* Badge */}
                  <div className="flex justify-between items-start mb-8">
                     <div className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg shadow-emerald-200">
                        92% 匹配度
                     </div>
                     <div className="text-3xl animate-pulse">✨</div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex items-center gap-5 mb-8">
                     <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-xl">
                        <img src="https://picsum.photos/id/338/200/200" alt="Match" className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black text-textMain mb-1">Sarah J.</h3>
                        <div className="text-sm font-bold text-textLight flex items-center gap-1.5 bg-gray-100 py-1 px-3 rounded-full w-fit">
                          <Globe size={14} className="text-blue-500" /> 
                          <span>2.5公里外</span>
                        </div>
                     </div>
                  </div>

                  {/* AI Reason */}
                  <div className="bg-purple-50 rounded-3xl p-6 mb-8 relative border border-purple-100">
                     <div className="absolute -top-3 left-6 bg-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-purple-600 shadow-sm border border-purple-50">AI 洞察</div>
                     <p className="text-textMain font-medium text-base leading-relaxed mt-1">
                       "Sarah 是 <span className="font-bold text-purple-600 bg-purple-100 px-1 rounded">{learnTags[0] || '设计'}</span> 专家，并且一直想学 <span className="font-bold text-purple-600 bg-purple-100 px-1 rounded">{teachTags[0] || '编程'}</span>。你们都看重实践项目！"
                     </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                     <Button variant="secondary" onClick={onFinish} className="w-full rounded-2xl flex items-center justify-center gap-2 py-4 shadow-xl shadow-purple-900/10 transition-transform hover:scale-[1.02]">
                        <MessageCircle size={20} /> 向 Sarah 打招呼
                     </Button>
                     <button 
                        onClick={onFinish}
                        className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest hover:underline underline-offset-4"
                     >
                        以后再说
                     </button>
                  </div>

                </div>
             </div>
          </div>
        )}

      </div>
    );
  }

  return null;
};

export default Onboarding;