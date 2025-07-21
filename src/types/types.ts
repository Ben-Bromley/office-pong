export type Player = {
  id: string;
  name: string | null;
  matchesPlayed: number;
  matchesWon: number;
  elo: number;
};