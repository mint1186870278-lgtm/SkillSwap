'use client';

import React, { useState } from 'react';
import { X, Plus, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUserSkills } from '../contexts/UserSkillsContext';
import { SUGGESTIONS } from '../lib/skills-config';
import { PlanetLanguage, PlanetFitness, PlanetTech, PlanetDesign, PlanetDiscovery } from './PlanetIcons';

const galaxies = [
  { id: 'language', labelKey: 'hero.skills.language', Component: PlanetLanguage },
  { id: 'fitness', labelKey: 'hero.skills.fitness', Component: PlanetFitness },
  { id: 'tech', labelKey: 'hero.skills.tech', Component: PlanetTech },
  { id: 'design', labelKey: 'hero.skills.design', Component: PlanetDesign },
  { id: 'other', labelKey: 'hero.skills.other', Component: PlanetDiscovery }
];

interface SkillsEditModalProps {
  onClose: () => void;
}

export const SkillsEditModal: React.FC<SkillsEditModalProps> = ({ onClose }) => {
  const { t, language } = useLanguage();
  const { skills, setTeachGalaxies, setTeachTags, setLearnGalaxies, setLearnTags } = useUserSkills();
  const [mode, setMode] = useState<'teach' | 'learn'>('teach');
  const [teachGalaxies, setTeachGalaxiesLocal] = useState(skills.teachGalaxies);
  const [teachTags, setTeachTagsLocal] = useState(skills.teachTags);
  const [learnGalaxies, setLearnGalaxiesLocal] = useState(skills.learnGalaxies);
  const [learnTags, setLearnTagsLocal] = useState(skills.learnTags);
  const [teachInputValue, setTeachInputValue] = useState('');
  const [learnInputValue, setLearnInputValue] = useState('');

  const addTeachTag = (tag: string) => {
    if (!teachTags.includes(tag) && teachTags.length < 5) {
      setTeachTagsLocal([...teachTags, tag]);
    }
    setTeachInputValue('');
  };
  const removeTeachTag = (tag: string) => setTeachTagsLocal(teachTags.filter(t => t !== tag));
  const addLearnTag = (tag: string) => {
    if (!learnTags.includes(tag) && learnTags.length < 5) {
      setLearnTagsLocal([...learnTags, tag]);
    }
    setLearnInputValue('');
  };
  const removeLearnTag = (tag: string) => setLearnTagsLocal(learnTags.filter(t => t !== tag));

  const handleTeachGalaxySelect = (id: string) => {
    if (teachGalaxies.includes(id)) {
      setTeachGalaxiesLocal(teachGalaxies.filter(g => g !== id));
    } else {
      setTeachGalaxiesLocal([...teachGalaxies, id]);
    }
  };
  const handleLearnGalaxySelect = (id: string) => {
    if (learnGalaxies.includes(id)) {
      setLearnGalaxiesLocal(learnGalaxies.filter(g => g !== id));
    } else {
      setLearnGalaxiesLocal([...learnGalaxies, id]);
    }
  };

  const handleSave = () => {
    setTeachGalaxies(teachGalaxies);
    setTeachTags(teachTags);
    setLearnGalaxies(learnGalaxies);
    setLearnTags(learnTags);
    onClose();
  };

  const isZh = language === 'zh';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pt-24 pb-8 px-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">
            {isZh ? '编辑我的技能' : 'Edit My Skills'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setMode('teach')}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                mode === 'teach' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {isZh ? '我会的' : 'I Can Teach'}
            </button>
            <button
              onClick={() => setMode('learn')}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                mode === 'learn' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {isZh ? '我想学的' : 'I Want to Learn'}
            </button>
          </div>

          {mode === 'teach' && (
            <>
              <div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm">{isZh ? '选择星球' : 'Select Planets'}</h3>
                <div className="flex justify-between gap-2">
                  {galaxies.map(g => {
                    const isSelected = teachGalaxies.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => handleTeachGalaxySelect(g.id)}
                        className={`flex-1 flex flex-col items-center p-2.5 rounded-lg border-2 transition-all ${
                          isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <g.Component className={`w-10 h-10 ${isSelected ? '' : 'opacity-60'}`} />
                        <span className="text-[11px] font-bold mt-0.5">{t(g.labelKey)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm">{isZh ? '具体技能（最多 5 个）' : 'Specific Skills (max 5)'}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {teachTags.map(s => (
                    <span key={s} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
                      {s}
                      <button onClick={() => removeTeachTag(s)} className="hover:text-indigo-900"><X size={14} /></button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={teachInputValue}
                  onChange={e => setTeachInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && teachInputValue.trim()) addTeachTag(teachInputValue.trim()); }}
                  placeholder={teachTags.length >= 5 ? (isZh ? '已达上限' : 'Max reached') : (isZh ? '输入或选择技能' : 'Type or select')}
                  disabled={teachTags.length >= 5}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 disabled:bg-slate-50"
                />
                <div className="grid grid-cols-6 gap-1.5 mt-2">
                  {teachGalaxies.flatMap(gid => (SUGGESTIONS[gid] || []).map(s => (
                    <button
                      key={s}
                      onClick={() => addTeachTag(s)}
                      disabled={teachTags.includes(s) || teachTags.length >= 5}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 text-xs font-medium disabled:opacity-40"
                    >
                      {s}
                    </button>
                  )))}
                </div>
              </div>
            </>
          )}

          {mode === 'learn' && (
            <>
              <div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm">{isZh ? '选择星球' : 'Select Planets'}</h3>
                <div className="flex justify-between gap-2">
                  {galaxies.map(g => {
                    const isSelected = learnGalaxies.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => handleLearnGalaxySelect(g.id)}
                        className={`flex-1 flex flex-col items-center p-2.5 rounded-lg border-2 transition-all ${
                          isSelected ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <g.Component className={`w-10 h-10 ${isSelected ? '' : 'opacity-60'}`} />
                        <span className="text-[11px] font-bold mt-0.5">{t(g.labelKey)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm">{isZh ? '具体技能（最多 5 个）' : 'Specific Skills (max 5)'}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {learnTags.map(s => (
                    <span key={s} className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
                      {s}
                      <button onClick={() => removeLearnTag(s)} className="hover:text-teal-900"><X size={14} /></button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={learnInputValue}
                  onChange={e => setLearnInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && learnInputValue.trim()) addLearnTag(learnInputValue.trim()); }}
                  placeholder={learnTags.length >= 5 ? (isZh ? '已达上限' : 'Max reached') : (isZh ? '输入或选择技能' : 'Type or select')}
                  disabled={learnTags.length >= 5}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 disabled:bg-slate-50"
                />
                <div className="grid grid-cols-6 gap-1.5 mt-2">
                  {learnGalaxies.flatMap(gid => (SUGGESTIONS[gid] || []).map(s => (
                    <button
                      key={s}
                      onClick={() => addLearnTag(s)}
                      disabled={learnTags.includes(s) || learnTags.length >= 5}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 text-xs font-medium disabled:opacity-40"
                    >
                      {s}
                    </button>
                  )))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-5 pt-0 border-t border-slate-100">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
          >
            {isZh ? '保存' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
