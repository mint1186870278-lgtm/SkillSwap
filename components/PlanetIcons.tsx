import React, { useId } from 'react';

const PlanetBase = ({ color, children }: { color: string; children: React.ReactNode }) => {
  const id = useId();
  const maskId = `planet-mask-${color.replace('#', '')}${id.replace(/:/g, '')}`;
  return (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill={color} />
    <mask id={maskId} maskUnits="userSpaceOnUse" x="2" y="2" width="96" height="96">
      <circle cx="50" cy="50" r="48" fill="white" />
    </mask>
    <g mask={`url(#${maskId})`}>{children}</g>
    <path d="M75 25 Q 85 35 80 45" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
  </svg>
  );
};

export const PlanetLanguage = ({ className }: { className?: string }) => (
  <div className={className}>
    <PlanetBase color="#A78BFA">
      <path d="M-10 20L110 80" stroke="#C4B5FD" strokeWidth="12" strokeLinecap="round" />
      <path d="M-10 50L110 110" stroke="#C4B5FD" strokeWidth="12" strokeLinecap="round" />
    </PlanetBase>
  </div>
);
export const PlanetFitness = ({ className }: { className?: string }) => (
  <div className={className}>
    <PlanetBase color="#F472B6">
      <circle cx="30" cy="30" r="8" fill="#FBCFE8" />
      <circle cx="70" cy="40" r="12" fill="#FBCFE8" />
      <circle cx="45" cy="70" r="10" fill="#FBCFE8" />
    </PlanetBase>
  </div>
);
export const PlanetTech = ({ className }: { className?: string }) => (
  <div className={className}>
    <PlanetBase color="#60A5FA">
      <path d="M10 50 Q 50 20 90 50" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M10 50 Q 50 80 90 50" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" fill="none" />
    </PlanetBase>
  </div>
);
export const PlanetDesign = ({ className }: { className?: string }) => (
  <div className={className}>
    <PlanetBase color="#FCD34D">
      <path d="M15 40 Q 50 50 85 40" stroke="#FEF3C7" strokeWidth="6" fill="none" />
      <path d="M15 60 Q 50 70 85 60" stroke="#FEF3C7" strokeWidth="6" fill="none" />
      <path d="M10 65 Q 50 45 90 45" stroke="#7DD3FC" strokeWidth="8" strokeLinecap="round" />
    </PlanetBase>
  </div>
);
export const PlanetDiscovery = ({ className }: { className?: string }) => (
  <div className={className}>
    <PlanetBase color="#34D399">
      <circle cx="50" cy="50" r="20" fill="#10B981" opacity="0.5" />
      <path d="M-10 65 Q 50 35 110 65" stroke="#6EE7B7" strokeWidth="12" fill="none" />
      <path d="M-10 45 Q 50 15 110 45" stroke="#D1FAE5" strokeWidth="6" fill="none" opacity="0.8" />
      <circle cx="80" cy="30" r="6" fill="#ECFDF5" />
      <circle cx="20" cy="70" r="4" fill="#ECFDF5" />
    </PlanetBase>
  </div>
);

const PLANET_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  language: PlanetLanguage,
  fitness: PlanetFitness,
  tech: PlanetTech,
  design: PlanetDesign,
  other: PlanetDiscovery
};

export function PlanetIcon({ id, className }: { id: string; className?: string }) {
  const Comp = PLANET_MAP[id];

  if (!Comp) return null;
  return <Comp className={className} />;
}
