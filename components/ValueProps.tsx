import React from 'react';
import { ValueProp } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const ValueProps: React.FC = () => {
  const { t, language } = useLanguage();

  // In a real app, this would also come from translation files via arrays,
  // but for simplicity with our structure, we'll map manually or rely on the structure.
  // Since our t() helper supports simple strings, we'll construct the array here.
  // A better way is t('value_props.items', { returnObjects: true }) if i18n lib supports it.
  // Our simple helper doesn't, so we'll hardcode the structure mapping.
  
  const values: ValueProp[] = [
    {
      id: 1,
      icon: "🧠",
      title: t('value_props.items.0.title') as string,
      description: t('value_props.items.0.desc') as string,
      color: "bg-pastelPurple"
    },
    {
      id: 2,
      icon: "✨",
      title: t('value_props.items.1.title') as string,
      description: t('value_props.items.1.desc') as string,
      color: "bg-pastelPink"
    },
    {
      id: 3,
      icon: "🌏",
      title: t('value_props.items.2.title') as string,
      description: t('value_props.items.2.desc') as string,
      color: "bg-pastelBlue"
    }
  ];

  return (
    <section id="about" className="py-20 relative z-10 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-textMain mb-4 font-heading">
            {t('value_props.title')}
          </h2>
          <p className="text-lg text-textLight">
            {t('value_props.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((item, index) => (
            <div
              key={item.id}
              className="glass-panel p-8 rounded-[2.5rem] hover:bg-white/40 transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 ${item.color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-textMain">{item.title}</h3>
              <p className="text-textLight leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;