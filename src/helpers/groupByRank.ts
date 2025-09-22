import { Player } from '../types/types';

type RankGroup = {
  label: string;
  min: number;
  max: number;
};

const RANKS: RankGroup[] = [
  { label: 'Poop', min: 0, max: 799 },
  { label: 'Papyrus', min: 800, max: 849 },
  { label: 'Wood', min: 850, max: 899 },
  { label: 'Stone', min: 900, max: 949 },
  { label: 'Bronze', min: 950, max: 999 },
  { label: 'Silver', min: 1000, max: 1049 },
  { label: 'Gold', min: 1050, max: 1099 },
  { label: 'Platinum', min: 1100, max: 1149 },
  { label: 'Diamond', min: 1150, max: 1199 },
  { label: 'Legendary', min: 1200, max: 1249 },
  { label: 'Mythical', min: 1250, max: Infinity },
];

const groupByRank = (players: Player[]) => {
  const grouped: Record<string, Player[]> = {};

  for (const { label, min, max } of RANKS) {
    grouped[label] = players
      .filter(p => p.elo >= min && p.elo <= max)
      .sort((a, b) => b.elo - a.elo);
  }

  return grouped;
};
export default groupByRank;