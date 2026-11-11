import React from 'react';
import { AnimalConfig, MarketTrend } from '../types/game';
import { formatNumber } from '../utils/format';
import { ShoppingBag, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface MarketInventoryProps {
  animals: AnimalConfig[];
  inventory: Record<string, { base: number; rare: number }>;
  onSellItem: (animalId: string, isRare: boolean, count: number) => void;
  onSellAll: () => void;
  marketTrend: MarketTrend | null;
  marketPriceMultiplier: number;
  numberFormatKorean: boolean;
  autoSellActive: boolean;
  onToggleAutoSell: () => void;
  hasAutoSellTruck: boolean;
}

export const MarketInventory: React.FC<MarketInventoryProps> = ({
  animals,
  inventory,
  onSellItem,
  onSellAll,
  marketTrend,
  marketPriceMultiplier,
  numberFormatKorean,
  autoSellActive,
  onToggleAutoSell,
  hasAutoSellTruck,
}) => {
  // Calculate total inventory value
  let totalInventoryValue = 0;
  let totalItemCount = 0;

  animals.forEach((animal) => {
    const inv = inventory[animal.id] || { base: 0, rare: 0 };
    const isTrending = marketTrend?.animalId === animal.id;
    const trendMult = isTrending ? marketTrend.multiplier : 1;

    const basePrice = Math.floor(animal.baseItemPrice * marketPriceMultiplier * trendMult);
    const rarePrice = Math.floor(animal.baseItemPrice * animal.rareItemMultiplier * marketPriceMultiplier * trendMult);

    totalInventoryValue += inv.base * basePrice + inv.rare * rarePrice;
    totalItemCount += inv.base + inv.rare;
  });

  return (
    <div className="space-y-4">
      {/* Market Trend Banner */}
      {marketTrend && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border border-amber-300 dark:border-amber-700/60 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <div className="text-xs font-bold text-amber-950 dark:text-amber-200">
                🔥 {marketTrend.headline}
              </div>
              <div className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                판매 가격 +{Math.round((marketTrend.multiplier - 1) * 100)}% 급등 중!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barn Inventory Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 dark:bg-stone-900/80 p-4 rounded-2xl border border-amber-200/80 dark:border-stone-800">
        <div>
          <div className="text-xs text-stone-500 font-medium">창고 보관 중인 수확물</div>
          <div className="text-xl font-bold text-amber-950 dark:text-stone-100 flex items-center gap-2 mt-0.5">
            <span>총 {totalItemCount.toLocaleString()}개</span>
            <span className="text-xs font-normal text-stone-400">·</span>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              가치: 약 {formatNumber(totalInventoryValue, numberFormatKorean)}원
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasAutoSellTruck && (
            <button
              onClick={onToggleAutoSell}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                autoSellActive
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              자동 출하 트럭 {autoSellActive ? '가동 중' : '정지됨'}
            </button>
          )}

          <button
            onClick={onSellAll}
            disabled={totalItemCount === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              totalItemCount > 0
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md active:scale-95'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            창고 전량 일괄 판매
          </button>
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {animals.map((animal) => {
          const inv = inventory[animal.id] || { base: 0, rare: 0 };
          const isTrending = marketTrend?.animalId === animal.id;
          const trendMult = isTrending ? marketTrend.multiplier : 1;

          const baseUnitPrice = Math.floor(animal.baseItemPrice * marketPriceMultiplier * trendMult);
          const rareUnitPrice = Math.floor(
            animal.baseItemPrice * animal.rareItemMultiplier * marketPriceMultiplier * trendMult
          );

          if (inv.base === 0 && inv.rare === 0) return null;

          return (
            <div
              key={animal.id}
              className="bg-white/80 dark:bg-stone-900/80 p-3.5 rounded-2xl border border-amber-200/80 dark:border-stone-800 space-y-3"
            >
              {/* Product title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{animal.baseItemIcon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-amber-950 dark:text-stone-100">
                      {animal.species.split(' ')[0]} 생산품
                    </h4>
                    <span className="text-[11px] text-stone-400">
                      기본 단가: {formatNumber(baseUnitPrice, numberFormatKorean)}원
                    </span>
                  </div>
                </div>

                {isTrending && (
                  <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                    인기 급상승!
                  </span>
                )}
              </div>

              {/* Standard Item Row */}
              <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl text-xs">
                <div>
                  <div className="font-semibold text-stone-800 dark:text-stone-200">
                    {animal.baseItemName}
                  </div>
                  <div className="text-stone-500 font-mono tabular-nums">
                    보유: {inv.base.toLocaleString()}개 ({formatNumber(inv.base * baseUnitPrice, numberFormatKorean)}원)
                  </div>
                </div>

                <button
                  onClick={() => onSellItem(animal.id, false, inv.base)}
                  disabled={inv.base === 0}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    inv.base > 0
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
                  }`}
                >
                  판매
                </button>
              </div>

              {/* Rare Item Row */}
              {inv.rare > 0 && (
                <div className="flex items-center justify-between bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 p-2.5 rounded-xl text-xs">
                  <div>
                    <div className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {animal.rareItemName}
                    </div>
                    <div className="text-amber-800/80 dark:text-amber-400 font-mono tabular-nums">
                      보유: {inv.rare.toLocaleString()}개 ({formatNumber(inv.rare * rareUnitPrice, numberFormatKorean)}원)
                    </div>
                  </div>

                  <button
                    onClick={() => onSellItem(animal.id, true, inv.rare)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer"
                  >
                    판매
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {totalItemCount === 0 && (
          <div className="col-span-full py-12 text-center text-stone-400 text-xs">
            현재 창고에 보관된 수확물이 없습니다. 동물을 클릭하거나 방치하여 수확해보세요!
          </div>
        )}
      </div>
    </div>
  );
};
