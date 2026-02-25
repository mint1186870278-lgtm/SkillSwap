import React from 'react';
import { ValueProp } from '../types';

const values: ValueProp[] = [
  {
    id: 1,
    icon: "🧠",
    title: "Vibe Match",
    description: "Gemini AI senses your learning style and pairs you with your skill soulmate.",
    color: "bg-pastelPurple"
  },
  {
    id: 2,
    icon: "✨",
    title: "Aura Badges",
    description: "Collect beautiful NFT badges that reflect your growing skill aura.",
    color: "bg-pastelPink"
  },
  {
    id: 3,
    icon: "🌏",
    title: "Global Circle",
    description: "Join a safe, cozy circle of learners from every corner of the planet.",
    color: "bg-pastelBlue"
  }
];

const ValueProps: React.FC = () => {
  return (
    <section id="about" className="py-20 relative z-10 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-textMain mb-4 font-heading">
            Your Safe Space to Grow
          </h2>
          <p className="text-lg text-textLight">
            Learning shouldn't be stressful. We kept the good vibes and removed the price tags.
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