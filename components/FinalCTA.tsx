import React from 'react';
import Button from './Button';
import { useLanguage } from '../contexts/LanguageContext';

interface FinalCTAProps {
  onStart?: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onStart }) => {
  const { t } = useLanguage();

  const tags = [
    t('final_cta.tags.0'),
    t('final_cta.tags.1'),
    t('final_cta.tags.2')
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="relative rounded-[3rem] overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 p-12 text-center shadow-glass group">
          
          {/* Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-pastelPink/30 via-pastelPurple/30 to-pastelBlue/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-textMain mb-6 font-heading whitespace-pre-line">
              {t('final_cta.title')}
            </h2>
            <p className="text-textLight text-lg mb-8 font-medium max-w-lg mx-auto">
              {t('final_cta.subtitle')}
            </p>
            
            <Button onClick={onStart} variant="secondary" size="lg" className="rounded-full shadow-2xl scale-110">
              {t('final_cta.button')}
            </Button>

            <div className="mt-8 flex justify-center gap-4 opacity-50">
               {tags.map((tag, i) => (
                 <span key={i}>{tag}</span>
               ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalCTA;