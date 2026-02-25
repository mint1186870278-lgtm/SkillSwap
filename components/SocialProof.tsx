import React from 'react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex",
    location: "上海",
    avatar: "https://picsum.photos/id/1012/200/200",
    text: "学编程最轻松的方式。没压力，只有好氛围。",
    skillIcon: "🐍"
  },
  {
    id: 2,
    name: "Sophia",
    location: "米兰",
    avatar: "https://picsum.photos/id/1027/200/200",
    text: "学语言时在法国交了个死党。满分推荐。",
    skillIcon: "🇫🇷"
  },
  {
    id: 3,
    name: "Mike",
    location: "纽约",
    avatar: "https://picsum.photos/id/1005/200/200",
    text: "省了好多钱。用钢琴技能换设计帮助简直是作弊码。",
    skillIcon: "🎹"
  },
  {
    id: 4,
    name: "Yuki",
    location: "东京",
    avatar: "https://picsum.photos/id/1011/200/200",
    text: "这个社区的审美绝了。大家都很支持我。",
    skillIcon: "🎨"
  }
];

const SocialProof: React.FC = () => {
  return (
    <section id="community" className="py-20 relative z-10 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-textMain font-heading">社区氛围</h2>
        </div>

        {/* Scroll Container 
            - Added `w-fit mx-auto max-w-full`: Centers the row if it fits on screen, allows scroll if it doesn't.
            - Increased vertical padding to `py-12`: Prevents hover effects from being cut off at the top.
            - Added `px-8`: Ensures first/last cards have breathing room.
        */}
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