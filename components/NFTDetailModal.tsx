'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Calendar } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';
import type { NFTDetail } from '../lib/api-client';

interface NFTDetailModalProps {
  detail: NFTDetail | null;
  currentUserName?: string;
  onClose: () => void;
}

export const NFTDetailModal: React.FC<NFTDetailModalProps> = ({ detail, currentUserName, onClose }) => {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!detail) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center text-slate-500 text-sm">Loading...</div>
      </motion.div>
    );
  }

  const total = detail.contributionMe + detail.contributionThem || 100;
  const mePct = Math.round((detail.contributionMe / total) * 100);
  const themPct = 100 - mePct;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative z-[101]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={20} strokeWidth={3} />
          </button>

          <div className="p-6 pt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center">
                <Trophy size={28} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">{detail.title}</h3>
                <p className="text-xs text-slate-500">{detail.skillMe} × {detail.skillThem}</p>
              </div>
            </div>

            {/* 贡献分配 */}
            <div className="mb-6">
              <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" /> {t('nft_showcase.contribution')}
              </h4>
              <div className="flex gap-2 h-8 rounded-xl overflow-hidden bg-slate-100">
                <div
                  className="bg-indigo-500 flex items-center justify-center text-white text-xs font-black transition-all"
                  style={{ width: `${mePct}%` }}
                >
                  {mePct}%
                </div>
                <div
                  className="bg-purple-500 flex items-center justify-center text-white text-xs font-black transition-all"
                  style={{ width: `${themPct}%` }}
                >
                  {themPct}%
                </div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500">
                <span>{currentUserName ? (language === 'zh' ? `${currentUserName}${t('nft_showcase.my_contribution')}` : `${currentUserName}'s ${t('nft_showcase.my_contribution')}`) : t('nft_showcase.your_contribution')}</span>
                <span>{language === 'zh' ? `${detail.partnerName}${t('nft_showcase.partner_contribution')}` : `${detail.partnerName}'s ${t('nft_showcase.partner_contribution')}`}</span>
              </div>
            </div>

            {/* 交换故事 */}
            <div className="mb-6">
              <h4 className="font-bold text-slate-800 text-sm mb-2">{t('nft_showcase.story')}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{detail.story}</p>
            </div>

            {/* 时间线 */}
            {detail.timeline && detail.timeline.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-500" /> {t('nft_showcase.timeline')}
                </h4>
                <div className="space-y-2">
                  {detail.timeline.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <span className="text-sm font-bold text-slate-700">{ev.label}</span>
                      <span className="text-xs text-slate-400 ml-auto">{ev.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                <ImageWithFallback src={detail.partnerAvatar} alt={detail.partnerName} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600">{detail.partnerName}</p>
                <p className="text-[10px] text-slate-400">{detail.createdAt}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
