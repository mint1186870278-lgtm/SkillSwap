import React from 'react';
import Button from './Button';
import { Globe, Dumbbell, Rocket, Palette, Compass } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onStart?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const { t, language } = useLanguage();

  const skills = [
    { icon: Globe, label: t('hero.skills.language'), color: 'bg-pastelBlue', delay: '0s' },
    { icon: Dumbbell, label: t('hero.skills.fitness'), color: 'bg-pastelPink', delay: '0.1s' },
    { icon: Rocket, label: t('hero.skills.tech'), color: 'bg-pastelPurple', delay: '0.2s' },
    { icon: Palette, label: t('hero.skills.design'), color: 'bg-pastelYellow', delay: '0.3s' },
    { icon: Compass, label: t('hero.skills.other'), color: 'bg-pastelGreen', delay: '0.4s' }
  ];

  // Adjust font size for Chinese to prevent it from looking too large/overwhelming
  // User requested ~0.5 font size difference
  // English: text-4xl (2.25rem), text-6xl (3.75rem), text-7xl (4.5rem)
  const titleSizeClass = language === 'zh' 
    ? 'text-[2.1rem] md:text-[3.4rem] lg:text-[4.2rem]' 
    : 'text-4xl md:text-6xl lg:text-7xl';

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-16 pb-8 overflow-hidden">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          <h1 className={`${titleSizeClass} font-extrabold mb-4 text-textMain font-heading tracking-tight drop-shadow-sm leading-[1.1]`}>
            {t('hero.title_prefix')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 animate-pulse">
              {t('hero.title_suffix')}
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-8 text-textLight max-w-2xl font-medium leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Interactive "Galaxy" Tracker for Skills */}
          <div className="glass-panel p-2 rounded-[2.5rem] flex flex-wrap justify-center gap-3 mb-10 shadow-2xl max-w-2xl w-full">
             {skills.map((skill, i) => (
               <button 
                 key={i} 
                 className="group relative flex flex-col items-center justify-center w-20 h-28 md:w-28 md:h-36 rounded-[2rem] hover:bg-white transition-all duration-300 hover:scale-110 focus:outline-none focus:scale-110"
                 style={{ animationDelay: skill.delay }}
               >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${skill.color} flex items-center justify-center text-textMain shadow-sm mb-2 group-hover:shadow-md transition-all`}>
                    <skill.icon size={24} strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-textMain text-xs md:text-sm opacity-70 group-hover:opacity-100 transition-opacity">{skill.label}</span>
                  
                  {/* Selection Indicator - Absolute positioning to prevent layout shift */}
                  <div className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-textMain opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </button>
             ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onStart} variant="secondary" size="lg" className="rounded-full px-10 py-3 text-base">
              {t('hero.start_button')}
            </Button>
          </div>

          {/* Floating UI Elements Decor */}
          <div className="absolute top-1/2 left-4 md:left-20 -translate-y-1/2 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
             <div className="glass-panel p-4 rounded-3xl flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-pastelBlue flex items-center justify-center text-textMain">
                  <Globe size={20} />
               </div>
               <div>
                 <div className="text-xs font-bold text-textLight">{t('hero.float_match')}</div>
                 <div className="text-sm font-bold text-textMain">{t('hero.float_match_text')}</div>
               </div>
             </div>
          </div>

          <div className="absolute top-1/3 right-4 md:right-20 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
             <div className="glass-panel p-4 rounded-3xl text-center w-40">
               <div className="text-xs font-bold text-textLight mb-2">{t('hero.float_goal')}</div>
               <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden mb-1">
                 <div className="w-[80%] h-full bg-pastelPink rounded-full"></div>
               </div>
               <div className="text-right text-xs font-bold text-textMain">80%</div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;