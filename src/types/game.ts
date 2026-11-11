export interface AnimalConfig {
  id: string;
  name: string;
  species: string;
  description: string;
  unlockLevel: number;
  unlockCost: number;
  baseItemName: string;
  baseItemIcon: string;
  baseItemPrice: number;
  rareItemName: string;
  rareItemIcon: string;
  rareItemMultiplier: number;
  baseClickYield: number;
  baseAutoPerSec: number;
  image: string;
  colorScheme: {
    bg: string;
    border: string;
    accent: string;
    text: string;
  };
}

export interface AnimalState {
  level: number;
  autoWorkers: number; // number of automated care assistants
  unlocked: boolean;
  totalHarvested: number;
  totalRareHarvested: number;
}

export interface UpgradeConfig {
  id: string;
  name: string;
  category: 'click' | 'idle' | 'offline' | 'market';
  description: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
  icon: string;
  effectDescription: (level: number) => string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  rewardGold: number;
  check: (state: GameState) => boolean;
}

export interface MarketTrend {
  animalId: string;
  multiplier: number; // e.g. 1.5x price
  expiresAt: number; // timestamp
  headline: string;
}

export interface ClickParticle {
  id: number;
  x: number;
  y: number;
  text: string;
  icon: string;
  isRare: boolean;
}

export interface OfflineSummary {
  secondsOffline: number;
  efficiency: number;
  goldEarned: number;
  itemsProduced: Record<string, { base: number; rare: number; name: string; icon: string }>;
}

export interface GameState {
  gold: number;
  totalGoldEarned: number;
  level: number;
  exp: number;
  expToNextLevel: number;
  activeAnimalId: string;
  animals: Record<string, AnimalState>;
  inventory: Record<string, { base: number; rare: number }>;
  upgrades: Record<string, number>; // upgradeId -> level
  achievements: Record<string, boolean>; // achievementId -> unlocked
  soundEnabled: boolean;
  numberFormatKorean: boolean; // Korean 만/억/조 or K/M/B
  lastActiveTimestamp: number;
  lifetimeClicks: number;
  autoSellEnabled: boolean;
}
