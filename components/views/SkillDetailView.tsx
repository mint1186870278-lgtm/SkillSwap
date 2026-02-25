import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MessageCircle, MapPin, Star, Shield, 
  ChevronLeft, Video, Play, Globe, CheckCircle2, Heart,
  Languages, GraduationCap, ChevronRight, Zap
} from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { fetchSimilarExperts } from '../../lib/api-client';

interface SkillDetailProps {
  onBack: () => void;
  item: any;
}

const SkillDetailView: React.FC<SkillDetailProps> = ({ onBack, item }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'teacher' | 'lessons'>('about');
  const [similarExperts, setSimilarExperts] = useState<any[]>([]);

  useEffect(() => {
    fetchSimilarExperts().then(setSimilarExperts).catch(console.error);
  }, []);

  // Fallbacks if item is missing properties (for safety)
  const user = item?.user || 'Elena Rodriguez';
  const avatar = item?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';
  const image = item?.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
  const title = item?.title || 'Conversational Spanish & Culture';
  const rating = item?.rating || 4.9;
  const lessons = item?.lessons || 843;
  const price = item?.price || 1;
  const speaks = item?.speaks || 'Spanish';
  const description = item?.description || "Hola! I'm a native teacher with a passion for sharing my language and culture. I have over 5 years of experience teaching students from all over the world.";

  const getLessonContent = (type: string, speaks: string) => {
    switch(type) {
      case 'Fitness':
        return [
          { title: 'Intro to Yoga', subtitle: 'Beginner Friendly', badge: '1 Credit' },
          { title: 'Vinyasa Flow', subtitle: 'Intermediate', badge: '2 Credits', details: 'Breathing & Posture' }
        ];
      case 'Tech':
        return [
          { title: 'Code Review', subtitle: 'React & TS', badge: '1 Credit' },
          { title: 'Project Planning', subtitle: 'Architecture', badge: '2 Credits', details: 'System Design' }
        ];
      case 'Cooking':
        return [
          { title: 'Knife Skills', subtitle: 'Basics', badge: '1 Credit' },
          { title: 'Full Course Meal', subtitle: 'Advanced', badge: '2 Credits', details: 'Plating & Timing' }
        ];
      case 'Art':
        return [
            { title: 'Sketching Basics', subtitle: 'Pencil & Charcoal', badge: '1 Credit' },
            { title: 'Color Theory', subtitle: 'Watercolor', badge: '2 Credits', details: 'Composition' }
        ];
      default: // Language
        return [
          { title: 'Trial Lesson', subtitle: '150 lessons completed', badge: '1 Credit' },
          { title: `Conversational ${speaks}`, subtitle: 'A2 - C1', badge: '2 Credits', details: 'Speaking' }
        ];
    }
  };

  const lessonContent = getLessonContent(item?.type, speaks);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Top Navigation Bar (Within View) */}
      <div className="flex items-center gap-4 px-6 lg:px-10 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 shrink-0 z-20">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
          <ChevronLeft size={18} /> Back
        </button>
        <div className="h-4 w-[1px] bg-slate-200"></div>
        <span className="font-bold text-slate-800">Teacher Profile</span>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="w-full px-6 lg:px-10 py-8">
          
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start mb-12">
            
            {/* LEFT COLUMN: Main Profile Info */}
            <div className="space-y-6">
              
              {/* 1. Header Section */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6">
                    <button className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-colors">
                       <Heart size={24} />
                    </button>
                 </div>

                 <div className="flex gap-6">
                    <div className="relative shrink-0">
                       <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                          <ImageWithFallback src={avatar} alt={user} className="w-full h-full object-cover" />
                       </div>
                       <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-lg">
                          🇪🇸
                       </div>
                    </div>
                    
                    <div className="flex-1 pt-1">
                       <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-2xl font-black text-slate-900">{user}</h1>
                          <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded tracking-wider">PLUS+</span>
                          <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                             <CheckCircle2 size={12} /> Verified
                          </span>
                       </div>
                       
                       <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-600 mb-4">
                          <div className="flex items-center gap-2">
                             <span className="text-slate-400">Teaches</span>
                             <span className="font-bold text-slate-800">{speaks}</span>
                             <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">Native</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-slate-400">Speaks</span>
                             <div className="flex items-center gap-1">
                                <span className="font-medium">English</span>
                                <div className="flex gap-[1px] h-3 items-end"><div className="w-1 h-2 bg-green-400 rounded-sm"></div><div className="w-1 h-3 bg-green-400 rounded-sm"></div><div className="w-1 h-3 bg-green-400 rounded-sm"></div><div className="w-1 h-3 bg-slate-200 rounded-sm"></div></div>
                             </div>
                          </div>
                       </div>

                       <h2 className="font-bold text-slate-700 text-lg">{title} | Fun & Engaging</h2>
                    </div>
                 </div>

                 {/* Stats Row */}
                 <div className="mt-8 grid grid-cols-4 divide-x divide-slate-100 border-t border-slate-100 pt-6">
                    <div className="text-center px-2">
                       <div className="flex items-center justify-center gap-1 font-black text-slate-900 text-lg">
                          <Star size={18} className="fill-yellow-400 text-yellow-400" /> {rating}
                       </div>
                       <div className="text-xs text-slate-400 font-medium mt-1">Rating</div>
                    </div>
                    <div className="text-center px-2">
                       <div className="font-black text-slate-900 text-lg">843</div>
                       <div className="text-xs text-slate-400 font-medium mt-1">Students</div>
                    </div>
                    <div className="text-center px-2">
                       <div className="font-black text-slate-900 text-lg">{lessons}</div>
                       <div className="text-xs text-slate-400 font-medium mt-1">Lessons</div>
                    </div>
                    <div className="text-center px-2">
                       <div className="font-black text-slate-900 text-lg">99%</div>
                       <div className="text-xs text-slate-400 font-medium mt-1">Attendance</div>
                    </div>
                 </div>
              </div>

              {/* 2. Tabs Navigation */}
              <div className="flex items-center gap-8 border-b border-slate-200">
                 {['About Me', 'Me as a Teacher', 'My Lessons'].map((tab) => (
                    <button 
                       key={tab}
                       className="pb-4 text-sm font-bold text-slate-500 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300 transition-all first:text-indigo-600 first:border-indigo-600"
                    >
                       {tab}
                    </button>
                 ))}
              </div>

              {/* 3. About Section */}
              <div className="space-y-6">
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} />
                    <span>Living in <strong className="text-slate-700">Madrid, Spain</strong> (14:20 UTC+02:00)</span>
                 </div>

                 <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-bold text-slate-400 mr-2 py-1">Interests</span>
                    {['Travel', 'Cooking', 'Music', 'History', 'Cinema'].map(tag => (
                       <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full hover:bg-slate-200 cursor-default transition-colors">
                          {tag}
                       </span>
                    ))}
                 </div>

                 <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed">
                    <p>
                       {description}
                    </p>
                    <p>
                       My lessons are focused on conversation and building confidence. We'll talk about real-life topics, culture, and current events. I believe that learning a language should be fun and immersive!
                    </p>
                    <button className="text-indigo-600 font-bold hover:underline">Read more</button>
                 </div>
              </div>

              {/* 4. Lessons List */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="font-black text-lg text-slate-800">{item?.type === 'Language' ? `${speaks} Lessons` : 'Available Sessions'}</h3>
                 </div>
                 <div className="divide-y divide-slate-100">
                    {/* Lesson Item 1 */}
                    <div className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group cursor-pointer">
                       <div>
                          <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors">{lessonContent[0].title}</h4>
                          <p className="text-sm text-slate-400 italic">{lessonContent[0].subtitle}</p>
                       </div>
                       <div className="bg-rose-50 text-rose-600 px-6 py-2 rounded-xl font-black text-sm border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
                          {lessonContent[0].badge}
                       </div>
                    </div>
                    {/* Lesson Item 2 */}
                    <div className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group cursor-pointer">
                       <div>
                          <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors">{lessonContent[1].title}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                             <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded text-xs">{lessonContent[1].subtitle}</span>
                             {lessonContent[1].details && (
                                <>
                                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                   <span>{lessonContent[1].details}</span>
                                </>
                             )}
                             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                             <span className="italic text-slate-400">Popular</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl font-black text-sm group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all shadow-sm">
                             {lessonContent[1].badge}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 font-medium">Package with <span className="text-green-600">10% off</span></div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* 5. Calendar / Availability */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                 <h3 className="font-black text-lg text-slate-800 mb-6">Availability</h3>
                 <div className="mb-4 flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Available</span>
                    <span className="text-teal-600 font-bold">18:00 Today</span>
                 </div>
                 
                 {/* Mock Calendar Grid */}
                 <div className="w-full overflow-x-auto pb-2">
                    <div className="min-w-[500px]">
                       <div className="grid grid-cols-8 gap-1 mb-2 text-center">
                          <div className="text-xs font-bold text-slate-400"></div>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                             <div key={day} className="text-xs font-bold text-slate-600">
                                {day} <br/> <span className="text-slate-400 font-normal">{9 + i}</span>
                             </div>
                          ))}
                       </div>
                       {[
                          '08 - 12', '12 - 16', '16 - 20', '20 - 24'
                       ].map((time, rowIdx) => (
                          <div key={time} className="grid grid-cols-8 gap-1 h-8 mb-1">
                             <div className="text-[10px] font-medium text-slate-400 flex items-center justify-end pr-2">{time}</div>
                             {[...Array(7)].map((_, colIdx) => {
                                // Random availability generation for visual mock
                                const isAvailable = (rowIdx % 2 === 0 && colIdx % 2 !== 0) || (colIdx === 3);
                                return (
                                   <div 
                                      key={colIdx} 
                                      className={`rounded-md ${isAvailable ? 'bg-green-400/80 cursor-pointer hover:bg-green-500' : 'bg-slate-50 border border-slate-100'}`}
                                   ></div>
                                );
                             })}
                          </div>
                       ))}
                    </div>
                 </div>
                 <button className="w-full mt-6 py-3 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                    View Full Schedule
                 </button>
              </div>
              
              {/* 6. Reviews */}
              <div>
                 <h3 className="font-black text-2xl text-slate-800 mb-6">150 Reviews</h3>
                 <div className="flex flex-wrap gap-3 mb-8">
                    {['Patient · 3', 'Fun lessons · 5', 'Great accent · 4', 'Beginner friendly · 9'].map(tag => (
                       <span key={tag} className="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-400 cursor-pointer transition-colors bg-white">
                          {tag}
                       </span>
                    ))}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Review 1 */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 relative group hover:shadow-md transition-shadow">
                       <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl">Teacher's pick</div>
                       <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                             <ImageWithFallback src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Reviewer" className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-800 text-sm">Mike</h4>
                             <p className="text-xs text-slate-500">24 {speaks} lessons</p>
                          </div>
                       </div>
                       <p className="text-sm text-slate-600 leading-relaxed mb-3">
                          {user.split(' ')[0]} is amazing! I learned so much in just a few lessons. She makes learning fun and easy.
                       </p>
                       <span className="text-xs text-slate-400 font-medium">Jan 28, 2026</span>
                    </div>

                    {/* Review 2 */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 relative group hover:shadow-md transition-shadow">
                       <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                             <ImageWithFallback src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Reviewer" className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-800 text-sm">Sarah</h4>
                             <p className="text-xs text-slate-500">12 {speaks} lessons</p>
                          </div>
                       </div>
                       <p className="text-sm text-slate-600 leading-relaxed mb-3">
                          Great conversation practice. {user.split(' ')[0]} is very patient and corrects my mistakes gently.
                       </p>
                       <span className="text-xs text-slate-400 font-medium">Jan 31, 2026</span>
                    </div>
                 </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky Booking Card */}
            <div className="hidden xl:block sticky top-6 space-y-4">
               
               {/* Video Card */}
               <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                  <div className="relative h-56 bg-slate-900 group cursor-pointer">
                     <ImageWithFallback src={image} alt="Video Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                           <Play size={24} className="fill-white text-white ml-1" />
                        </div>
                     </div>
                  </div>

                  <div className="p-6">
                     <div className="flex justify-between items-baseline mb-6">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                           Intro Session <span className="text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5"><Languages size={12}/></span>
                        </h3>
                        <span className="text-2xl font-black text-slate-900">{price} Credit</span>
                     </div>
                     
                     <div className="space-y-3">
                        <button className="w-full py-3.5 bg-rose-500 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-[0.98]">
                           Request Swap
                        </button>
                        <button className="w-full py-3.5 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 border border-slate-200 transition-colors">
                           Contact Teacher
                        </button>
                     </div>

                     <div className="mt-6 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                           <Clock size={14} /> <span>Response time: <b className="text-slate-700">~1 hour</b></span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                           <Zap size={14} /> <span>Instant booking available</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Trust Card */}
               <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-slate-100 text-xs text-slate-500 text-center">
                  <p className="flex items-center justify-center gap-2 mb-1 font-bold text-slate-700">
                     <Shield size={14} className="text-green-500"/> SkillSwap Guarantee
                  </p>
                  Free cancellation up to 24 hours before
               </div>
            </div>

          </div>

          {/* SIMILAR TEACHERS SECTION */}
             <div className="border-t border-slate-200 pt-10">
             <h3 className="text-xl font-black text-slate-900 mb-6">Explore Similar Experts</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarExperts.map((teacher, i) => (
                   <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                      <div className="relative h-48 bg-slate-900">
                         <ImageWithFallback src={teacher.image} alt={teacher.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/50">
                               <Play size={20} className="fill-white text-white ml-1" />
                            </div>
                         </div>
                         <div className="absolute bottom-3 right-3 text-white text-[10px] font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                            Professional Teacher
                         </div>
                      </div>
                      <div className="p-4">
                         <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100">
                                  <ImageWithFallback src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                               </div>
                               <div>
                                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                     {teacher.name} <span className="bg-indigo-600 text-white text-[8px] px-1 rounded uppercase">Plus+</span>
                                  </h4>
                                  <div className="text-[10px] text-slate-500">English <span className="text-teal-600 font-bold">Native</span></div>
                               </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                               <Star size={12} className="fill-yellow-400 text-yellow-400" /> {teacher.rating}
                            </div>
                         </div>
                         <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">
                            Certified teacher with over {teacher.lessons} lessons taught. I specialize in conversation and exam prep.
                         </p>
                         <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                            <div className="text-slate-900 font-black">
                               ${teacher.price} <span className="text-slate-400 text-[10px] font-medium">/ trial</span>
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
             <div className="mt-8 mb-12 flex justify-center">
               <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2">
                  Find more teachers <ChevronRight size={16} />
               </button>
             </div>
          </div>
          
          {/* Mobile Booking Bar (Fixed Bottom) */}
          <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between gap-4">
             <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Intro Session</div>
                <div className="text-lg font-black text-slate-900">1 Credit</div>
             </div>
             <button className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-sm uppercase shadow-lg shadow-rose-200">
                Request Swap
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SkillDetailView;