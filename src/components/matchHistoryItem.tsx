import { User, Match } from "@prisma/client";
import { useState, useEffect } from "react";

type Props = {
  game: Match;
  players: User[] | undefined;
}

const GameHistoryItem: React.FC<Props> = ({ game: match, players }) => {
  const [winnerId, setWinner] = useState('');

  const p1 = players && players.find((p: User) => p.id === match.playerOneId);
  const p2 = players && players.find((p: User) => p.id === match.playerTwoId);

  useEffect(() => {
    if (match.playerOneScore > match.playerTwoScore) {
      setWinner(match.playerOneId);
    }
    if (match.playerOneScore < match.playerTwoScore) {
      setWinner(match.playerTwoId);
    }
  }, []);
  return (
    <li key={match.id} className="bg-gray-200 px-4 py-2 flex justify-between">
      <p>
        <span className={`${p1?.id === winnerId ? "text-green-500" : "text-red-500"}`}>{p1?.name}</span>
        <span className="font-light text-xs">{' vs. '}</span>
        <span className={`${p2?.id === winnerId ? "text-green-500" : "text-red-500"}`}>{p2?.name}</span>
      </p>
      <p>
        {match.playerOneScore} - {match.playerTwoScore}
      </p>
    </li>
  )
}

export default GameHistoryItem