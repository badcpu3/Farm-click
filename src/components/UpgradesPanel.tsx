import React, { useState } from 'react';
import { UpgradeConfig } from '../types/game';
import { UPGRADES } from '../data/upgrades';
import { formatNumber } from '../utils/format';
import { ArrowUp, CheckCircle } from 'lucide-react';

interface UpgradesPanelProps {
  gold: number;
  upgrades: Record<string, number>;
  onBuyUpgrade: (upgradeId: string) => void;
  numberFormatKorean: boolean;
}

export const UpgradesPanel: React.FC<UpgradesPanelProps> = ({
  gold,
  upgrades,
  onBuyUpgrade,
  numberFormatKorean,
}) => {
  const [filter, setFilter] = useState<'all' | 'click' | 'idle' | 'offline' | 'market'>('all');

  const filteredUpgrades = UPGRADES.filter((u) => {
    if (filter === 'all') return true;
    return u.category === filter;
  });

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-amber-100/60 dark:bg-stone-900 rounded-xl border border-amber-200/80 dark:border-stone-800">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-amber-900 dark:text-stone-300 hover:bg-amber-200/40 dark:hover:bg-stone-800'
          }`}
        >
          전체 보기
        </button>
        <button
          onClick={() => setFilter('click')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            filter === 'click'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-amber-900 dark:text-stone-300 hover:bg-amber-200/40 dark:hover:bg-stone-800'
          }`}
        >
          👆 수확 도구
        </button>
        <button
          onClick={() => setFilter('idle')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            filter === 'idle'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-amber-900 dark:text-stone-300 hover:bg-amber-200/40 dark:hover:bg-stone-800'
          }`}
        >
          🌾 자동화 시설
        </button>
        <button
          onClick={() => setFilter('offline')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            filter === 'offline'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-amber-900 dark:text-stone-300 hover:bg-amber-200/40 dark:hover:bg-stone-800'
          }`}
        >
          💤 방치/저장고
        </button>
        <button
          onClick={() => setFilter('market')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            filter === 'market'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-amber-900 dark:text-stone-300 hover:bg-amber-200/40 dark:hover:bg-stone-800'
          }`}
        >
          🏷️ 시장/유통
        </button>
      </div>

      {/* Upgrades List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredUpgrades.map((upgrade) => {
          const currentLevel = upgrades[upgrade.id] || 0;
          const isMax = currentLevel >= upgrade.maxLevel;
          const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
          const canAfford = gold >= cost && !isMax;

          return (
            <div
              key={upgrade.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                isMax
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                  : 'bg-white/80 dark:bg-stone-900/80 border-amber-200/80 dark:border-stone-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 bg-amber-100/60 dark:bg-stone-800 rounded-xl">
                      {upgrade.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-950 dark:text-stone-100">
                        {upgrade.name}
                      </h4>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        {isMax ? '최대 레벨 도달' : `현재 Lv.${currentLevel} / Lv.${upgrade.maxLevel}`}
                      </div>
                    </div>
                  </div>
                  {isMax && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> 마스터
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 mt-2">
                  {upgrade.description}
                </p>

                {/* Effect text */}
                <div className="mt-2 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-stone-800/80 px-2.5 py-1 rounded-lg inline-block">
                  {upgrade.effectDescription(currentLevel + 1)}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-950 dark:text-stone-200">
                  {isMax ? '완료' : `${formatNumber(cost, numberFormatKorean)}원`}
                </span>

                <button
                  onClick={() => onBuyUpgrade(upgrade.id)}
                  disabled={!canAfford}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMax
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 cursor-default'
                      : canAfford
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs active:scale-95'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  {isMax ? '마스터 완료' : '시설 강화'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
