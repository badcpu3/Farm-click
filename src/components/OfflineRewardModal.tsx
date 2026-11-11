import React from 'react';
import { OfflineSummary } from '../types/game';
import { formatNumber, formatTimeDuration } from '../utils/format';
import { Moon, Sparkles, Check } from 'lucide-react';

interface OfflineRewardModalProps {
  summary: OfflineSummary;
  onClaim: () => void;
  numberFormatKorean: boolean;
}

export const OfflineRewardModal: React.FC<OfflineRewardModalProps> = ({
  summary,
  onClaim,
  numberFormatKorean,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 border border-amber-300 dark:border-stone-700 shadow-2xl text-center space-y-4">
        
        {/* Header Icon */}
        <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-md">
          <Moon className="w-8 h-8 text-amber-900 fill-amber-900" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-amber-950 dark:text-stone-100">
            어서오세요, 농장주님!
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            자리를 비우신 동안 농장의 동물들과 일꾼들이 부지런히 일했습니다.
          </p>
        </div>

        {/* Offline Stats Banner */}
        <div className="bg-amber-50 dark:bg-stone-800/80 p-3.5 rounded-2xl border border-amber-200/80 dark:border-stone-700 text-left text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-stone-500">외출 시간</span>
            <span className="font-bold text-amber-950 dark:text-stone-200 font-mono">
              {formatTimeDuration(summary.secondsOffline)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500">방치 수확 효율</span>
            <span className="font-bold text-amber-700 dark:text-amber-400 font-mono">
              {Math.round(summary.efficiency * 100)}% (직접 플레이 대비)
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-amber-200/60 dark:border-stone-700">
            <span className="text-stone-700 dark:text-stone-300 font-bold">수확 가치 환산</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
              +{formatNumber(summary.goldEarned, numberFormatKorean)}원 상당
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="max-h-40 overflow-y-auto space-y-1.5 text-left text-xs pr-1">
          {Object.entries(summary.itemsProduced).map(([animalId, item]) => {
            if (item.base === 0 && item.rare === 0) return null;
            return (
              <div
                key={animalId}
                className="flex items-center justify-between p-2 bg-stone-50 dark:bg-stone-800/50 rounded-xl"
              >
                <span className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </span>
                <span className="font-mono font-bold text-amber-900 dark:text-amber-300">
                  +{item.base.toLocaleString()}개
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClaim}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-sm shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          수확물 모두 창고에 넣기
        </button>

      </div>
    </div>
  );
};
