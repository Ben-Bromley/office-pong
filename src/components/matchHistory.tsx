import { User } from "@prisma/client";
import { UseQueryResult } from "react-query"
import { trpc } from "../utils/trpc";
import GameHistoryItem from "./matchHistoryItem";

type Props = {
  players: Array<User> | undefined
}

const GameHistory: React.FC<Props> = ({ players }) => {
  const games = trpc.useQuery(["match.getAll"]);

  const gamesToDisplay = games?.data?.map(g => {
    return (
      <GameHistoryItem key={g.id} game={g} players={players} />
    )
  })

  return (
    <>
      <h2 className="text-2xl mb-4">🏓 Match History</h2>
      <div>
        <ul>
          {gamesToDisplay}
        </ul>
      </div>
    </>
  )
}

export default GameHistory