import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GameState, ClickParticle, OfflineSummary, MarketTrend } from './types/game';
import { ANIMALS } from './data/animals';
import { UPGRADES } from './data/upgrades';
import { ACHIEVEMENTS } from './data/achievements';
import { SoundEngine } from './utils/audio';
import { formatNumber } from './utils/format';
import { Header } from './components/Header';
import { AnimalClicker } from './components/AnimalClicker';
import { AnimalSelector } from './components/AnimalSelector';
import { MarketInventory } from './components/MarketInventory';
import { UpgradesPanel } from './components/UpgradesPanel';
import { AchievementsPanel } from './components/AchievementsPanel';
import { OfflineRewardModal } from './components/OfflineRewardModal';
import { LevelUpModal } from './components/LevelUpModal';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'cozy_farm_clicker_save_v1';

function calculateExpToNextLevel(level: number): number {
  return Math.floor(80 * Math.pow(1.22, level - 1));
}

const DEFAULT_STATE: GameState = {
  gold: 0,
  totalGoldEarned: 0,
  level: 1,
  exp: 0,
  expToNextLevel: calculateExpToNextLevel(1),
  activeAnimalId: 'chicken',
  animals: {
    chicken: { level: 1, autoWorkers: 0, unlocked: true, totalHarvested: 0, totalRareHarvested: 0 },
    duck: { level: 1, autoWorkers: 0, unlocked: false, totalHarvested: 0, totalRareHarvested: 0 },
    pig: { level: 1, autoWorkers: 0, unlocked: false, totalHarvested: 0, totalRareHarvested: 0 },
    sheep: { level: 1, autoWorkers: 0, unlocked: false, totalHarvested: 0, totalRareHarvested: 0 },
    cow: { level: 1, autoWorkers: 0, unlocked: false, totalHarvested: 0, totalRareHarvested: 0 },
    goat: { level: 1, autoWorkers: 0, unlocked: false, totalHarvested: 0, totalRareHarvested: 0 },
    alpaca: { level: 1, autoWorkers: 0, unlocked: false, totalHarvested: 0, totalRareHarvested: 0 },
    horse: { level: 1, autoWorkers: 0, unlocked: false, totalHarvested: 0, totalRareHarvested: 0 },
  },
  inventory: {
    chicken: { base: 0, rare: 0 },
    duck: { base: 0, rare: 0 },
    pig: { base: 0, rare: 0 },
    sheep: { base: 0, rare: 0 },
    cow: { base: 0, rare: 0 },
    goat: { base: 0, rare: 0 },
    alpaca: { base: 0, rare: 0 },
    horse: { base: 0, rare: 0 },
  },
  upgrades: {},
  achievements: {},
  soundEnabled: true,
  numberFormatKorean: true,
  lastActiveTimestamp: Date.now(),
  lifetimeClicks: 0,
  autoSellEnabled: true,
};

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure schema consistency
        return {
          ...DEFAULT_STATE,
          ...parsed,
          animals: { ...DEFAULT_STATE.animals, ...(parsed.animals || {}) },
          inventory: { ...DEFAULT_STATE.inventory, ...(parsed.inventory || {}) },
          upgrades: { ...(parsed.upgrades || {}) },
          achievements: { ...(parsed.achievements || {}) },
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_STATE;
  });

  const [activeTab, setActiveTab] = useState<'farm' | 'market' | 'upgrades' | 'achievements'>('farm');
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [offlineSummary, setOfflineSummary] = useState<OfflineSummary | null>(null);
  const [levelUpModalData, setLevelUpModalData] = useState<{ level: number; reward: number } | null>(null);

  // Combo / Frenzy State
  const [frenzyProgress, setFrenzyProgress] = useState(0);
  const [frenzyActive, setFrenzyActive] = useState(false);
  const lastClickTimeRef = useRef<number>(Date.now());

  // Market Trend State
  const [marketTrend, setMarketTrend] = useState<MarketTrend | null>(null);

  // Derived Multipliers from Upgrades
  const goldenGlovesLevel = state.upgrades['golden_gloves'] || 0;
  const clickMultiplier = 1 + goldenGlovesLevel * 1.0;

  const luckyCloverLevel = state.upgrades['lucky_clover'] || 0;
  const rareDropChance = 0.04 + luckyCloverLevel * 0.015; // 4% base up to ~26%

  const frenzyBuffLevel = state.upgrades['farmer_frenzy'] || 0;
  const frenzyMultiplier = 2.0 + frenzyBuffLevel * 0.2;

  const autoFeedersLevel = state.upgrades['auto_feeders'] || 0;
  const greenPastureLevel = state.upgrades['green_pasture'] || 0;
  const autoMultiplier = (1 + autoFeedersLevel * 0.15) * (1 + greenPastureLevel * 0.2);

  const directMarketLevel = state.upgrades['direct_market'] || 0;
  const marketPriceMultiplier = 1 + directMarketLevel * 0.15;

  const coldSiloLevel = state.upgrades['cold_silo'] || 0;
  const offlineEfficiency = 0.35 + coldSiloLevel * 0.06; // 35% ~ 95% (lower than active as requested)

  const watchdogLevel = state.upgrades['farm_watchdog'] || 0;
  const maxOfflineSeconds = (2 + watchdogLevel * 2) * 3600; // 2h up to 18h

  const deliveryTruckLevel = state.upgrades['delivery_truck'] || 0;
  const hasAutoSellTruck = deliveryTruckLevel > 0;

  // 1. Offline AFK Check on Mount
  useEffect(() => {
    const lastTime = state.lastActiveTimestamp;
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastTime) / 1000);

    // If away for more than 15 seconds, calculate offline idle yields
    if (elapsedSeconds > 15) {
      const effectiveOfflineSec = Math.min(elapsedSeconds, maxOfflineSeconds);
      const itemsProduced: Record<string, { base: number; rare: number; name: string; icon: string }> = {};
      let totalEstGold = 0;

      ANIMALS.forEach((animal) => {
        const animState = state.animals[animal.id];
        if (animState?.unlocked) {
          const autoRate =
            animal.baseAutoPerSec *
            (1 + (animState.level - 1) * 0.3) *
            (1 + animState.autoWorkers * 0.8) *
            autoMultiplier;

          const baseCount = Math.floor(autoRate * effectiveOfflineSec * offlineEfficiency);
          if (baseCount > 0) {
            itemsProduced[animal.id] = {
              base: baseCount,
              rare: 0,
              name: animal.baseItemName,
              icon: animal.baseItemIcon,
            };
            totalEstGold += baseCount * animal.baseItemPrice * marketPriceMultiplier;
          }
        }
      });

      if (Object.keys(itemsProduced).length > 0) {
        setOfflineSummary({
          secondsOffline: elapsedSeconds,
          efficiency: offlineEfficiency,
          goldEarned: Math.floor(totalEstGold),
          itemsProduced,
        });
      }
    }
  }, []);

  // 2. Periodic Save to localStorage
  useEffect(() => {
    const saveState = () => {
      const stateToSave = {
        ...state,
        lastActiveTimestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    };

    const interval = setInterval(saveState, 3000);
    window.addEventListener('beforeunload', saveState);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', saveState);
    };
  }, [state]);

  // 3. Game Loop (1 second tick for auto harvest & auto-sell)
  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => {
        let newInventory = { ...prev.inventory };
        let newAnimals = { ...prev.animals };
        let addedGold = 0;
        let addedExp = 0;

        // Auto harvest for each unlocked animal
        ANIMALS.forEach((animal) => {
          const aState = newAnimals[animal.id];
          if (aState?.unlocked) {
            const autoRate =
              animal.baseAutoPerSec *
              (1 + (aState.level - 1) * 0.3) *
              (1 + aState.autoWorkers * 0.8) *
              autoMultiplier;

            if (autoRate > 0) {
              const currentInv = newInventory[animal.id] || { base: 0, rare: 0 };
              // Roll whole items or fractional accumulator
              const countToAdd = Math.random() < autoRate % 1 ? Math.floor(autoRate) + 1 : Math.floor(autoRate);
              if (countToAdd > 0) {
                newInventory[animal.id] = {
                  ...currentInv,
                  base: currentInv.base + countToAdd,
                };
                newAnimals[animal.id] = {
                  ...aState,
                  totalHarvested: aState.totalHarvested + countToAdd,
                };
                addedExp += Math.max(1, Math.floor(countToAdd * 0.5));
              }
            }
          }
        });

        // Delivery truck auto sell (if unlocked & enabled)
        if (hasAutoSellTruck && prev.autoSellEnabled) {
          const sellFraction = 0.2 * deliveryTruckLevel; // sells part of inventory
          ANIMALS.forEach((animal) => {
            const inv = newInventory[animal.id];
            if (inv && inv.base > 0) {
              const countToSell = Math.max(1, Math.floor(inv.base * sellFraction));
              const isTrending = marketTrend?.animalId === animal.id;
              const trendMult = isTrending ? marketTrend.multiplier : 1;
              const price = Math.floor(animal.baseItemPrice * marketPriceMultiplier * trendMult);
              const income = countToSell * price;

              addedGold += income;
              newInventory[animal.id] = {
                ...inv,
                base: inv.base - countToSell,
              };
            }
          });
        }

        // Handle Level up check
        let curLevel = prev.level;
        let curExp = prev.exp + addedExp;
        let expNeeded = prev.expToNextLevel;

        while (curExp >= expNeeded) {
          curExp -= expNeeded;
          curLevel += 1;
          expNeeded = calculateExpToNextLevel(curLevel);
          // Level up bonus reward
          const reward = curLevel * 250;
          addedGold += reward;
          SoundEngine.playLevelUp(prev.soundEnabled);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          setLevelUpModalData({ level: curLevel, reward });
        }

        return {
          ...prev,
          gold: prev.gold + addedGold,
          totalGoldEarned: prev.totalGoldEarned + addedGold,
          level: curLevel,
          exp: curExp,
          expToNextLevel: expNeeded,
          animals: newAnimals,
          inventory: newInventory,
          lastActiveTimestamp: Date.now(),
        };
      });

      // Frenzy Decay
      setFrenzyProgress((prev) => {
        if (Date.now() - lastClickTimeRef.current > 1500) {
          const decayed = Math.max(0, prev - 4);
          if (decayed === 0 && frenzyActive) {
            setFrenzyActive(false);
          }
          return decayed;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoMultiplier, marketPriceMultiplier, deliveryTruckLevel, hasAutoSellTruck, marketTrend, frenzyActive]);

  // 4. Market Trends Generator (Random event every 75s)
  useEffect(() => {
    const trendTimer = setInterval(() => {
      const unlockedAnimals = ANIMALS.filter((a) => state.animals[a.id]?.unlocked);
      if (unlockedAnimals.length > 0) {
        const target = unlockedAnimals[Math.floor(Math.random() * unlockedAnimals.length)];
        const multiplier = 1.5 + Math.random() * 0.5; // +50% ~ +100%
        setMarketTrend({
          animalId: target.id,
          multiplier: parseFloat(multiplier.toFixed(2)),
          expiresAt: Date.now() + 45000,
          headline: `도시 백화점에서 ${target.species.split(' ')[0]} 특산품 긴급 발주 주문!`,
        });

        setTimeout(() => {
          setMarketTrend(null);
        }, 45000);
      }
    }, 75000);

    return () => clearInterval(trendTimer);
  }, [state.animals]);

  // 5. Active Animal Click Handler
  const handleAnimalClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const activeAnimal = ANIMALS.find((a) => a.id === state.activeAnimalId) || ANIMALS[0];
      const animState = state.animals[activeAnimal.id] || { level: 1, autoWorkers: 0, unlocked: true, totalHarvested: 0, totalRareHarvested: 0 };

      // Frenzy combo calculation
      lastClickTimeRef.current = Date.now();
      setFrenzyProgress((prev) => {
        const next = Math.min(100, prev + 9);
        if (next >= 100 && !frenzyActive) {
          setFrenzyActive(true);
          SoundEngine.playRareDrop(state.soundEnabled);
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        }
        return next;
      });

      // Calculate yield
      const yieldCount = Math.floor(
        activeAnimal.baseClickYield *
          (1 + (animState.level - 1) * 0.5) *
          clickMultiplier *
          (frenzyActive ? frenzyMultiplier : 1)
      );

      // Rare drop chance
      const isRare = Math.random() < rareDropChance;
      const rareCount = isRare ? 1 : 0;

      // Particle at click position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - 20;
      const y = e.clientY - rect.top - 20;
      const pId = Date.now() + Math.random();

      setParticles((prev) => [
        ...prev.slice(-12),
        {
          id: pId,
          x,
          y,
          text: isRare ? `+1 ${activeAnimal.rareItemName}!` : `+${yieldCount}`,
          icon: isRare ? activeAnimal.rareItemIcon : activeAnimal.baseItemIcon,
          isRare,
        },
      ]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== pId));
      }, 800);

      // Audio
      if (isRare) {
        SoundEngine.playRareDrop(state.soundEnabled);
      } else {
        SoundEngine.playClick(state.soundEnabled);
      }

      // Add to inventory & grant EXP
      const expEarned = yieldCount + (isRare ? 10 : 0);

      setState((prev) => {
        const curInv = prev.inventory[activeAnimal.id] || { base: 0, rare: 0 };
        const updatedInv = {
          ...prev.inventory,
          [activeAnimal.id]: {
            base: curInv.base + yieldCount,
            rare: curInv.rare + rareCount,
          },
        };

        const curAnim = prev.animals[activeAnimal.id];
        const updatedAnim = {
          ...prev.animals,
          [activeAnimal.id]: {
            ...curAnim,
            totalHarvested: curAnim.totalHarvested + yieldCount,
            totalRareHarvested: curAnim.totalRareHarvested + rareCount,
          },
        };

        let newExp = prev.exp + expEarned;
        let newLevel = prev.level;
        let expNeed = prev.expToNextLevel;

        while (newExp >= expNeed) {
          newExp -= expNeed;
          newLevel += 1;
          expNeed = calculateExpToNextLevel(newLevel);
          SoundEngine.playLevelUp(prev.soundEnabled);
          confetti({ particleCount: 70, spread: 60 });
          setLevelUpModalData({ level: newLevel, reward: newLevel * 250 });
        }

        return {
          ...prev,
          lifetimeClicks: prev.lifetimeClicks + 1,
          exp: newExp,
          level: newLevel,
          expToNextLevel: expNeed,
          inventory: updatedInv,
          animals: updatedAnim,
        };
      });
    },
    [state.activeAnimalId, state.animals, state.soundEnabled, clickMultiplier, frenzyActive, frenzyMultiplier, rareDropChance]
  );

  // Upgrade Animal Level
  const handleUpgradeAnimalLevel = (animalId: string) => {
    const aState = state.animals[animalId];
    if (!aState) return;
    const cost = Math.floor(100 * Math.pow(1.6, aState.level));
    if (state.gold < cost) return;

    SoundEngine.playUnlock(state.soundEnabled);
    setState((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      animals: {
        ...prev.animals,
        [animalId]: {
          ...aState,
          level: aState.level + 1,
        },
      },
    }));
  };

  // Hire Worker Helper
  const handleBuyWorker = (animalId: string) => {
    const aState = state.animals[animalId];
    if (!aState) return;
    const cost = Math.floor(150 * Math.pow(1.7, aState.autoWorkers));
    if (state.gold < cost) return;

    SoundEngine.playCoin(state.soundEnabled);
    setState((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      animals: {
        ...prev.animals,
        [animalId]: {
          ...aState,
          autoWorkers: aState.autoWorkers + 1,
        },
      },
    }));
  };

  // Unlock Animal Pen
  const handleUnlockAnimal = (animalId: string) => {
    const animal = ANIMALS.find((a) => a.id === animalId);
    if (!animal) return;
    if (state.gold < animal.unlockCost || state.level < animal.unlockLevel) return;

    SoundEngine.playUnlock(state.soundEnabled);
    SoundEngine.playAnimalCheer(state.soundEnabled, animal.id);
    confetti({ particleCount: 60, spread: 60 });

    setState((prev) => ({
      ...prev,
      gold: prev.gold - animal.unlockCost,
      activeAnimalId: animal.id,
      animals: {
        ...prev.animals,
        [animalId]: {
          level: 1,
          autoWorkers: 0,
          unlocked: true,
          totalHarvested: 0,
          totalRareHarvested: 0,
        },
      },
    }));
  };

  // Sell Specific Item
  const handleSellItem = (animalId: string, isRare: boolean, count: number) => {
    const animal = ANIMALS.find((a) => a.id === animalId);
    if (!animal || count <= 0) return;

    const isTrending = marketTrend?.animalId === animal.id;
    const trendMult = isTrending ? marketTrend.multiplier : 1;
    const unitPrice = isRare
      ? Math.floor(animal.baseItemPrice * animal.rareItemMultiplier * marketPriceMultiplier * trendMult)
      : Math.floor(animal.baseItemPrice * marketPriceMultiplier * trendMult);

    const totalIncome = count * unitPrice;
    SoundEngine.playCoin(state.soundEnabled);

    setState((prev) => {
      const curInv = prev.inventory[animalId] || { base: 0, rare: 0 };
      const nextInv = {
        ...curInv,
        [isRare ? 'rare' : 'base']: Math.max(0, curInv[isRare ? 'rare' : 'base'] - count),
      };

      return {
        ...prev,
        gold: prev.gold + totalIncome,
        totalGoldEarned: prev.totalGoldEarned + totalIncome,
        inventory: {
          ...prev.inventory,
          [animalId]: nextInv,
        },
      };
    });
  };

  // Sell All Items in Barn
  const handleSellAll = () => {
    let totalIncome = 0;
    const newInventory = { ...state.inventory };

    ANIMALS.forEach((animal) => {
      const inv = newInventory[animal.id];
      if (inv) {
        const isTrending = marketTrend?.animalId === animal.id;
        const trendMult = isTrending ? marketTrend.multiplier : 1;

        const basePrice = Math.floor(animal.baseItemPrice * marketPriceMultiplier * trendMult);
        const rarePrice = Math.floor(animal.baseItemPrice * animal.rareItemMultiplier * marketPriceMultiplier * trendMult);

        totalIncome += inv.base * basePrice + inv.rare * rarePrice;
        newInventory[animal.id] = { base: 0, rare: 0 };
      }
    });

    if (totalIncome > 0) {
      SoundEngine.playCoin(state.soundEnabled);
      confetti({ particleCount: 40, spread: 50 });
      setState((prev) => ({
        ...prev,
        gold: prev.gold + totalIncome,
        totalGoldEarned: prev.totalGoldEarned + totalIncome,
        inventory: newInventory,
      }));
    }
  };

  // Buy Facility Upgrade
  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = UPGRADES.find((u) => u.id === upgradeId);
    if (!upgrade) return;

    const curLvl = state.upgrades[upgradeId] || 0;
    if (curLvl >= upgrade.maxLevel) return;

    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, curLvl));
    if (state.gold < cost) return;

    SoundEngine.playUnlock(state.soundEnabled);
    setState((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      upgrades: {
        ...prev.upgrades,
        [upgradeId]: curLvl + 1,
      },
    }));
  };

  // Claim Achievement
  const handleClaimAchievement = (achievementId: string, rewardGold: number) => {
    SoundEngine.playCoin(state.soundEnabled);
    confetti({ particleCount: 50, spread: 60 });
    setState((prev) => ({
      ...prev,
      gold: prev.gold + rewardGold,
      totalGoldEarned: prev.totalGoldEarned + rewardGold,
      achievements: {
        ...prev.achievements,
        [achievementId]: true,
      },
    }));
  };

  // Claim Offline Rewards
  const handleClaimOffline = () => {
    if (!offlineSummary) return;
    SoundEngine.playCoin(state.soundEnabled);
    confetti({ particleCount: 70, spread: 70 });

    setState((prev) => {
      const newInventory = { ...prev.inventory };
      Object.entries(offlineSummary.itemsProduced).forEach(([animalId, item]) => {
        const cur = newInventory[animalId] || { base: 0, rare: 0 };
        newInventory[animalId] = {
          ...cur,
          base: cur.base + item.base,
        };
      });

      return {
        ...prev,
        inventory: newInventory,
      };
    });

    setOfflineSummary(null);
  };

  // Reset Game
  const handleResetGame = () => {
    if (window.confirm('정말로 농장을 초기화하시겠습니까? 모든 진행 상황이 리셋됩니다.')) {
      localStorage.removeItem(STORAGE_KEY);
      setState(DEFAULT_STATE);
    }
  };

  const activeAnimal = ANIMALS.find((a) => a.id === state.activeAnimalId) || ANIMALS[0];
  const activeAnimalState = state.animals[activeAnimal.id] || {
    level: 1,
    autoWorkers: 0,
    unlocked: true,
    totalHarvested: 0,
    totalRareHarvested: 0,
  };

  const levelUpgradeCost = Math.floor(100 * Math.pow(1.6, activeAnimalState.level));
  const workerCost = Math.floor(150 * Math.pow(1.7, activeAnimalState.autoWorkers));

  // Count unclaimed achievements
  const unclaimedAchievements = ACHIEVEMENTS.filter((a) => !state.achievements[a.id] && a.check(state)).length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        gold={state.gold}
        level={state.level}
        exp={state.exp}
        expToNextLevel={state.expToNextLevel}
        soundEnabled={state.soundEnabled}
        onToggleSound={() => setState((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
        numberFormatKorean={state.numberFormatKorean}
        onToggleNumberFormat={() => setState((p) => ({ ...p, numberFormatKorean: !p.numberFormatKorean }))}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unclaimedAchievements={unclaimedAchievements}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5">
        {activeTab === 'farm' && (
          <div className="space-y-6">
            
            {/* Animal Clicker & Pasture Section */}
            <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl border border-amber-200/80 dark:border-stone-800 p-4 sm:p-6 shadow-sm">
              <AnimalClicker
                animal={activeAnimal}
                state={activeAnimalState}
                gold={state.gold}
                clickMultiplier={clickMultiplier}
                autoMultiplier={autoMultiplier}
                frenzyActive={frenzyActive}
                frenzyMultiplier={frenzyMultiplier}
                frenzyProgress={frenzyProgress}
                onAnimalClick={handleAnimalClick}
                onUpgradeAnimalLevel={handleUpgradeAnimalLevel}
                onBuyWorker={handleBuyWorker}
                levelUpgradeCost={levelUpgradeCost}
                workerCost={workerCost}
                particles={particles}
                numberFormatKorean={state.numberFormatKorean}
              />
            </div>

            {/* Animal Pens Selector */}
            <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl border border-amber-200/80 dark:border-stone-800 p-4 sm:p-5 shadow-sm">
              <AnimalSelector
                animals={ANIMALS}
                animalStates={state.animals}
                activeAnimalId={state.activeAnimalId}
                onSelectAnimal={(id) => {
                  SoundEngine.playAnimalCheer(state.soundEnabled, id);
                  setState((p) => ({ ...p, activeAnimalId: id }));
                }}
                onUnlockAnimal={handleUnlockAnimal}
                gold={state.gold}
                playerLevel={state.level}
                numberFormatKorean={state.numberFormatKorean}
              />
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <MarketInventory
            animals={ANIMALS}
            inventory={state.inventory}
            onSellItem={handleSellItem}
            onSellAll={handleSellAll}
            marketTrend={marketTrend}
            marketPriceMultiplier={marketPriceMultiplier}
            numberFormatKorean={state.numberFormatKorean}
            autoSellActive={state.autoSellEnabled}
            onToggleAutoSell={() => setState((p) => ({ ...p, autoSellEnabled: !p.autoSellEnabled }))}
            hasAutoSellTruck={hasAutoSellTruck}
          />
        )}

        {activeTab === 'upgrades' && (
          <UpgradesPanel
            gold={state.gold}
            upgrades={state.upgrades}
            onBuyUpgrade={handleBuyUpgrade}
            numberFormatKorean={state.numberFormatKorean}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsPanel
            state={state}
            onClaimAchievement={handleClaimAchievement}
            numberFormatKorean={state.numberFormatKorean}
          />
        )}
      </main>

      {/* Footer with Reset & Info */}
      <footer className="border-t border-amber-200/60 dark:border-stone-800 py-3 px-4 text-center text-xs text-stone-500 flex items-center justify-between max-w-6xl w-full mx-auto">
        <span>© 2026 포근한 농장 타이쿤 · 방치 및 자동 저장 지원</span>
        <button
          onClick={handleResetGame}
          className="text-stone-400 hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> 농장 초기화
        </button>
      </footer>

      {/* Offline Rewards Modal */}
      {offlineSummary && (
        <OfflineRewardModal
          summary={offlineSummary}
          onClaim={handleClaimOffline}
          numberFormatKorean={state.numberFormatKorean}
        />
      )}

      {/* Level Up Celebration Modal */}
      {levelUpModalData && (
        <LevelUpModal
          level={levelUpModalData.level}
          rewardGold={levelUpModalData.reward}
          onClose={() => setLevelUpModalData(null)}
          numberFormatKorean={state.numberFormatKorean}
        />
      )}

    </div>
  );
}
