import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 border-t border-white/20 bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-textMain font-bold font-heading">
          SkillSwap
        </div>
        
        <div className="flex gap-6 text-sm text-textLight font-bold">
          <a href="/case-study" className="hover:text-textMain transition-colors">{t('footer.case_study')}</a>
          <a href="#" className="hover:text-textMain transition-colors">{t('footer.vibes')}</a>
          <a href="#" className="hover:text-textMain transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-textMain transition-colors">{t('footer.contact')}</a>
        </div>

        <div className="text-xs text-textLight opacity-60">
          © 2024 SkillSwap Inc.
        </div>
      </div>
    </footer>
  );
};

export default Footer;