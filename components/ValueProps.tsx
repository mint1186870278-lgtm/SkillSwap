import React from 'react';
import { ValueProp } from '../types';

const values: ValueProp[] = [
  {
    id: 1,
    icon: "🧠",
    title: "灵魂契合",
    description: "Gemini AI 感知你的学习风格，为你匹配技能灵魂伴侣。",
    color: "bg-pastelPurple"
  },
  {
    id: 2,
    icon: "✨",
    title: "光环徽章",
    description: "收集精美的 NFT 徽章，映照你不断增长的技能光环。",
    color: "bg-pastelPink"
  },
  {
    id: 3,
    icon: "🌏",
    title: "全球圈子",
    description: "加入一个安全、温馨的学习圈子，连接来自世界各地的伙伴。",
    color: "bg-pastelBlue"
  }
];

const ValueProps: React.FC = () => {
  return (
    <section id="about" className="py-20 relative z-10 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-textMain mb-4 font-heading">
            你的成长避风港
          </h2>
          <p className="text-lg text-textLight">
            学习不应充满压力。我们保留了良好的氛围，去除了价格标签。
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