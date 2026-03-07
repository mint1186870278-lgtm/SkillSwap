'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'skillswap_user_skills';

export interface UserSkills {
  teachGalaxies: string[];
  teachTags: string[];
  learnGalaxies: string[];
  learnTags: string[];
}

const DEFAULT_SKILLS: UserSkills = {
  teachGalaxies: ['design', 'language'],
  teachTags: ['Figma', 'UI/UX', 'Spanish'],
  learnGalaxies: ['fitness', 'other'],
  learnTags: ['Yoga', 'Sourdough', 'Cooking']
};

interface UserSkillsContextType {
  skills: UserSkills;
  setSkills: (s: UserSkills | ((prev: UserSkills) => UserSkills)) => void;
  setTeachGalaxies: (g: string[] | ((prev: string[]) => string[])) => void;
  setTeachTags: (t: string[] | ((prev: string[]) => string[])) => void;
  setLearnGalaxies: (g: string[] | ((prev: string[]) => string[])) => void;
  setLearnTags: (t: string[] | ((prev: string[]) => string[])) => void;
}

const UserSkillsContext = createContext<UserSkillsContextType | undefined>(undefined);

function loadFromStorage(): UserSkills {
  if (typeof window === 'undefined') return DEFAULT_SKILLS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SKILLS;
    const parsed = JSON.parse(raw);
    return {
      teachGalaxies: Array.isArray(parsed.teachGalaxies) ? parsed.teachGalaxies : DEFAULT_SKILLS.teachGalaxies,
      teachTags: Array.isArray(parsed.teachTags) ? parsed.teachTags : DEFAULT_SKILLS.teachTags,
      learnGalaxies: Array.isArray(parsed.learnGalaxies) ? parsed.learnGalaxies : DEFAULT_SKILLS.learnGalaxies,
      learnTags: Array.isArray(parsed.learnTags) ? parsed.learnTags : DEFAULT_SKILLS.learnTags
    };
  } catch {
    return DEFAULT_SKILLS;
  }
}

function saveToStorage(skills: UserSkills) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
  } catch {}
}

export const UserSkillsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skills, setSkillsState] = useState<UserSkills>(DEFAULT_SKILLS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSkillsState(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(skills);
  }, [skills, hydrated]);

  const setSkills = useCallback((s: UserSkills | ((prev: UserSkills) => UserSkills)) => {
    setSkillsState(prev => {
      const next = typeof s === 'function' ? s(prev) : s;
      return next;
    });
  }, []);

  const setTeachGalaxies = useCallback((g: string[] | ((prev: string[]) => string[])) => {
    setSkillsState(prev => ({
      ...prev,
      teachGalaxies: typeof g === 'function' ? g(prev.teachGalaxies) : g
    }));
  }, []);

  const setTeachTags = useCallback((t: string[] | ((prev: string[]) => string[])) => {
    setSkillsState(prev => ({
      ...prev,
      teachTags: typeof t === 'function' ? t(prev.teachTags) : t
    }));
  }, []);

  const setLearnGalaxies = useCallback((g: string[] | ((prev: string[]) => string[])) => {
    setSkillsState(prev => ({
      ...prev,
      learnGalaxies: typeof g === 'function' ? g(prev.learnGalaxies) : g
    }));
  }, []);

  const setLearnTags = useCallback((t: string[] | ((prev: string[]) => string[])) => {
    setSkillsState(prev => ({
      ...prev,
      learnTags: typeof t === 'function' ? t(prev.learnTags) : t
    }));
  }, []);

  return (
    <UserSkillsContext.Provider value={{ skills, setSkills, setTeachGalaxies, setTeachTags, setLearnGalaxies, setLearnTags }}>
      {children}
    </UserSkillsContext.Provider>
  );
};

export const useUserSkills = () => {
  const ctx = useContext(UserSkillsContext);
  if (ctx === undefined) return { skills: DEFAULT_SKILLS, setSkills: () => {}, setTeachGalaxies: () => {}, setTeachTags: () => {}, setLearnGalaxies: () => {}, setLearnTags: () => {} };
  return ctx;
};
