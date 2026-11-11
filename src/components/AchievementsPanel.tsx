import React from 'react';
import { GameState } from '../types/game';
import { ACHIEVEMENTS } from '../data/achievements';
import { formatNumber } from '../utils/format';
import { Trophy, CheckCircle, Award } from 'lucide-react';

interface AchievementsPanelProps {
  state: GameState;
  onClaimAchievement: (achievementId: string, reward: number) => void;
  numberFormatKorean: boolean;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  state,
  onClaimAchievement,
  numberFormatKorean,
}) => {
  const completedCount = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).length;

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="bg-white/80 dark:bg-stone-900/80 p-4 rounded-2xl border border-amber-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-amber-950 dark:text-stone-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            농장 명예의 전당 (업적)
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            목장 운영 목표를 달성하고 두둑한 장려금을 지원받으세요.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-stone-400">달성률</div>
          <div className="text-lg font-bold text-amber-900 dark:text-amber-200 font-mono tabular-nums">
            {completedCount} / {ACHIEVEMENTS.length} ({Math.floor((completedCount / ACHIEVEMENTS.length) * 100)}%)
          </div>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
        <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200/70 dark:border-stone-700">
          <div className="text-[11px] text-stone-400">총 누적 터치 수</div>
          <div className="text-sm font-bold text-stone-800 dark:text-stone-100 font-mono tabular-nums mt-0.5">
            {state.lifetimeClicks.toLocaleString()}회
          </div>
        </div>
        <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200/70 dark:border-stone-700">
          <div className="text-[11px] text-stone-400">누적 수익</div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-0.5">
            {formatNumber(state.totalGoldEarned, numberFormatKorean)}원
          </div>
        </div>
        <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200/70 dark:border-stone-700">
          <div className="text-[11px] text-stone-400">현재 농장 레벨</div>
          <div className="text-sm font-bold text-amber-700 dark:text-amber-300 font-mono tabular-nums mt-0.5">
            Lv.{state.level}
          </div>
        </div>
        <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200/70 dark:border-stone-700">
          <div className="text-[11px] text-stone-400">해금된 동물</div>
          <div className="text-sm font-bold text-stone-800 dark:text-stone-100 font-mono tabular-nums mt-0.5">
            {Object.values(state.animals).filter((a) => a.unlocked).length}종
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((item) => {
          const isClaimed = state.achievements[item.id];
          const isConditionMet = item.check(state);

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                isClaimed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                  : isConditionMet
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 ring-2 ring-amber-400/30'
                  : 'bg-white/80 dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 opacity-80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl p-2 bg-stone-100 dark:bg-stone-800 rounded-xl shrink-0">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                  <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium mt-0.5">
                    보상: +{formatNumber(item.rewardGold, numberFormatKorean)}원
                  </div>
                </div>
              </div>

              <div>
                {isClaimed ? (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 완료
                  </span>
                ) : isConditionMet ? (
                  <button
                    onClick={() => onClaimAchievement(item.id, item.rewardGold)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs animate-bounce cursor-pointer"
                  >
                    보상 수령
                  </button>
                ) : (
                  <span className="text-[11px] text-stone-400 font-medium">진행 중</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
