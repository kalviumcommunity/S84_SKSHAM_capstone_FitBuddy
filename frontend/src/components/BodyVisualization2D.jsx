import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * 2D Interactive Body Map
 * Shows muscle groups with color coding:
 *   Green  = strength (user's strong parts)
 *   Red    = weakness (parts to improve)
 *   Yellow = neutral / maintained
 *
 * Props:
 *   strengthParts: string[] – e.g. ["Chest", "Biceps"]
 *   weaknessParts: string[] – e.g. ["Core", "Calves"]
 */

// ── Muscle group path data (simplified front-view human SVG) ──
const MUSCLE_PATHS = [
  {
    id: 'chest',
    label: 'Chest',
    d: 'M58,70 Q70,65 80,68 L82,80 Q70,85 58,80 Z',
  },
  {
    id: 'chest-r',
    label: 'Chest',
    d: 'M82,68 Q94,65 106,70 L106,80 Q94,85 82,80 Z',
  },
  {
    id: 'shoulders-l',
    label: 'Shoulders',
    d: 'M45,60 Q50,55 58,60 L58,72 Q52,70 45,68 Z',
  },
  {
    id: 'shoulders-r',
    label: 'Shoulders',
    d: 'M106,60 Q112,55 119,60 L119,68 Q112,70 106,72 Z',
  },
  {
    id: 'biceps-l',
    label: 'Biceps',
    d: 'M40,72 Q45,68 48,72 L48,92 Q44,94 40,92 Z',
  },
  {
    id: 'biceps-r',
    label: 'Biceps',
    d: 'M116,72 Q119,68 124,72 L124,92 Q120,94 116,92 Z',
  },
  {
    id: 'triceps-l',
    label: 'Triceps',
    d: 'M48,72 Q52,69 55,72 L55,90 Q52,93 48,90 Z',
  },
  {
    id: 'triceps-r',
    label: 'Triceps',
    d: 'M109,72 Q112,69 116,72 L116,90 Q112,93 109,90 Z',
  },
  {
    id: 'forearms-l',
    label: 'Forearms',
    d: 'M38,94 Q44,92 48,94 L46,115 Q42,117 38,115 Z',
  },
  {
    id: 'forearms-r',
    label: 'Forearms',
    d: 'M116,94 Q120,92 126,94 L126,115 Q122,117 118,115 Z',
  },
  {
    id: 'core',
    label: 'Core',
    d: 'M65,82 Q82,78 99,82 L97,115 Q82,120 67,115 Z',
  },
  {
    id: 'quadriceps-l',
    label: 'Quadriceps',
    d: 'M63,118 Q72,115 80,118 L78,155 Q70,158 63,155 Z',
  },
  {
    id: 'quadriceps-r',
    label: 'Quadriceps',
    d: 'M84,118 Q92,115 101,118 L101,155 Q94,158 86,155 Z',
  },
  {
    id: 'hamstrings-l',
    label: 'Hamstrings',
    d: 'M63,118 Q60,120 58,118 L60,155 Q62,158 63,155 Z',
  },
  {
    id: 'hamstrings-r',
    label: 'Hamstrings',
    d: 'M101,118 Q104,120 106,118 L104,155 Q102,158 101,155 Z',
  },
  {
    id: 'glutes',
    label: 'Glutes',
    d: 'M67,115 Q82,112 97,115 L99,120 Q82,124 65,120 Z',
  },
  {
    id: 'calves-l',
    label: 'Calves',
    d: 'M62,158 Q70,155 78,158 L76,190 Q70,193 64,190 Z',
  },
  {
    id: 'calves-r',
    label: 'Calves',
    d: 'M86,158 Q94,155 102,158 L100,190 Q94,193 88,190 Z',
  },
  {
    id: 'back',
    label: 'Back',
    d: 'M62,62 Q82,58 102,62 L100,82 Q82,78 64,82 Z',
  },
];

const COLORS = {
  strength: { fill: '#10b981', stroke: '#059669', glow: '#10b981', opacity: 0.8 },   // Vivid Emerald
  weakness: { fill: '#dc2626', stroke: '#b91c1c', glow: '#dc2626', opacity: 0.8 },   // Vivid Accent/Red
  neutral:  { fill: '#3f3f46', stroke: '#27272a', glow: '#3f3f46', opacity: 0.2 },   // Subtle Zinc
};

function normalizeLabel(s) {
  return (s || '').toLowerCase().trim();
}

export default function BodyVisualization2D({ strengthParts = [], weaknessParts = [] }) {
  // Debug logging
  console.log('BodyVisualization2D props:', { strengthParts, weaknessParts });
  
  const strengthSet = useMemo(
    () => new Set((strengthParts || []).map(normalizeLabel)),
    [strengthParts],
  );
  const weaknessSet = useMemo(
    () => new Set((weaknessParts || []).map(normalizeLabel)),
    [weaknessParts],
  );

  console.log('Normalized sets:', { 
    strengthSet: Array.from(strengthSet), 
    weaknessSet: Array.from(weaknessSet) 
  });

  const getColor = (label) => {
    const key = normalizeLabel(label);
    if (strengthSet.has(key)) return COLORS.strength;
    if (weaknessSet.has(key)) return COLORS.weakness;
    return COLORS.neutral;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="20 20 130 190"
        className="w-full h-full max-w-[200px] max-h-[280px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow filters for strength / weakness */}
        <defs>
          <filter id="glow-green" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="0.45" />
            <feComposite in2="blur" operator="in" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-red" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feFlood floodColor="#ef4444" floodOpacity="0.4" />
            <feComposite in2="blur" operator="in" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Head */}
        <circle cx="82" cy="35" r="12" fill="var(--surface-light, #27272a)" stroke="var(--surface-border, #3f3f46)" strokeWidth="0.8" />

        {/* Neck */}
        <rect x="78" y="47" width="8" height="8" rx="2" fill="var(--surface-light, #27272a)" stroke="var(--surface-border, #3f3f46)" strokeWidth="0.5" />

        {/* Muscle groups */}
        {MUSCLE_PATHS.map((muscle) => {
          const color = getColor(muscle.label);
          const isStrength = color === COLORS.strength;
          const isWeakness = color === COLORS.weakness;
          const glowFilter = isStrength ? 'url(#glow-green)' : isWeakness ? 'url(#glow-red)' : undefined;
          return (
            <motion.path
              key={muscle.id}
              d={muscle.d}
              fill={color.fill}
              fillOpacity={color.opacity}
              stroke={color.stroke}
              strokeWidth={isStrength || isWeakness ? 1.4 : 0.8}
              filter={glowFilter}
              initial={{ fillOpacity: color.opacity * 0.5 }}
              animate={{ fillOpacity: color.opacity }}
              whileHover={{ fillOpacity: Math.min(color.opacity + 0.2, 1), scale: 1.04 }}
              transition={{ duration: 0.25 }}
              className="cursor-pointer"
            >
              <title>{muscle.label}</title>
            </motion.path>
          );
        })}

        {/* Feet */}
        <ellipse cx="70" cy="196" rx="8" ry="4" fill="var(--surface-light, #27272a)" stroke="var(--surface-border, #3f3f46)" strokeWidth="0.5" />
        <ellipse cx="94" cy="196" rx="8" ry="4" fill="var(--surface-light, #27272a)" stroke="var(--surface-border, #3f3f46)" strokeWidth="0.5" />
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-3">
        <span className="flex items-center gap-2 text-[10px] text-muted font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald inline-block shadow-glow" /> Strong
        </span>
        <span className="flex items-center gap-2 text-[10px] text-muted font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block shadow-glow" /> Weak
        </span>
        <span className="flex items-center gap-2 text-[10px] text-muted font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-surface-light border border-surface-border inline-block" /> Neutral
        </span>
      </div>
    </div>
  );
}
