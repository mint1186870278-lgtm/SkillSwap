import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ValueProps from './components/ValueProps';
import ProductPreview from './components/ProductPreview';
import SocialProof from './components/SocialProof';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Onboarding from './components/Onboarding';
import MainAppLayout from './components/MainAppLayout';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'onboarding' | 'dashboard'>('landing');

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  const handleStart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView('onboarding');
  };

  const handleFinishOnboarding = () => {
    setView('dashboard');
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden text-textMain selection:bg-pastelPurple selection:text-white">
      
      {/* --- BACKGROUND LAYER START --- */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        
        {/* 1. Deep Base Gradient (Stronger Visibility) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF] via-[#FCE7F3] to-[#F3E8FF]"></div>
        
        {/* 2. Animated Blobs (Increased Opacity & Saturation) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A5B4FC] rounded-full mix-blend-multiply filter blur-[90px] opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F9A8D4] rounded-full mix-blend-multiply filter blur-[90px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[#C4B5FD] rounded-full mix-blend-multiply filter blur-[90px] opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-[#FDE68A] rounded-full mix-blend-multiply filter blur-[60px] opacity-60 animate-blob animation-delay-6000"></div>
        
        {/* 3. Noise Texture (Applied via CSS class in index.html, sits at z-index: 1) */}
        <div className="absolute inset-0 bg-noise"></div>
        
        {/* 4. White tint overlay to soften extreme contrast if needed */}
        {/* We use a stronger overlay on the dashboard to ensure text readability */}
        <div className={`absolute inset-0 transition-colors duration-700 ${view === 'dashboard' ? 'bg-white/50' : 'bg-white/30'}`}></div>
      </div>
      {/* --- BACKGROUND LAYER END --- */}

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {view === 'landing' && (
          <>
            <Navbar onLoginClick={handleStart} />
            <Hero onStart={handleStart} />
            <ValueProps />
            <ProductPreview />
            <SocialProof />
            <FinalCTA onStart={handleStart} />
            <Footer />
          </>
        )}

        {view === 'onboarding' && (
          <Onboarding onFinish={handleFinishOnboarding} />
        )}

        {view === 'dashboard' && (
          <MainAppLayout user={{ name: "Guest User" }} />
        )}
      </div>
    </div>
  );
};

export default App;