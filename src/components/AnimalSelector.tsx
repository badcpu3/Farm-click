import React from 'react';
import { AnimalConfig, AnimalState } from '../types/game';
import { formatNumber } from '../utils/format';
import { Lock, Check } from 'lucide-react';
import { AnimalIllustration } from './AnimalIllustration';

interface AnimalSelectorProps {
  animals: AnimalConfig[];
  animalStates: Record<string, AnimalState>;
  activeAnimalId: string;
  onSelectAnimal: (id: string) => void;
  onUnlockAnimal: (id: string) => void;
  gold: number;
  playerLevel: number;
  numberFormatKorean: boolean;
}

export const AnimalSelector: React.FC<AnimalSelectorProps> = ({
  animals,
  animalStates,
  activeAnimalId,
  onSelectAnimal,
  onUnlockAnimal,
  gold,
  playerLevel,
  numberFormatKorean,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-amber-950 dark:text-stone-200 flex items-center gap-1.5">
          <span>🐾</span>
          <span>우리 목장 동물 우리</span>
        </h3>
        <span className="text-xs text-stone-500">
          해금된 동물: {Object.values(animalStates).filter((a) => a.unlocked).length} / {animals.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {animals.map((animal) => {
          const state = animalStates[animal.id] || {
            level: 1,
            autoWorkers: 0,
            unlocked: false,
            totalHarvested: 0,
            totalRareHarvested: 0,
          };
          const isActive = animal.id === activeAnimalId;
          const isUnlocked = state.unlocked;
          const meetsLevel = playerLevel >= animal.unlockLevel;
          const canAfford = gold >= animal.unlockCost;
          const canUnlock = meetsLevel && canAfford && !isUnlocked;

          if (isUnlocked) {
            return (
              <button
                key={animal.id}
                onClick={() => onSelectAnimal(animal.id)}
                className={`relative flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-100 dark:bg-stone-800 border-amber-500 dark:border-amber-400 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-white/80 dark:bg-stone-900/80 border-amber-200/80 dark:border-stone-800 hover:border-amber-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-amber-50 dark:bg-stone-800 border border-amber-200/50 dark:border-stone-700 flex items-center justify-center p-1">
                  <AnimalIllustration
                    animalId={animal.id}
                    isPressed={false}
                    frenzyActive={false}
                    className="w-10 h-10"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 dark:text-stone-100 truncate">
                      {animal.species.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-mono font-semibold">
                      Lv.{state.level}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                    <span>{animal.baseItemIcon}</span>
                    <span className="truncate">{animal.baseItemName}</span>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          }

          // Locked Card
          return (
            <div
              key={animal.id}
              className="relative flex flex-col justify-between p-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 opacity-90"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-stone-600 dark:text-stone-300 truncate">
                    {animal.species.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {meetsLevel ? (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold font-mono tabular-nums">
                        {formatNumber(animal.unlockCost, numberFormatKorean)}원
                      </span>
                    ) : (
                      <span className="text-stone-400">Lv.{animal.unlockLevel} 해금</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onUnlockAnimal(animal.id)}
                disabled={!canUnlock}
                className={`w-full py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  canUnlock
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
                }`}
              >
                {canUnlock ? '우리 입식하기' : meetsLevel ? '골드 부족' : `Lv.${animal.unlockLevel} 필요`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
