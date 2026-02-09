import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            {['Explore', 'Community', 'Stories', 'About'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-lg font-bold text-textLight hover:text-textMain transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <Button onClick={onLoginClick} variant="primary" size="md" className="rounded-full px-8 !text-lg">Log In</Button>
        </div>

        <button 
          className="md:hidden text-textMain"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-6 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
           {['Explore', 'Community', 'Stories', 'About'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-lg font-bold text-textMain py-2 border-b border-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={onLoginClick} variant="primary" size="md" className="w-full">Log In</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;