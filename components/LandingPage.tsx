'use client';

/**
 * Landing page - NO Clerk dependency.
 * Renders without contacting clerk.accounts.dev. "登录"/CTA go to /app.
 */
import React, { useEffect } from 'react';
import LandingNavbar from './LandingNavbar';
import Hero from './Hero';
import ValueProps from './ValueProps';
import ProductPreview from './ProductPreview';
import SocialProof from './SocialProof';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import { LanguageProvider } from '../contexts/LanguageContext';

function handleStart() {
  window.location.href = '/app?start=1';
}

export default function LandingPage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <LanguageProvider>
      <div className="relative w-full min-h-screen overflow-x-hidden text-textMain selection:bg-pastelPurple selection:text-white">
        {/* Background */}
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF] via-[#FCE7F3] to-[#F3E8FF]" />
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A5B4FC] rounded-full mix-blend-multiply filter blur-[90px] opacity-70 animate-blob" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F9A8D4] rounded-full mix-blend-multiply filter blur-[90px] opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[#C4B5FD] rounded-full mix-blend-multiply filter blur-[90px] opacity-70 animate-blob animation-delay-4000" />
          <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-[#FDE68A] rounded-full mix-blend-multiply filter blur-[60px] opacity-60 animate-blob animation-delay-6000" />
          <div className="absolute inset-0 bg-noise" />
          <div className="absolute inset-0 bg-white/30" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <LandingNavbar />
          <Hero onStart={handleStart} />
          <ValueProps />
          <ProductPreview />
          <SocialProof />
          <FinalCTA onStart={handleStart} />
          <Footer />
        </div>
      </div>
    </LanguageProvider>
  );
}
