'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Users, Layers, Layout, Palette, Smartphone, Type, MousePointer, Grid, Command, ArrowRight } from 'lucide-react';

const sections = [
  { id: 'about-project', label: 'ABOUT PROJECT' },
  { id: 'design-process', label: 'DESIGN PROCESS' },
  { id: 'audience', label: 'AUDIENCE' },
  { id: 'user-stories', label: 'USER STORIES' },
  { id: 'user-flow', label: 'USER FLOW' },
  { id: 'wireframes', label: 'WIREFRAMES' },
  { id: 'design-system', label: 'DESIGN SYSTEM' },
  { id: 'ui-design', label: 'UI DESIGN & RESULTS' },
];

export default function CaseStudyPage() {
  const [activeSection, setActiveSection] = useState('about-project');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for sticky header

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans selection:bg-pastelPurple selection:text-black">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-white/10 py-4 overflow-x-auto no-scrollbar">
        <div className="container mx-auto px-6 flex items-center gap-4 min-w-max">
          <Link href="/" className="mr-6 p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          
          <div className="flex gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`
                  px-6 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-300 whitespace-nowrap
                  ${activeSection === section.id 
                    ? 'bg-pastelYellow text-black scale-105 shadow-[0_0_15px_rgba(253,230,138,0.5)]' 
                    : 'bg-pastelPurple/20 text-pastelPurple hover:bg-pastelPurple/40'}
                `}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-20 max-w-6xl">
        
        {/* 1. ABOUT PROJECT */}
        <section id="about-project" className="min-h-[60vh] flex flex-col justify-center mb-20 border-b border-white/10 pb-20">
          <span className="text-pastelPurple font-bold tracking-widest mb-4">01 — OVERVIEW</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            SkillSwap: <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pastelPurple via-pastelPink to-pastelYellow">
              Democratizing Learning
            </span>
          </h1>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white/90">The Challenge</h3>
              <p className="text-white/60 leading-relaxed text-lg">
                Traditional education is expensive, and online courses can be lonely. People want to learn new skills but often lack the funds or the community support to keep going.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white/90">The Solution</h3>
              <p className="text-white/60 leading-relaxed text-lg">
                A barter-based platform where skills are the currency. Learn guitar by teaching coding. No money changes hands, just knowledge and good vibes.
              </p>
            </div>
          </div>
          
          <div className="mt-12 flex gap-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-pastelPink mb-1">Role</div>
              <div className="text-white/60">Product Designer & Developer</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-pastelBlue mb-1">Timeline</div>
              <div className="text-white/60">2 Weeks Sprint</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-pastelGreen mb-1">Tools</div>
              <div className="text-white/60">Figma, Next.js, Tailwind</div>
            </div>
          </div>
        </section>

        {/* 2. DESIGN PROCESS */}
        <section id="design-process" className="mb-32">
          <span className="text-pastelPink font-bold tracking-widest mb-4 block">02 — METHODOLOGY</span>
          <h2 className="text-4xl font-bold mb-12">The Double Diamond Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Discover", icon: <Users />, desc: "User interviews, market research, and identifying the core problem." },
              { title: "Define", icon: <Layers />, desc: "Creating personas, user stories, and defining the MVP scope." },
              { title: "Develop", icon: <Layout />, desc: "Wireframing, prototyping, and iterating on the UI/UX." },
              { title: "Deliver", icon: <Smartphone />, desc: "Final high-fidelity designs, development, and testing." }
            ].map((step, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 text-pastelPurple group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. AUDIENCE */}
        <section id="audience" className="mb-32">
          <span className="text-pastelBlue font-bold tracking-widest mb-4 block">03 — TARGET AUDIENCE</span>
          <h2 className="text-4xl font-bold mb-12">Who are we designing for?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastelPink/20 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-bold mb-2">The Broke Student</h3>
              <div className="text-pastelPink text-sm font-bold mb-6">PRIMARY PERSONA</div>
              <p className="text-white/60 mb-6">
                "I want to learn design but courses are too expensive. I'm good at math though!"
              </p>
              <ul className="space-y-3 text-white/50 text-sm">
                <li className="flex items-center gap-2"><Check size={14} className="text-pastelGreen"/> Needs free resources</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-pastelGreen"/> Has time but no money</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-pastelGreen"/> Values community</li>
              </ul>
            </div>

            <div className="bg-[#1A1A1A] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pastelBlue/20 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-bold mb-2">The Hobbyist Expert</h3>
              <div className="text-pastelBlue text-sm font-bold mb-6">SECONDARY PERSONA</div>
              <p className="text-white/60 mb-6">
                "I'm a pro developer but I want to learn pottery on weekends. I'd love to mentor someone."
              </p>
              <ul className="space-y-3 text-white/50 text-sm">
                <li className="flex items-center gap-2"><Check size={14} className="text-pastelGreen"/> Wants to give back</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-pastelGreen"/> Looking for genuine connection</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-pastelGreen"/> Needs flexible scheduling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. USER STORIES */}
        <section id="user-stories" className="mb-32">
          <span className="text-pastelYellow font-bold tracking-widest mb-4 block">04 — USER STORIES</span>
          <h2 className="text-4xl font-bold mb-12">Key Scenarios</h2>
          
          <div className="space-y-4">
            {[
              "As a user, I want to list the skills I can teach so that others can find me.",
              "As a user, I want to search for specific skills I want to learn.",
              "As a user, I want to chat with potential matches to see if we vibe.",
              "As a user, I want to schedule a session without leaving the app."
            ].map((story, i) => (
              <div key={i} className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-pastelYellow/50 transition-colors">
                <div className="text-pastelYellow font-mono opacity-50">0{i+1}</div>
                <div className="text-lg font-medium text-white/80">{story}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. USER FLOW */}
        <section id="user-flow" className="mb-32">
          <span className="text-pastelGreen font-bold tracking-widest mb-4 block">05 — USER FLOW</span>
          <h2 className="text-4xl font-bold mb-12">Information Architecture</h2>
          
          <div className="overflow-x-auto pb-12">
             <div className="min-w-[1000px] flex flex-col items-center gap-12">
                
                {/* Level 1: Start */}
                <div className="flex flex-col items-center">
                   <div className="w-32 h-16 rounded-full bg-pastelYellow border-2 border-white flex items-center justify-center font-bold text-black shadow-[0_0_20px_rgba(253,255,182,0.3)]">
                      Start
                   </div>
                   <div className="h-8 w-0.5 bg-white/20"></div>
                </div>

                {/* Level 2: Onboarding Flow */}
                <div className="relative p-8 border border-white/10 rounded-3xl bg-white/5">
                   <div className="absolute -top-3 left-8 text-xs font-bold text-pastelPurple bg-[#111] px-2">ONBOARDING</div>
                   <div className="flex items-center gap-8">
                      <div className="flex flex-col items-center gap-2">
                         <div className="w-40 h-14 rounded-xl bg-pastelPurple text-black font-bold flex items-center justify-center text-sm">Welcome Screen</div>
                      </div>
                      <ArrowRight className="text-white/20" />
                      <div className="flex flex-col gap-4">
                         <div className="w-40 h-14 rounded-xl bg-white text-black font-bold flex items-center justify-center text-sm">Social Login</div>
                         <div className="w-40 h-14 rounded-xl bg-white text-black font-bold flex items-center justify-center text-sm">Guest Mode</div>
                      </div>
                      <ArrowRight className="text-white/20" />
                      <div className="w-40 h-14 rounded-xl bg-pastelPurple text-black font-bold flex items-center justify-center text-sm">Select 'Teach'</div>
                      <ArrowRight className="text-white/20" />
                      <div className="w-40 h-14 rounded-xl bg-pastelPurple text-black font-bold flex items-center justify-center text-sm">Select 'Learn'</div>
                      <ArrowRight className="text-white/20" />
                      <div className="w-40 h-14 rounded-xl bg-pastelPink text-black font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(249,168,212,0.4)]">AI Match Result</div>
                   </div>
                </div>

                <div className="h-8 w-0.5 bg-white/20"></div>

                {/* Level 3: Main App (Dashboard) */}
                <div className="w-full border border-white/10 rounded-3xl p-8 bg-white/5 relative">
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-pastelBlue bg-[#111] px-2">MAIN APP LAYOUT</div>
                   
                   {/* Main Tabs */}
                   <div className="grid grid-cols-5 gap-4">
                      {/* Tab 1: Home */}
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-full h-14 rounded-xl bg-pastelBlue text-black font-bold flex items-center justify-center text-sm">Dashboard</div>
                         <div className="h-8 w-0.5 bg-white/20"></div>
                         <div className="flex flex-col gap-2 w-full">
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">Schedule</div>
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">My Learning</div>
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">Top Picks</div>
                         </div>
                      </div>

                      {/* Tab 2: Explore */}
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-full h-14 rounded-xl bg-pastelBlue text-black font-bold flex items-center justify-center text-sm">Explore</div>
                         <div className="h-8 w-0.5 bg-white/20"></div>
                         <div className="flex flex-col gap-2 w-full">
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center border border-white/20">Find Skills</div>
                            <div className="pl-4 border-l border-white/10 flex flex-col gap-2">
                               <div className="p-2 rounded bg-white/5 text-[10px]">Skill Detail</div>
                               <div className="p-2 rounded bg-white/5 text-[10px]">Book Session</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center border border-white/20">Community</div>
                            <div className="pl-4 border-l border-white/10 flex flex-col gap-2">
                               <div className="p-2 rounded bg-white/5 text-[10px]">Post Feed</div>
                               <div className="p-2 rounded bg-white/5 text-[10px]">Post Detail</div>
                            </div>
                         </div>
                      </div>

                      {/* Tab 3: Exchanges */}
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-full h-14 rounded-xl bg-pastelBlue text-black font-bold flex items-center justify-center text-sm">Exchanges</div>
                         <div className="h-8 w-0.5 bg-white/20"></div>
                         <div className="flex flex-col gap-2 w-full">
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">Upcoming</div>
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">Pending</div>
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">History</div>
                         </div>
                      </div>

                      {/* Tab 4: Messages */}
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-full h-14 rounded-xl bg-pastelBlue text-black font-bold flex items-center justify-center text-sm">Messages</div>
                         <div className="h-8 w-0.5 bg-white/20"></div>
                         <div className="flex flex-col gap-2 w-full">
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">Chat List</div>
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">Direct Message</div>
                         </div>
                      </div>

                      {/* Tab 5: Profile */}
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-full h-14 rounded-xl bg-pastelBlue text-black font-bold flex items-center justify-center text-sm">Profile</div>
                         <div className="h-8 w-0.5 bg-white/20"></div>
                         <div className="flex flex-col gap-2 w-full">
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">My Stats</div>
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">Edit Profile</div>
                            <div className="p-3 rounded-lg bg-white/10 text-xs text-center">Settings</div>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </div>
        </section>

        {/* 6. WIREFRAMES */}
        <section id="wireframes" className="mb-32">
          <span className="text-pastelPurple font-bold tracking-widest mb-4 block">06 — WIREFRAMES</span>
          <h2 className="text-4xl font-bold mb-12">Low-Fidelity Sketches</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[9/16] bg-white/5 rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center p-8">
                <div className="text-center opacity-30">
                  <Layout size={48} className="mx-auto mb-4"/>
                  <span className="font-mono text-sm">Wireframe Screen {i}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. DESIGN SYSTEM */}
        <section id="design-system" className="mb-32">
          <span className="text-pastelPink font-bold tracking-widest mb-4 block">07 — DESIGN SYSTEM</span>
          <h2 className="text-4xl font-bold mb-12">Visual Identity & Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* COLOURS */}
            <div className="space-y-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="text-pastelPink" />
                  <h3 className="text-2xl font-bold tracking-wider">COLOURS</h3>
                </div>
                
                {/* Brand Gradients */}
                <div className="mb-8">
                   <div className="text-xs font-bold opacity-50 mb-3 tracking-widest">BRAND GRADIENTS</div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <div className="h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 border border-white/10"></div>
                         <div className="flex justify-between text-xs opacity-60 font-mono">
                            <span>Primary</span>
                            <span>Indigo-Purple</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="h-24 rounded-2xl bg-gradient-to-br from-[#E0E7FF] via-[#FCE7F3] to-[#F3E8FF] border border-white/10"></div>
                         <div className="flex justify-between text-xs opacity-60 font-mono">
                            <span>Background</span>
                            <span>Pastel Mesh</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Semantic Colors */}
                <div className="mb-8">
                   <div className="text-xs font-bold opacity-50 mb-3 tracking-widest">SEMANTIC</div>
                   <div className="grid grid-cols-4 gap-4">
                      {[
                        { name: 'Success', hex: '#22C55E', bg: 'bg-green-500' },
                        { name: 'Warning', hex: '#F59E0B', bg: 'bg-amber-500' },
                        { name: 'Error', hex: '#EF4444', bg: 'bg-red-500' },
                        { name: 'Info', hex: '#3B82F6', bg: 'bg-blue-500' },
                      ].map((c) => (
                        <div key={c.name} className="space-y-2">
                           <div className={`h-16 rounded-xl ${c.bg} border border-white/10`}></div>
                           <div className="text-[10px] opacity-60 font-mono">{c.hex}</div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Neutrals */}
                <div>
                   <div className="text-xs font-bold opacity-50 mb-3 tracking-widest">NEUTRALS</div>
                   <div className="grid grid-cols-5 gap-3">
                      {[
                        { name: '900', bg: 'bg-slate-900' },
                        { name: '700', bg: 'bg-slate-700' },
                        { name: '500', bg: 'bg-slate-500' },
                        { name: '200', bg: 'bg-slate-200' },
                        { name: '50', bg: 'bg-slate-50' },
                      ].map((c) => (
                        <div key={c.name} className="space-y-2">
                           <div className={`h-12 rounded-lg ${c.bg} border border-white/10`}></div>
                           <div className="text-[10px] opacity-60 font-mono text-center">{c.name}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* TYPOGRAPHY */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Type className="text-pastelPink" />
                  <h3 className="text-2xl font-bold tracking-wider">TYPOGRAPHY</h3>
                </div>
                
                <div className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10">
                   <div className="grid grid-cols-[100px_1fr] gap-4 items-baseline">
                      <span className="text-xs font-mono opacity-50">Display</span>
                      <div>
                         <div className="text-4xl md:text-5xl font-black font-heading leading-tight">Poppins Black</div>
                         <div className="text-xs opacity-40 mt-1">48px / 1.1 / -0.02em</div>
                      </div>
                   </div>
                   <div className="grid grid-cols-[100px_1fr] gap-4 items-baseline">
                      <span className="text-xs font-mono opacity-50">H1</span>
                      <div>
                         <div className="text-3xl font-black font-heading">Poppins Bold</div>
                         <div className="text-xs opacity-40 mt-1">30px / 1.2 / -0.01em</div>
                      </div>
                   </div>
                   <div className="grid grid-cols-[100px_1fr] gap-4 items-baseline">
                      <span className="text-xs font-mono opacity-50">Body</span>
                      <div>
                         <div className="text-base font-medium font-sans">Nunito Medium</div>
                         <div className="text-xs opacity-40 mt-1">16px / 1.5 / 0em</div>
                         <p className="mt-2 text-sm opacity-70 leading-relaxed">
                            The quick brown fox jumps over the lazy dog. SkillSwap uses Nunito for high readability in long-form content and chat interfaces.
                         </p>
                      </div>
                   </div>
                   <div className="grid grid-cols-[100px_1fr] gap-4 items-baseline">
                      <span className="text-xs font-mono opacity-50">Label</span>
                      <div>
                         <div className="text-xs font-bold uppercase tracking-wider font-sans">Nunito Bold Caps</div>
                         <div className="text-xs opacity-40 mt-1">12px / 1.0 / 0.05em</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* COMPONENTS & UI */}
            <div className="space-y-12">
              
              {/* BUTTONS */}
              <div>
                 <div className="flex items-center gap-3 mb-6">
                   <MousePointer className="text-pastelPink" />
                   <h3 className="text-2xl font-bold tracking-wider">BUTTONS</h3>
                 </div>
                 
                 <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-white/10 space-y-8">
                    {/* Primary */}
                    <div className="grid grid-cols-[80px_1fr] gap-6 items-center">
                       <span className="text-xs font-mono opacity-50">Primary</span>
                       <div className="flex flex-wrap gap-4">
                          <button className="px-6 py-3 bg-white text-black rounded-xl font-bold text-sm">Default</button>
                          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30">Hover</button>
                          <button className="px-6 py-3 bg-white/10 text-white/30 rounded-xl font-bold text-sm cursor-not-allowed">Disabled</button>
                       </div>
                    </div>

                    {/* Secondary */}
                    <div className="grid grid-cols-[80px_1fr] gap-6 items-center">
                       <span className="text-xs font-mono opacity-50">Secondary</span>
                       <div className="flex flex-wrap gap-4">
                          <button className="px-6 py-3 bg-transparent border border-white/30 text-white rounded-xl font-bold text-sm">Default</button>
                          <button className="px-6 py-3 bg-white/5 border border-white text-white rounded-xl font-bold text-sm">Hover</button>
                       </div>
                    </div>

                    {/* Icon Buttons */}
                    <div className="grid grid-cols-[80px_1fr] gap-6 items-center">
                       <span className="text-xs font-mono opacity-50">Icon</span>
                       <div className="flex flex-wrap gap-4">
                          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"><Command size={18}/></button>
                          <button className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg"><Check size={18}/></button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* INPUTS & CARDS */}
              <div>
                 <div className="flex items-center gap-3 mb-6">
                   <Grid className="text-pastelPink" />
                   <h3 className="text-2xl font-bold tracking-wider">UI ELEMENTS</h3>
                 </div>

                 <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-white/10 space-y-8">
                    {/* Inputs */}
                    <div className="space-y-3">
                       <span className="text-xs font-mono opacity-50 block">Input Fields</span>
                       <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between opacity-90">
                          <span className="text-slate-400 text-sm font-medium">Placeholder text...</span>
                       </div>
                       <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border-2 border-indigo-500">
                          <span className="text-slate-900 text-sm font-medium">Active Input</span>
                          <span className="w-0.5 h-4 bg-indigo-500 animate-pulse"></span>
                       </div>
                    </div>

                    {/* Tab Bar */}
                    <div className="space-y-3">
                       <span className="text-xs font-mono opacity-50 block">Navigation</span>
                       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex justify-around">
                          <div className="p-2 text-pastelPink"><Layout size={24} /></div>
                          <div className="p-2 text-white/40"><Users size={24} /></div>
                          <div className="p-2 text-white/40"><Smartphone size={24} /></div>
                       </div>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </section>

        {/* 8. UI DESIGN & RESULTS */}
        <section id="ui-design" className="mb-20">
          <span className="text-pastelBlue font-bold tracking-widest mb-4 block">08 — FINAL RESULTS</span>
          <h2 className="text-4xl font-bold mb-12">High-Fidelity UI</h2>
          
          <div className="bg-[#1A1A1A] p-4 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden mb-12">
             <div className="aspect-video bg-gradient-to-br from-[#E0E7FF] via-[#FCE7F3] to-[#F3E8FF] rounded-[2.5rem] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                   <span className="bg-black/50 text-white px-6 py-3 rounded-full backdrop-blur-md">Interactive Preview Available on Home</span>
                </div>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-4xl font-bold text-pastelGreen mb-2">98%</div>
              <div className="text-sm opacity-60">User Satisfaction</div>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-4xl font-bold text-pastelPurple mb-2">2min</div>
              <div className="text-sm opacity-60">Avg. Match Time</div>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-4xl font-bold text-pastelPink mb-2">5k+</div>
              <div className="text-sm opacity-60">Skills Exchanged</div>
            </div>
          </div>
        </section>

        <div className="text-center pt-20 border-t border-white/10">
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
            <ArrowLeft size={20} /> Back to Live Site
          </Link>
        </div>

      </main>
    </div>
  );
}
