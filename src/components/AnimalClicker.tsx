import React, { useRef } from 'react';
import { AnimalConfig, AnimalState, ClickParticle } from '../types/game';
import { formatNumber } from '../utils/format';
import { Sparkles, Zap, ArrowUpCircle, Users } from 'lucide-react';
import { Farm3DCanvas } from './Farm3DCanvas';

interface AnimalClickerProps {
  animal: AnimalConfig;
  state: AnimalState;
  gold: number;
  clickMultiplier: number;
  autoMultiplier: number;
  frenzyActive: boolean;
  frenzyMultiplier: number;
  frenzyProgress: number; // 0 to 100
  onAnimalClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onUpgradeAnimalLevel: (animalId: string) => void;
  onBuyWorker: (animalId: string) => void;
  levelUpgradeCost: number;
  workerCost: number;
  particles: ClickParticle[];
  numberFormatKorean: boolean;
}

export const AnimalClicker: React.FC<AnimalClickerProps> = ({
  animal,
  state,
  gold,
  clickMultiplier,
  autoMultiplier,
  frenzyActive,
  frenzyMultiplier,
  frenzyProgress,
  onAnimalClick,
  onUpgradeAnimalLevel,
  onBuyWorker,
  levelUpgradeCost,
  workerCost,
  particles,
  numberFormatKorean,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculated yields
  const effectiveClickYield = Math.floor(
    animal.baseClickYield * (1 + (state.level - 1) * 0.5) * clickMultiplier * (frenzyActive ? frenzyMultiplier : 1)
  );

  const effectiveAutoPerSec = (
    animal.baseAutoPerSec * (1 + (state.level - 1) * 0.3) * (1 + state.autoWorkers * 0.8) * autoMultiplier
  ).toFixed(1);

  const canAffordLevel = gold >= levelUpgradeCost;
  const canAffordWorker = gold >= workerCost;

  return (
    <div className="flex flex-col items-center">
      
      {/* Paddock / Pen Header */}
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            {animal.species}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-bold">
            Lv.{state.level}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-amber-950 dark:text-stone-100 mt-0.5 flex items-center justify-center gap-1.5">
          <span>{animal.name}</span>
          <span className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-md font-mono">
            3D WebGL
          </span>
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto mt-0.5">
          {animal.description} (3D 모델을 클릭해 수확하고 드래그해 감상해보세요!)
        </p>
      </div>

      {/* Frenzy / Fever Meter */}
      <div className="w-full max-w-sm mb-3">
        <div className="flex items-center justify-between text-xs font-semibold mb-1">
          <span className={`flex items-center gap-1 ${frenzyActive ? 'text-amber-600 dark:text-amber-400 font-bold animate-pulse' : 'text-stone-500'}`}>
            <Zap className={`w-3.5 h-3.5 ${frenzyActive ? 'fill-amber-500 text-amber-500' : ''}`} />
            {frenzyActive ? `열정 수확 피버! (x${frenzyMultiplier.toFixed(1)} 부스트)` : '수확 콤보 게이지'}
          </span>
          <span className="text-stone-400 font-mono text-[11px]">{Math.floor(frenzyProgress)}%</span>
        </div>
        <div className="h-2.5 w-full bg-amber-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-amber-200 dark:border-stone-700">
          <div
            className={`h-full rounded-full transition-all duration-150 ${
              frenzyActive
                ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 animate-pulse shadow-sm'
                : 'bg-gradient-to-r from-amber-400 to-amber-500'
            }`}
            style={{ width: `${frenzyProgress}%` }}
          />
        </div>
      </div>

      {/* Big 3D Animal Click Arena */}
      <div
        ref={containerRef}
        className={`relative w-full max-w-md h-80 sm:h-92 rounded-3xl select-none p-2 transition-all duration-150 ease-out flex items-center justify-center ${
          frenzyActive
            ? 'ring-4 ring-amber-400 ring-offset-4 ring-offset-amber-50 dark:ring-offset-stone-900 shadow-2xl bg-gradient-to-b from-amber-100/90 to-amber-200/90 dark:from-stone-800 dark:to-stone-900'
            : 'shadow-xl hover:shadow-2xl bg-[#FCF8F2] dark:bg-stone-900'
        } border-3 border-amber-200 dark:border-stone-700 overflow-hidden`}
      >
        {/* 3D Three.js WebGL Canvas */}
        <Farm3DCanvas
          animalId={animal.id}
          frenzyActive={frenzyActive}
          onAnimalClick={onAnimalClick}
        />

        {/* Floating particles from clicks */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none font-bold text-base sm:text-lg animate-float-up flex items-center gap-1.5 z-20 drop-shadow-lg"
            style={{
              left: `${Math.min(Math.max(p.x, 30), 280)}px`,
              top: `${Math.min(Math.max(p.y, 40), 240)}px`,
              color: p.isRare ? '#eab308' : '#78350f',
            }}
          >
            <span>{p.icon}</span>
            <span className={p.isRare ? 'text-amber-500 font-extrabold text-xl' : 'text-amber-950 dark:text-amber-200'}>
              {p.text}
            </span>
          </div>
        ))}

        {/* Quick Click Hint Pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full pointer-events-none tracking-wide z-10 whitespace-nowrap shadow-sm">
          3D 동물 클릭하여 {animal.baseItemName} 수확!
        </div>
      </div>

      {/* Production Rate Strip */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4 text-center">
        <div className="bg-amber-100/50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-amber-200/60 dark:border-stone-700">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
            터치당 수확량
          </div>
          <div className="text-base font-bold text-amber-900 dark:text-amber-200 font-mono tabular-nums flex items-center justify-center gap-1">
            <span>+{effectiveClickYield}</span>
            <span>{animal.baseItemIcon}</span>
          </div>
        </div>

        <div className="bg-amber-100/50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-amber-200/60 dark:border-stone-700">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
            초당 자동 수확 (방치)
          </div>
          <div className="text-base font-bold text-emerald-800 dark:text-emerald-300 font-mono tabular-nums flex items-center justify-center gap-1">
            <span>+{effectiveAutoPerSec}</span>
            <span>{animal.baseItemIcon}/s</span>
          </div>
        </div>
      </div>

      {/* Animal Level-Up & Worker Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-sm mt-3">
        {/* Animal Level Upgrade */}
        <button
          onClick={() => onUpgradeAnimalLevel(animal.id)}
          disabled={!canAffordLevel}
          className={`flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
            canAffordLevel
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md active:scale-98'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <div className="font-bold">성장 레벨 업</div>
              <div className="text-[10px] opacity-90">생산량 +50%</div>
            </div>
          </div>
          <div className="font-mono tabular-nums font-bold text-right">
            {formatNumber(levelUpgradeCost, numberFormatKorean)}원
          </div>
        </button>

        {/* Worker Helper */}
        <button
          onClick={() => onBuyWorker(animal.id)}
          disabled={!canAffordWorker}
          className={`flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
            canAffordWorker
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-98'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <div className="font-bold">사육 조수 고용</div>
              <div className="text-[10px] opacity-90">({state.autoWorkers}명 근무 중)</div>
            </div>
          </div>
          <div className="font-mono tabular-nums font-bold text-right">
            {formatNumber(workerCost, numberFormatKorean)}원
          </div>
        </button>
      </div>

    </div>
  );
};
