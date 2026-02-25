import React from 'react';
import Button from './Button';

interface FinalCTAProps {
  onStart?: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onStart }) => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="relative rounded-[3rem] overflow-hidden bg-white/30 backdrop-blur-xl border border-white/50 p-12 text-center shadow-glass group">
          
          {/* Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-pastelPink/30 via-pastelPurple/30 to-pastelBlue/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-textMain mb-6 font-heading">
              准备好找到 <br/> 你的伙伴了吗？
            </h2>
            <p className="text-textLight text-lg mb-8 font-medium max-w-lg mx-auto">
              加入互联网上最温柔、最友好的学习角落。
            </p>
            
            <Button onClick={onStart} variant="secondary" size="lg" className="rounded-full shadow-2xl scale-110">
              🚀 加入圈子
            </Button>

            <div className="mt-8 flex justify-center gap-4 opacity-50">
               <span>🌱 永久免费</span>
               <span>✨ 无广告</span>
               <span>🤝 真人互动</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalCTA;