import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { Menu, X, Languages, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: t('navbar.about'), id: 'about' },
    { name: t('navbar.explore'), id: 'explore' },
    { name: t('navbar.community'), id: 'community' }
  ];

  const handleLanguageSelect = (lang: 'en' | 'zh') => {
    setLanguage(lang);
    setLangMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-4 bg-white/70 backdrop-blur-lg shadow-sm' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Custom SVG Logo */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="#6366F1"/>
            <path d="M2 23L16 30L30 23V9L16 16L2 9V23Z" fill="#818CF8"/>
            <path d="M16 16V30" stroke="#4F46E5" strokeWidth="2"/>
          </svg>
          <span className="text-xl font-black tracking-tight text-textMain">SkillSwap</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-lg font-bold text-textLight hover:text-textMain transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          
          {/* Language Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 text-textLight hover:text-textMain font-bold transition-colors px-2 py-1 rounded-lg hover:bg-black/5"
            >
              <Languages size={20} />
              <span>Language</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {langMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden">
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors ${language === 'en' ? 'text-purple-600 font-bold bg-purple-50/50' : 'text-textMain'}`}
                >
                  <span>English</span>
                  {language === 'en' && <Check size={16} />}
                </button>
                <button
                  onClick={() => handleLanguageSelect('zh')}
                  className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors ${language === 'zh' ? 'text-purple-600 font-bold bg-purple-50/50' : 'text-textMain'}`}
                >
                  <span>中文</span>
                  {language === 'zh' && <Check size={16} />}
                </button>
              </div>
            )}
          </div>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="primary" size="md" className="rounded-full px-8 !text-lg">{t('navbar.login')}</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button 
            className="text-textMain"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
           {navItems.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              className="text-lg font-bold text-textMain py-2 border-b border-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          
          <div className="py-2 border-b border-slate-50">
            <div className="text-sm font-bold text-textLight mb-3 flex items-center gap-2">
              <Languages size={16} />
              Language
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleLanguageSelect('en')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${language === 'en' ? 'bg-purple-100 text-purple-700' : 'bg-slate-50 text-textLight'}`}
              >
                English
              </button>
              <button 
                onClick={() => handleLanguageSelect('zh')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${language === 'zh' ? 'bg-purple-100 text-purple-700' : 'bg-slate-50 text-textLight'}`}
              >
                中文
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="primary" size="md" className="w-full">{t('navbar.login')}</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex justify-center py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;