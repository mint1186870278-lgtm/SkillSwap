import React from 'react';

const ProductPreview: React.FC = () => {
  return (
    <section id="explore" className="py-24 relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
          
          {/* Text Info */}
          <div className="flex-1 max-w-lg">
             <div className="inline-block px-4 py-1 rounded-full bg-pastelYellow/50 border border-pastelYellow text-yellow-700 font-bold text-xs uppercase tracking-wider mb-6">
                简单流程
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-textMain mb-8 font-heading leading-tight">
                专为 <br/> <span className="text-purple-500">安心设计。</span>
             </h2>
             <div className="space-y-8">
                {[
                    { title: "设定目标", desc: "告诉我们要学什么。" },
                    { title: "找到节奏", desc: "滑动匹配合拍伙伴。" },
                    { title: "共同成长", desc: "聊天、视频、交换智慧。" }
                ].map((step, i) => (
                    <div key={i} className="flex gap-6 group cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-white/50 border border-white flex items-center justify-center font-bold text-textMain shadow-sm group-hover:bg-pastelBlue group-hover:text-white transition-colors">
                            {i+1}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-textMain mb-1">{step.title}</h3>
                            <p className="text-textLight font-medium">{step.desc}</p>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* Phone Mockup - Meditation Style */}
          <div className="relative">
             {/* Phone Container */}
             <div className="relative w-[320px] h-[640px] bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[3rem] shadow-glass p-4 overflow-hidden">
                 
                 {/* Top Bar */}
                 <div className="flex justify-between items-center mb-6 px-2 pt-2">
                     <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">🍔</div>
                     <div className="font-bold text-textMain">SkillSwap</div>
                     <div className="w-8 h-8 rounded-full bg-pastelPurple"></div>
                 </div>

                 {/* "Good Morning" Card */}
                 <div className="bg-white/60 rounded-[2rem] p-6 mb-4 text-center shadow-sm">
                     <div className="text-xs font-bold text-textLight uppercase mb-1">每日洞察</div>
                     <h3 className="text-xl font-bold text-textMain mb-4">准备好学吉他了吗？</h3>
                     
                     <div className="flex justify-center items-center gap-4 mb-4">
                         <div className="w-16 h-16 rounded-full bg-pastelPink flex items-center justify-center text-2xl animate-bounce">🎸</div>
                         <div className="text-2xl text-textLight">↔️</div>
                         <div className="w-16 h-16 rounded-full bg-pastelBlue flex items-center justify-center text-2xl">💻</div>
                     </div>
                     <div className="bg-textMain text-white rounded-full py-2 px-4 text-sm font-bold shadow-lg">
                        开始会话
                     </div>
                 </div>

                 {/* Stats Row */}
                 <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-pastelGreen/40 p-4 rounded-[2rem]">
                        <div className="text-2xl mb-1">🔥</div>
                        <div className="font-bold text-textMain">3 天</div>
                        <div className="text-xs text-textMain opacity-60">连胜</div>
                    </div>
                    <div className="bg-pastelYellow/40 p-4 rounded-[2rem]">
                        <div className="text-2xl mb-1">⭐</div>
                        <div className="font-bold text-textMain">5 级</div>
                        <div className="text-xs text-textMain opacity-60">探索者</div>
                    </div>
                 </div>

                 {/* List */}
                 <div className="space-y-2">
                    <div className="bg-white/50 p-3 rounded-[1.5rem] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div className="flex-1">
                            <div className="font-bold text-sm text-textMain">与 Kai 的课程</div>
                            <div className="text-xs text-textLight">今天, 下午 4:00</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 text-xs font-bold">GO</div>
                    </div>
                 </div>

                 {/* Bottom Nav */}
                 <div className="absolute bottom-4 left-4 right-4 h-16 bg-white/80 backdrop-blur-md rounded-[2rem] flex justify-around items-center px-2 shadow-lg">
                    <div className="text-xl">🏠</div>
                    <div className="text-xl opacity-50">🔍</div>
                    <div className="text-xl opacity-50">👤</div>
                 </div>

             </div>

             {/* Floating Decor behind phone */}
             <div className="absolute top-20 -right-10 w-20 h-20 bg-pastelPink rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
             <div className="absolute bottom-20 -left-10 w-24 h-24 bg-pastelBlue rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-2000"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductPreview;