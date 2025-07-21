import { Player } from '../types/types';

type RankGroup = {
  label: string;
  min: number;
  max: number;
};

const RANKS: RankGroup[] = [
  { label: 'Papyrus', min: 0, max: 499 },
  { label: 'Wood', min: 500, max: 699 },
  { label: 'Bronze', min: 700, max: 899 },
  { label: 'Silver', min: 900, max: 999 },
  { label: 'Gold', min: 1000, max: 1299 },
  { label: 'Platinum', min: 1300, max: 1499 },
  { label: 'Diamond', min: 1500, max: 1799 },
  { label: 'Legendary', min: 1800, max: 1999 },
  { label: 'Mythical', min: 2000, max: Infinity },
];

const groupByRank = (players: Player[] | undefined) => {
  const grouped: Record<string, Player[]> = {};

  if (!players) return grouped;
  for (const { label, min, max } of RANKS) {
    grouped[label] = players
      .filter(p => p.elo >= min && p.elo <= max)
      .sort((a, b) => b.elo - a.elo);
  }

  return grouped;
};
export default groupByRank;