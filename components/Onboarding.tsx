import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SignInButton } from '@clerk/nextjs';
import Button from './Button';
import { Globe, Dumbbell, Rocket, Palette, CheckCircle2, Search, Sparkles, MessageCircle, ArrowRight, Check, X, Plus, Languages, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUserSkills } from '../contexts/UserSkillsContext';
import { PlanetLanguage, PlanetFitness, PlanetTech, PlanetDesign, PlanetDiscovery } from './PlanetIcons';
import { SUGGESTIONS } from '../lib/skills-config';

const ONBOARDING_RETURN_KEY = 'skillswap_return_to_onboarding_step';
const mascotImage = "/Gemini_Generated_Image.png";

interface OnboardingProps {
  onFinish: () => void;
  initialStep?: 1 | 2 | 3 | 4;
  onMockPage?: () => void;
}


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
const NavButtons = ({ onBack, onClose, showBack = true }: { onBack?: () => void, onClose: () => void, showBack?: boolean }) => {
  const { language, setLanguage } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang: 'en' | 'zh') => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-6 md:p-8">
      <div className="relative w-full h-full flex justify-between items-start pointer-events-auto">
        {showBack ? (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 tracking-widest uppercase transition-colors"
          >
            <ArrowRight className="rotate-180 w-4 h-4" /> Back
          </button>
        ) : <div></div>}
        
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative" ref={langMenuRef}>
             <button 
               onClick={() => setLangMenuOpen(!langMenuOpen)}
               className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 font-bold transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
             >
               <Languages size={18} />
               <ChevronDown size={14} className={`transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
             </button>
             
             {langMenuOpen && (
               <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden z-[100]">
                 <button
                   onClick={() => handleLanguageSelect('en')}
                   className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between transition-colors ${language === 'en' ? 'text-purple-600 font-bold bg-purple-50/50' : 'text-slate-700'}`}
                 >
                   <span>English</span>
                   {language === 'en' && <Check size={14} />}
                 </button>
                 <button
                   onClick={() => handleLanguageSelect('zh')}
                   className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between transition-colors ${language === 'zh' ? 'text-purple-600 font-bold bg-purple-50/50' : 'text-slate-700'}`}
                 >
                   <span>中文</span>
                   {language === 'zh' && <Check size={14} />}
                 </button>
               </div>
             )}
          </div>

          <button 
            onClick={onClose}
            className="text-sm font-bold text-slate-400 hover:text-slate-600 tracking-widest uppercase transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

const Onboarding: React.FC<OnboardingProps> = ({ onFinish, initialStep, onMockPage }) => {
  const { t } = useLanguage();
  const { setSkills } = useUserSkills();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialStep ?? 1);

  const handleLoginClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(ONBOARDING_RETURN_KEY, '2');
    }
  };

  useEffect(() => {
    if (initialStep != null) {
      setStep(initialStep);
    }
  }, [initialStep]);
  
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
    { id: 'language', label: t('hero.skills.language'), Component: PlanetLanguage },
    { id: 'fitness', label: t('hero.skills.fitness'), Component: PlanetFitness },
    { id: 'tech', label: t('hero.skills.tech'), Component: PlanetTech },
    { id: 'design', label: t('hero.skills.design'), Component: PlanetDesign },
    { id: 'other', label: t('hero.skills.other'), Component: PlanetDiscovery }
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
            {t('onboarding.welcome')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">SkillSwap</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 font-medium mb-6 leading-relaxed whitespace-pre-line">
            {t('onboarding.subtitle')}
          </p>

          {/* 登录 - 与 Landing 页共用同一套 Clerk 登录弹窗 */}
          <div className="w-full mb-4">
            <SignInButton mode="modal">
              <button
                onClick={handleLoginClick}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md"
              >
                 <Sparkles size={20} className="text-indigo-500" />
                 {t('onboarding.login')}
              </button>
            </SignInButton>
          </div>

          <div className="relative w-full flex items-center justify-center py-2 mb-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white/50 px-4 text-xs text-slate-400 font-bold uppercase tracking-wider backdrop-blur-sm">{t('onboarding.no_account')}</span>
          </div>

          {/* Guest Mode CTA */}
          <button 
            onClick={() => setStep(2)}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 text-lg group transition-all"
          >
            {t('onboarding.guest')}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          {onMockPage && (
            <button 
              onClick={onMockPage}
              className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
            >
              {t('hero.mock_page')}
            </button>
          )}

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
              {t('onboarding.step2_title')}
            </h2>
            <p className="text-textLight text-lg font-medium">{t('onboarding.step2_subtitle')}</p>
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
                {t('onboarding.continue')}
             </button>
             <button
                onClick={onFinish}
                className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors tracking-wide hover:underline underline-offset-4"
             >
                {t('onboarding.skip')}
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
                     <ArrowRight className="rotate-180 w-3 h-3" /> Change Galaxy
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
                       <h3 className="text-2xl font-black text-slate-900 leading-tight">{t('onboarding.teach_input_title')}</h3>
                       <p className="text-slate-500 font-medium text-sm">Add up to 3 skills you're great at</p>
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
                       placeholder={teachTags.length >= 3 ? "Max 3 skills reached" : t('onboarding.teach_input_ph')}
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
                     <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">{t('onboarding.suggested')}</p>
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
                        {t('onboarding.continue')}
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
              {t('onboarding.step3_title')}
            </h2>
            <p className="text-textLight text-lg font-medium">{t('onboarding.step3_subtitle')}</p>
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
                {t('onboarding.continue')}
             </button>
             <button
                onClick={onFinish}
                className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors tracking-wide hover:underline underline-offset-4"
             >
                {t('onboarding.skip')}
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
                     <ArrowRight className="rotate-180 w-3 h-3" /> Change Galaxy
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
                       <h3 className="text-2xl font-black text-slate-900 leading-tight">{t('onboarding.learn_input_title')}</h3>
                       <p className="text-slate-500 font-medium text-sm">Add up to 3 skills you want to master</p>
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
                       placeholder={learnTags.length >= 3 ? "Max 3 skills reached" : t('onboarding.learn_input_ph')}
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
                     <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">{t('onboarding.suggested')}</p>
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
                        {t('onboarding.continue')}
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
             <h2 className="text-3xl font-black text-textMain mb-3">{t('onboarding.scanning')}</h2>
             <p className="text-textLight font-medium animate-pulse">{t('onboarding.analyzing')}</p>
          </div>
        ) : (
          <div className="max-w-md w-full perspective-1000">
             {/* Match Card */}
             <div className="glass-panel p-2 rounded-[3rem] bg-gradient-to-br from-white/90 to-white/50 shadow-2xl animate-[blob_0.6s_cubic-bezier(0.34,1.56,0.64,1)] transform hover:scale-[1.02] transition-transform duration-500">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white">
                  
                  {/* Badge */}
                  <div className="flex justify-between items-start mb-8">
                     <div className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg shadow-emerald-200">
                        {t('onboarding.match_badge')}
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
                          <span>2.5km away</span>
                        </div>
                     </div>
                  </div>

                  {/* AI Reason */}
                  <div className="bg-purple-50 rounded-3xl p-6 mb-8 relative border border-purple-100">
                     <div className="absolute -top-3 left-6 bg-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-purple-600 shadow-sm border border-purple-50">{t('onboarding.ai_insight')}</div>
                     <p className="text-textMain font-medium text-base leading-relaxed mt-1">
                       "{t('onboarding.insight_text')}"
                     </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                     <Button variant="secondary" onClick={() => { setSkills({ teachGalaxies, teachTags, learnGalaxies, learnTags }); onFinish(); }} className="w-full rounded-2xl flex items-center justify-center gap-2 py-4 shadow-xl shadow-purple-900/10 transition-transform hover:scale-[1.02]">
                        <MessageCircle size={20} /> {t('onboarding.say_hi')}
                     </Button>
                     <button 
                        onClick={() => { setSkills({ teachGalaxies, teachTags, learnGalaxies, learnTags }); onFinish(); }}
                        className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest hover:underline underline-offset-4"
                     >
                        {t('onboarding.maybe_later')}
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