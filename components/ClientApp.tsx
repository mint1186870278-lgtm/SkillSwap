'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import ValueProps from './ValueProps';
import ProductPreview from './ProductPreview';
import SocialProof from './SocialProof';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import Onboarding from './Onboarding';
import MainAppLayout from './MainAppLayout';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ToastProvider } from '../contexts/ToastContext';
import { AuthProvider } from '../contexts/AuthContext';
import { UserSkillsProvider } from '../contexts/UserSkillsContext';
import { useUser } from '@clerk/nextjs';
import { setAppMode, type AppMode } from '../lib/app-mode';

const ONBOARDING_RETURN_KEY = 'skillswap_return_to_onboarding_step';

const ClientApp: React.FC<{ testMode?: boolean; initialView?: 'landing' | 'onboarding' | 'dashboard' }> = ({ testMode, initialView }) => {
  const [view, setView] = useState<'landing' | 'onboarding' | 'dashboard'>(
    initialView ?? (testMode ? 'dashboard' : 'landing')
  );
  const [appMode, setAppModeState] = useState<AppMode>(testMode ? 'guest' : 'guest');

  useEffect(() => {
    if (testMode && view === 'dashboard') setAppMode('guest');
  }, [testMode, view]);
  const [onboardingInitialStep, setOnboardingInitialStep] = useState<1 | 2 | 3 | 4 | undefined>(undefined);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      const returnStep = typeof window !== 'undefined' ? sessionStorage.getItem(ONBOARDING_RETURN_KEY) : null;
      if (returnStep) {
        sessionStorage.removeItem(ONBOARDING_RETURN_KEY);
        setOnboardingInitialStep(Number(returnStep) as 1 | 2 | 3 | 4);
        setView('onboarding');
      }
    }
  }, [isSignedIn]);

  const handleStart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOnboardingInitialStep(undefined);
    setView('onboarding');
  };

  const handleFinishOnboarding = () => {
    setView('dashboard');
  };

  /** Mock页面：Mock 数据，浏览发现页 */
  const handleMockPage = () => {
    setAppMode('guest');
    setAppModeState('guest');
    setView('dashboard');
  };

  /** 进入应用：已登录用户，真实 API */
  const handleGoToDashboard = () => {
    setAppMode('authenticated');
    setAppModeState('authenticated');
    setView('dashboard');
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <UserSkillsProvider>
        <ToastProvider>
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
              <Navbar onLoginClick={handleStart} onGoToDashboard={handleGoToDashboard} />
              <Hero onStart={handleStart} />
              <ValueProps />
              <ProductPreview />
              <SocialProof />
              <FinalCTA onStart={handleStart} />
              <Footer />
            </>
          )}

          {view === 'onboarding' && (
            <Onboarding onFinish={handleFinishOnboarding} initialStep={onboardingInitialStep} onMockPage={handleMockPage} />
          )}

          {view === 'dashboard' && (
            <MainAppLayout user={{ name: user?.fullName || user?.firstName || "Guest User", id: user?.id, imageUrl: user?.imageUrl }} testMode={true} appMode={appMode} />
          )}
        </div>
      </div>
        </ToastProvider>
        </UserSkillsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default ClientApp;