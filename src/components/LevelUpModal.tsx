import React from 'react';
import { formatNumber } from '../utils/format';
import { Sparkles, Trophy, Award } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  rewardGold: number;
  onClose: () => void;
  numberFormatKorean: boolean;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  level,
  rewardGold,
  onClose,
  numberFormatKorean,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-sm w-full p-6 border-2 border-amber-400 dark:border-amber-600 shadow-2xl text-center space-y-4">
        
        {/* Confetti / Trophy Badge */}
        <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg ring-4 ring-amber-200/50">
          <Trophy className="w-8 h-8 text-amber-900" />
        </div>

        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            축하합니다!
          </span>
          <h3 className="text-2xl font-black text-amber-950 dark:text-stone-100 mt-1">
            농장 레벨 {level} 달성!
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            목장이 더욱 번창하여 새로운 동물과 시설을 해금할 수 있게 되었습니다!
          </p>
        </div>

        {/* Level Reward */}
        <div className="bg-amber-50 dark:bg-stone-800 p-3 rounded-2xl border border-amber-200 dark:border-stone-700">
          <div className="text-[11px] text-stone-500">레벨 업 축하 지원금</div>
          <div className="text-lg font-bold text-amber-900 dark:text-amber-200 font-mono tabular-nums mt-0.5">
            +{formatNumber(rewardGold, numberFormatKorean)}원 🪙
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer"
        >
          확인하고 계속하기
        </button>
      </div>
    </div>
  );
};
