import React from 'react';
import { Testimonial } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const SocialProof: React.FC = () => {
  const { t } = useLanguage();

  // Similar to ValueProps, constructing array manually for simple i18n
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Alex",
      location: "Shanghai", // Leaving location/name static for now as they are proper nouns usually
      avatar: "https://picsum.photos/id/1012/200/200",
      text: t('social_proof.reviews.0.text'),
      skillIcon: "🐍"
    },
    {
      id: 2,
      name: "Sophia",
      location: "Milan",
      avatar: "https://picsum.photos/id/1027/200/200",
      text: t('social_proof.reviews.1.text'),
      skillIcon: "🇫🇷"
    },
    {
      id: 3,
      name: "Mike",
      location: "NYC",
      avatar: "https://picsum.photos/id/1005/200/200",
      text: t('social_proof.reviews.2.text'),
      skillIcon: "🎹"
    },
    {
      id: 4,
      name: "Yuki",
      location: "Tokyo",
      avatar: "https://picsum.photos/id/1011/200/200",
      text: t('social_proof.reviews.3.text'),
      skillIcon: "🎨"
    }
  ];

  return (
    <section id="community" className="py-20 relative z-10 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-textMain font-heading">{t('social_proof.title')}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 py-8 px-0 md:flex md:overflow-x-auto md:gap-6 md:py-12 md:px-8 md:snap-x md:snap-mandatory md:no-scrollbar w-full md:w-fit mx-auto max-w-full">
          {testimonials.map((item, index) => (
            <div 
              key={item.id} 
              className={`
                w-full md:w-[280px] md:flex-shrink-0 snap-center glass-panel p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] 
                transform transition-all duration-300 hover:scale-105 hover:bg-white/60
                ${index % 2 === 0 ? 'md:rotate-1' : 'md:-rotate-1'}
              `}
            >
                <div className="flex items-center gap-3 mb-4">
                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div>
                        <h4 className="font-bold text-textMain">{item.name}</h4>
                        <span className="text-xs font-bold text-textLight uppercase">{item.location}</span>
                    </div>
                    <div className="ml-auto text-2xl">{item.skillIcon}</div>
                </div>
                
                <p className="text-textMain font-medium leading-relaxed">
                    "{item.text}"
                </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;