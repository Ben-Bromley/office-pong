import { User, Game } from "@prisma/client";
import { useState, useEffect } from "react";

type Props = {
  game: Game;
  players: User[] | undefined;
}

const GameHistoryItem: React.FC<Props> = ({ game, players }) => {
  const [winnerId, setWinner] = useState('');

  const p1 = players && players.find((p: User) => p.id === game.playerOneId);
  const p2 = players && players.find((p: User) => p.id === game.playerTwoId);

  useEffect(() => {
    if (game.playerOneScore > game.playerTwoScore) {
      setWinner(game.playerOneId);
    }
    if (game.playerOneScore < game.playerTwoScore) {
      setWinner(game.playerTwoId);
    }
  }, []);
  return (
    <li key={game.id} className="bg-gray-200 px-4 py-2 flex justify-between">
      <p>
        <span className={`${p1?.id === winnerId ? "text-green-500" : "text-red-500"}`}>{p1?.name}</span>
        <span className="font-light text-xs">{' vs. '}</span>
        <span className={`${p2?.id === winnerId ? "text-green-500" : "text-red-500"}`}>{p2?.name}</span>
      </p>
      <p>
        {game.playerOneScore} - {game.playerTwoScore}
      </p>
    </li>
  )
}

export default GameHistoryItem