import React from 'react';

interface AnimalIllustrationProps {
  animalId: string;
  isPressed: boolean;
  frenzyActive: boolean;
  className?: string;
}

export const AnimalIllustration: React.FC<AnimalIllustrationProps> = ({
  animalId,
  isPressed,
  frenzyActive,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center transition-transform duration-100 select-none ${
        isPressed ? 'scale-90' : 'scale-100 hover:scale-105'
      } ${className}`}
    >
      {/* Background Soft Glow in Frenzy */}
      {frenzyActive && (
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
      )}

      {/* SVG Vectors based on Animal ID */}
      {animalId === 'chicken' && <ChickenSVG isPressed={isPressed} frenzyActive={frenzyActive} />}
      {animalId === 'duck' && <DuckSVG isPressed={isPressed} frenzyActive={frenzyActive} />}
      {animalId === 'pig' && <PigSVG isPressed={isPressed} frenzyActive={frenzyActive} />}
      {animalId === 'sheep' && <SheepSVG isPressed={isPressed} frenzyActive={frenzyActive} />}
      {animalId === 'cow' && <CowSVG isPressed={isPressed} frenzyActive={frenzyActive} />}
      {animalId === 'goat' && <GoatSVG isPressed={isPressed} frenzyActive={frenzyActive} />}
      {animalId === 'alpaca' && <AlpacaSVG isPressed={isPressed} frenzyActive={frenzyActive} />}
      {animalId === 'horse' && <HorseSVG isPressed={isPressed} frenzyActive={frenzyActive} />}
    </div>
  );
};

/* 1. CHICKEN (꼬꼬닭) */
function ChickenSVG({ isPressed, frenzyActive }: { isPressed: boolean; frenzyActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Straw Nest */}
      <ellipse cx="100" cy="165" rx="75" ry="24" fill="#E8B86D" stroke="#B47B2B" strokeWidth="3" />
      <path d="M30 160 Q60 175 100 175 Q140 175 170 160" stroke="#925E1B" strokeWidth="2.5" fill="none" />
      <ellipse cx="65" cy="160" rx="14" ry="10" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" transform="rotate(-15 65 160)" />
      <ellipse cx="135" cy="160" rx="14" ry="10" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" transform="rotate(15 135 160)" />

      {/* Plump Chicken Body */}
      <path
        d="M 55 130 C 45 80, 155 80, 145 130 C 145 165, 55 165, 55 130 Z"
        fill="#FFFFFF"
        stroke="#475569"
        strokeWidth="3.5"
      />

      {/* Red Comb */}
      <path
        d="M 85 58 C 85 45, 95 45, 98 55 C 103 42, 115 42, 116 56 C 122 46, 130 50, 126 64 Z"
        fill={frenzyActive ? '#F59E0B' : '#EF4444'}
        stroke="#991B1B"
        strokeWidth="2.5"
      />

      {/* Wings */}
      <path
        d="M 52 118 C 40 125, 42 145, 65 142 C 75 140, 78 125, 52 118 Z"
        fill="#F1F5F9"
        stroke="#475569"
        strokeWidth="2.5"
        className={isPressed ? 'rotate-[-10deg] origin-center' : ''}
      />
      <path
        d="M 148 118 C 160 125, 158 145, 135 142 C 125 140, 122 125, 148 118 Z"
        fill="#F1F5F9"
        stroke="#475569"
        strokeWidth="2.5"
        className={isPressed ? 'rotate-[10deg] origin-center' : ''}
      />

      {/* Cute Eyes: happy squint when pressed */}
      {isPressed ? (
        <>
          <path d="M 80 98 Q 88 92 96 98" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 104 98 Q 112 92 120 98" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="88" cy="95" rx="6" ry="8" fill="#1E293B" />
          <circle cx="86" cy="92" r="2.5" fill="#FFFFFF" />
          <ellipse cx="112" cy="95" rx="6" ry="8" fill="#1E293B" />
          <circle cx="110" cy="92" r="2.5" fill="#FFFFFF" />
        </>
      )}

      {/* Blushing Cheeks */}
      <ellipse cx="76" cy="106" rx="7" ry="4" fill="#FDA4AF" opacity="0.8" />
      <ellipse cx="124" cy="106" rx="7" ry="4" fill="#FDA4AF" opacity="0.8" />

      {/* Golden Beak */}
      <polygon points="94,101 106,101 100,114" fill="#F59E0B" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />

      {/* Wattle */}
      <path d="M 97 114 C 95 124, 105 124, 103 114 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
    </svg>
  );
}

/* 2. DUCK (청둥오리) */
function DuckSVG({ isPressed, frenzyActive }: { isPressed: boolean; frenzyActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Water Ripple Pond */}
      <ellipse cx="100" cy="168" rx="80" ry="20" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="3" />
      <ellipse cx="100" cy="168" rx="60" ry="12" fill="#E0F2FE" />

      {/* Body */}
      <path
        d="M 50 135 C 40 95, 150 95, 140 135 C 140 165, 50 165, 50 135 Z"
        fill="#FDE047"
        stroke="#854D0E"
        strokeWidth="3.5"
      />

      {/* Head */}
      <circle cx="100" cy="85" r="38" fill={frenzyActive ? '#FEF08A' : '#0D9488'} stroke="#115E59" strokeWidth="3.5" />

      {/* Cheeks */}
      <ellipse cx="76" cy="94" rx="7" ry="4" fill="#FDA4AF" opacity="0.85" />
      <ellipse cx="124" cy="94" rx="7" ry="4" fill="#FDA4AF" opacity="0.85" />

      {/* Eyes */}
      {isPressed ? (
        <>
          <path d="M 82 82 Q 88 76 94 82" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 106 82 Q 112 76 118 82" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="88" cy="80" r="5.5" fill="#042F2E" />
          <circle cx="86" cy="78" r="2" fill="#FFFFFF" />
          <circle cx="112" cy="80" r="5.5" fill="#042F2E" />
          <circle cx="110" cy="78" r="2" fill="#FFFFFF" />
        </>
      )}

      {/* Wide Orange Bill */}
      <ellipse cx="100" cy="96" rx="20" ry="10" fill="#F97316" stroke="#9A3412" strokeWidth="2.5" />
      <circle cx="95" cy="94" r="1.5" fill="#7C2D12" />
      <circle cx="105" cy="94" r="1.5" fill="#7C2D12" />

      {/* Feather Accent */}
      <path d="M 98 48 C 96 35, 104 35, 102 48" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* 3. PIG (미식가 아기돼지) */
function PigSVG({ isPressed, frenzyActive }: { isPressed: boolean; frenzyActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Mud / Truffle Bed */}
      <ellipse cx="100" cy="166" rx="76" ry="22" fill="#D6D3D1" stroke="#78716C" strokeWidth="2.5" />
      
      {/* Truffle next to pig */}
      <ellipse cx="145" cy="160" rx="14" ry="11" fill="#44403C" stroke="#1C1917" strokeWidth="2" />
      <circle cx="140" cy="158" r="1.5" fill="#78716C" />
      <circle cx="148" cy="162" r="1.5" fill="#78716C" />
      {frenzyActive && <circle cx="152" cy="150" r="4" fill="#F59E0B" />}

      {/* Floppy Pig Ears */}
      <path d="M 52 70 C 42 45, 75 40, 78 68 Z" fill="#F472B6" stroke="#9D174D" strokeWidth="3" />
      <path d="M 148 70 C 158 45, 125 40, 122 68 Z" fill="#F472B6" stroke="#9D174D" strokeWidth="3" />

      {/* Pig Chubby Body */}
      <circle cx="100" cy="118" r="54" fill="#FBCFE8" stroke="#BE185D" strokeWidth="3.5" />

      {/* Eyes */}
      {isPressed ? (
        <>
          <path d="M 78 100 Q 86 92 94 100" stroke="#831843" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 106 100 Q 114 92 122 100" stroke="#831843" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="85" cy="98" r="6" fill="#831843" />
          <circle cx="83" cy="95" r="2.2" fill="#FFFFFF" />
          <circle cx="115" cy="98" r="6" fill="#831843" />
          <circle cx="113" cy="95" r="2.2" fill="#FFFFFF" />
        </>
      )}

      {/* Blushing Cheeks */}
      <ellipse cx="70" cy="115" rx="8" ry="5" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="130" cy="115" rx="8" ry="5" fill="#F43F5E" opacity="0.6" />

      {/* Snout with Nostrils */}
      <ellipse cx="100" cy="120" rx="22" ry="16" fill="#F472B6" stroke="#9D174D" strokeWidth="3" />
      <ellipse cx="92" cy="120" rx="4" ry="6" fill="#831843" />
      <ellipse cx="108" cy="120" rx="4" ry="6" fill="#831843" />

      {/* Cute Smile below snout */}
      <path d="M 94 142 Q 100 148 106 142" stroke="#9D174D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* 4. SHEEP (구름송이 양) */
function SheepSVG({ isPressed, frenzyActive }: { isPressed: boolean; frenzyActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Grass Base */}
      <ellipse cx="100" cy="168" rx="75" ry="20" fill="#BBF7D0" stroke="#16A34A" strokeWidth="2.5" />
      
      {/* Four Little Legs */}
      <rect x="74" y="145" width="10" height="22" rx="5" fill="#475569" />
      <rect x="116" y="145" width="10" height="22" rx="5" fill="#475569" />

      {/* Fluffy Cloud Body Circles */}
      <g fill={frenzyActive ? '#FEF08A' : '#FFFFFF'} stroke="#CBD5E1" strokeWidth="3">
        <circle cx="65" cy="110" r="28" />
        <circle cx="135" cy="110" r="28" />
        <circle cx="100" cy="85" r="30" />
        <circle cx="100" cy="130" r="30" />
        <circle cx="75" cy="135" r="24" />
        <circle cx="125" cy="135" r="24" />
      </g>

      {/* Sheep Face */}
      <ellipse cx="100" cy="110" rx="26" ry="28" fill="#F8FAFC" stroke="#475569" strokeWidth="3" />

      {/* Droopy Ears */}
      <ellipse cx="68" cy="98" rx="14" ry="7" fill="#F1F5F9" stroke="#475569" strokeWidth="2" transform="rotate(-25 68 98)" />
      <ellipse cx="132" cy="98" rx="14" ry="7" fill="#F1F5F9" stroke="#475569" strokeWidth="2" transform="rotate(25 132 98)" />

      {/* Wool Bangs on head */}
      <circle cx="92" cy="84" r="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
      <circle cx="108" cy="84" r="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />

      {/* Eyes */}
      {isPressed ? (
        <>
          <path d="M 88 106 Q 93 100 98 106" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 102 106 Q 107 100 112 106" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="91" cy="106" r="4.5" fill="#1E293B" />
          <circle cx="90" cy="104" r="1.5" fill="#FFFFFF" />
          <circle cx="109" cy="106" r="4.5" fill="#1E293B" />
          <circle cx="108" cy="104" r="1.5" fill="#FFFFFF" />
        </>
      )}

      {/* Blushing Cheeks */}
      <ellipse cx="80" cy="116" rx="5" ry="3" fill="#FDA4AF" opacity="0.8" />
      <ellipse cx="120" cy="116" rx="5" ry="3" fill="#FDA4AF" opacity="0.8" />

      {/* Nose and Mouth */}
      <path d="M 100 116 L 98 122 Q 100 125 102 122 Z" fill="#FDA4AF" />
      <path d="M 96 126 Q 100 129 104 126" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* 5. COW (방목 젖소 얼룩이) */
function CowSVG({ isPressed, frenzyActive }: { isPressed: boolean; frenzyActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Meadow Base */}
      <ellipse cx="100" cy="168" rx="80" ry="20" fill="#DCFCE7" stroke="#15803D" strokeWidth="2.5" />

      {/* Cow Horns */}
      <path d="M 68 62 C 60 48, 76 45, 80 58 Z" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />
      <path d="M 132 62 C 140 48, 124 45, 120 58 Z" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />

      {/* Cow Ears */}
      <ellipse cx="60" cy="85" rx="18" ry="10" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" transform="rotate(-15 60 85)" />
      <ellipse cx="140" cy="85" rx="18" ry="10" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" transform="rotate(15 140 85)" />

      {/* Cow Body/Head */}
      <circle cx="100" cy="112" r="54" fill="#FFFFFF" stroke="#334155" strokeWidth="3.5" />

      {/* Black Holstein Spots */}
      <path d="M 62 80 C 70 70, 95 72, 85 95 C 75 110, 55 100, 62 80 Z" fill="#1E293B" />
      <path d="M 135 110 C 145 95, 155 115, 142 135 C 130 140, 125 125, 135 110 Z" fill="#1E293B" />

      {/* Eyes */}
      {isPressed ? (
        <>
          <path d="M 80 96 Q 88 88 96 96" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 104 96 Q 112 88 120 96" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="86" cy="96" r="6" fill="#0F172A" />
          <circle cx="84" cy="93" r="2.5" fill="#FFFFFF" />
          <circle cx="114" cy="96" r="6" fill="#0F172A" />
          <circle cx="112" cy="93" r="2.5" fill="#FFFFFF" />
        </>
      )}

      {/* Blushing Cheeks */}
      <ellipse cx="68" cy="118" rx="8" ry="5" fill="#FDA4AF" opacity="0.8" />
      <ellipse cx="132" cy="118" rx="8" ry="5" fill="#FDA4AF" opacity="0.8" />

      {/* Large Pink Muzzle */}
      <ellipse cx="100" cy="128" rx="30" ry="20" fill="#FECDD3" stroke="#E11D48" strokeWidth="2.5" />
      <circle cx="90" cy="126" r="4" fill="#9F1239" />
      <circle cx="110" cy="126" r="4" fill="#9F1239" />
      <path d="M 94 136 Q 100 142 106 136" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Brass Bell Collar */}
      <rect x="80" y="152" width="40" height="8" rx="4" fill="#DC2626" />
      <polygon points="94,160 106,160 100,172" fill={frenzyActive ? '#F59E0B' : '#EAB308'} stroke="#B45309" strokeWidth="1.5" />
    </svg>
  );
}

/* 6. GOAT (산양) */
function GoatSVG({ isPressed, frenzyActive }: { isPressed: boolean; frenzyActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Rock / Mountain Ledge */}
      <path d="M 30 170 Q 100 160 170 170 L 160 185 L 40 185 Z" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />

      {/* Curved Horns */}
      <path d="M 75 60 C 60 25, 45 40, 70 75 Z" fill="#A16207" stroke="#713F12" strokeWidth="2" />
      <path d="M 125 60 C 140 25, 155 40, 130 75 Z" fill="#A16207" stroke="#713F12" strokeWidth="2" />

      {/* Head */}
      <circle cx="100" cy="108" r="48" fill="#F8FAFC" stroke="#475569" strokeWidth="3.5" />

      {/* Droopy Ears */}
      <ellipse cx="60" cy="96" rx="16" ry="8" fill="#E2E8F0" stroke="#475569" strokeWidth="2" transform="rotate(-30 60 96)" />
      <ellipse cx="140" cy="96" rx="16" ry="8" fill="#E2E8F0" stroke="#475569" strokeWidth="2" transform="rotate(30 140 96)" />

      {/* Eyes with horizontal goat slit */}
      {isPressed ? (
        <>
          <path d="M 80 98 Q 88 92 96 98" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 104 98 Q 112 92 120 98" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="86" cy="98" r="6" fill="#F59E0B" />
          <line x1="82" y1="98" x2="90" y2="98" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="114" cy="98" r="6" fill="#F59E0B" />
          <line x1="110" y1="98" x2="118" y2="98" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        </>
      )}

      {/* Snout */}
      <ellipse cx="100" cy="124" rx="20" ry="14" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
      <circle cx="95" cy="122" r="3" fill="#9A3412" />
      <circle cx="105" cy="122" r="3" fill="#9A3412" />

      {/* Goat Beard */}
      <polygon points="94,142 106,142 100,162" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
    </svg>
  );
}

/* 7. ALPACA (알파카) */
function AlpacaSVG({ isPressed, frenzyActive }: { isPressed: boolean; frenzyActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Base */}
      <ellipse cx="100" cy="168" rx="75" ry="18" fill="#FED7AA" stroke="#F97316" strokeWidth="2.5" />

      {/* Long Fluffy Neck */}
      <rect x="80" y="80" width="40" height="70" rx="20" fill={frenzyActive ? '#FEF08A' : '#FFFFFF'} stroke="#CBD5E1" strokeWidth="3" />

      {/* Andean Scarf/Collar */}
      <rect x="76" y="130" width="48" height="12" rx="4" fill="#EF4444" />
      <path d="M 80 130 L 85 142 L 90 130 L 95 142 L 100 130 L 105 142 L 110 130 L 115 142 L 120 130" stroke="#FBBF24" strokeWidth="2" fill="none" />

      {/* Head */}
      <circle cx="100" cy="70" r="34" fill={frenzyActive ? '#FEF08A' : '#FFFFFF'} stroke="#CBD5E1" strokeWidth="3" />

      {/* Pointy Ears */}
      <polygon points="76,55 70,25 88,45" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
      <polygon points="124,55 130,25 112,45" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />

      {/* Fluffy Hair Bangs */}
      <ellipse cx="100" cy="46" rx="18" ry="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />

      {/* Eyes */}
      {isPressed ? (
        <>
          <path d="M 86 68 Q 92 62 98 68" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 102 68 Q 108 62 114 68" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="91" cy="68" r="5" fill="#1E293B" />
          <circle cx="89" cy="66" r="1.8" fill="#FFFFFF" />
          <circle cx="109" cy="68" r="5" fill="#1E293B" />
          <circle cx="107" cy="66" r="1.8" fill="#FFFFFF" />
        </>
      )}

      {/* Cheeks */}
      <ellipse cx="80" cy="76" rx="6" ry="4" fill="#FDA4AF" opacity="0.8" />
      <ellipse cx="120" cy="76" rx="6" ry="4" fill="#FDA4AF" opacity="0.8" />

      {/* Cute Alpaca Muzzle */}
      <ellipse cx="100" cy="80" rx="14" ry="10" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
      <path d="M 97 78 Q 100 82 103 78" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* 8. HORSE (명마) */
function HorseSVG({ isPressed, frenzyActive }: { isPressed: boolean; frenzyActive: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Golden Base */}
      <ellipse cx="100" cy="168" rx="80" ry="20" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" />

      {/* Flowing Mane */}
      <path
        d="M 68 50 C 45 60, 48 110, 68 135 C 75 125, 78 85, 76 65 Z"
        fill={frenzyActive ? '#F59E0B' : '#B45309'}
      />

      {/* Head */}
      <path
        d="M 78 68 C 75 45, 125 45, 122 68 C 122 100, 115 138, 100 148 C 85 138, 78 100, 78 68 Z"
        fill="#D97706"
        stroke="#78350F"
        strokeWidth="3.5"
      />

      {/* Ears */}
      <polygon points="80,50 78,25 94,44" fill="#B45309" stroke="#78350F" strokeWidth="2" />
      <polygon points="120,50 122,25 106,44" fill="#B45309" stroke="#78350F" strokeWidth="2" />

      {/* Star Marking on Forehead */}
      <polygon points="100,60 102,66 108,66 103,70 105,76 100,72 95,76 97,70 92,66 98,66" fill="#FFFFFF" />

      {/* Eyes */}
      {isPressed ? (
        <>
          <path d="M 86 86 Q 92 80 98 86" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 102 86 Q 108 80 114 86" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="91" cy="86" r="5" fill="#451A03" />
          <circle cx="89" cy="83" r="1.8" fill="#FFFFFF" />
          <circle cx="109" cy="86" r="5" fill="#451A03" />
          <circle cx="107" cy="83" r="1.8" fill="#FFFFFF" />
        </>
      )}

      {/* Muzzle */}
      <ellipse cx="100" cy="132" rx="20" ry="14" fill="#92400E" />
      <circle cx="94" cy="132" r="3" fill="#451A03" />
      <circle cx="106" cy="132" r="3" fill="#451A03" />

      {/* Golden Horseshoe Emblem */}
      <path
        d="M 94 158 C 94 152, 106 152, 106 158"
        stroke="#F59E0B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
