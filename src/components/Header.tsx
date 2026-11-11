import React from 'react';
import { Volume2, VolumeX, Sparkles, TrendingUp } from 'lucide-react';
import { formatNumber } from '../utils/format';

interface HeaderProps {
  gold: number;
  level: number;
  exp: number;
  expToNextLevel: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  numberFormatKorean: boolean;
  onToggleNumberFormat: () => void;
  activeTab: 'farm' | 'market' | 'upgrades' | 'achievements';
  onSelectTab: (tab: 'farm' | 'market' | 'upgrades' | 'achievements') => void;
  unclaimedAchievements: number;
}

export const Header: React.FC<HeaderProps> = ({
  gold,
  level,
  exp,
  expToNextLevel,
  soundEnabled,
  onToggleSound,
  numberFormatKorean,
  onToggleNumberFormat,
  activeTab,
  onSelectTab,
  unclaimedAchievements,
}) => {
  const expPercentage = Math.min(100, Math.max(0, (exp / expToNextLevel) * 100));

  return (
    <header className="sticky top-0 z-30 bg-amber-50/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-amber-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Zone: 1 clean line text element */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-2xl" role="img" aria-label="Farm">🌾</span>
          <div>
            <h1 className="text-lg font-bold text-amber-950 dark:text-amber-100 tracking-tight whitespace-nowrap">
              포근한 농장 타이쿤
            </h1>
            <p className="text-xs text-amber-800/70 dark:text-amber-300/70">
              Lv.{level} 전원 목장
            </p>
          </div>
        </div>

        {/* Level and Gold Status */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Gold HUD */}
          <div className="flex items-center gap-2 bg-amber-100/80 dark:bg-stone-800 px-3.5 py-1.5 rounded-xl border border-amber-300/60 dark:border-stone-700 shadow-xs">
            <span className="text-lg">🪙</span>
            <div>
              <div className="text-xs text-amber-800/80 dark:text-stone-400 font-medium">보유 자금</div>
              <div className="text-base font-bold text-amber-950 dark:text-amber-100 font-mono tabular-nums leading-tight">
                {formatNumber(gold, numberFormatKorean)}원
              </div>
            </div>
          </div>

          {/* Level & EXP Progress */}
          <div className="w-36 sm:w-48 hidden xs:block">
            <div className="flex justify-between items-center text-xs mb-1 font-medium text-amber-900 dark:text-stone-300">
              <span className="flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Lv.{level}
              </span>
              <span className="text-amber-700/80 dark:text-stone-400 font-mono tabular-nums text-[11px]">
                {Math.floor(expPercentage)}%
              </span>
            </div>
            <div className="h-2 w-full bg-amber-200/70 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${expPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-amber-100/70 dark:bg-stone-800/80 p-1 rounded-xl border border-amber-200/80 dark:border-stone-700">
          <button
            onClick={() => onSelectTab('farm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'farm'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-900 dark:text-stone-300 hover:bg-amber-200/50 dark:hover:bg-stone-700'
            }`}
          >
            🏡 목장
          </button>
          <button
            onClick={() => onSelectTab('market')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'market'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-900 dark:text-stone-300 hover:bg-amber-200/50 dark:hover:bg-stone-700'
            }`}
          >
            🛒 창고/시장
          </button>
          <button
            onClick={() => onSelectTab('upgrades')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'upgrades'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-900 dark:text-stone-300 hover:bg-amber-200/50 dark:hover:bg-stone-700'
            }`}
          >
            ⚙️ 시설강화
          </button>
          <button
            onClick={() => onSelectTab('achievements')}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-900 dark:text-stone-300 hover:bg-amber-200/50 dark:hover:bg-stone-700'
            }`}
          >
            🏆 업적
            {unclaimedAchievements > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
        </nav>

        {/* Quick Utilities: Sound toggle & Unit toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onToggleNumberFormat}
            title={numberFormatKorean ? '만/억/조 단위 사용 중' : 'K/M/B 단위 사용 중'}
            className="px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-stone-300 rounded-lg border border-amber-300/50 dark:border-stone-700 hover:bg-amber-200/60 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            {numberFormatKorean ? '단위: 만/억' : '단위: K/M/B'}
          </button>

          <button
            onClick={onToggleSound}
            title={soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
            className="p-1.5 text-amber-900 dark:text-stone-300 bg-amber-100 dark:bg-stone-800 rounded-lg border border-amber-300/50 dark:border-stone-700 hover:bg-amber-200/60 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};
