import { User, Match } from "@prisma/client";
import { useState, useEffect } from "react";

type Props = {
  game: Match;
  players: User[] | undefined;
}

const MatchHistoryItem: React.FC<Props> = ({ game: match, players }) => {
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
  }, [match]);

  return (
    <li key={match.id} className="bg-gray-100 px-4 py-2 mb-2 rounded">
      <div className="flex justify-between">
        <p>
          <span className={`${p1?.id === winnerId ? "text-green-500" : "text-red-500"}`}>{p1?.name}</span>
          <span className="font-light text-xs">{' vs. '}</span>
          <span className={`${p2?.id === winnerId ? "text-green-500" : "text-red-500"}`}>{p2?.name}</span>
        </p>
        <p className="min-w-max">
          {match.playerOneScore} - {match.playerTwoScore}
        </p>
      </div>
      <p className="text-gray-500 text-xs">
        {match.createdAt.toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        })}
      </p>
    </li>
  )
}

export default MatchHistoryItem