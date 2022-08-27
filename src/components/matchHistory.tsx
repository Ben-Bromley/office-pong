import { User } from "@prisma/client";
import { trpc } from "../utils/trpc";
import MatchHistoryItem from "./matchHistoryItem";

type Props = {
  players: Array<User> | undefined
}

const GameHistory: React.FC<Props> = ({ players }) => {
  const matches = trpc.useQuery(["match.getAll"]);

  const matchesToDisplay = matches?.data?.map(m => {
    return (
      <MatchHistoryItem key={m.id} game={m} players={players} />
    )
  })

  return (
    <>
      <h2 className="text-2xl mb-4">🏓 Match History</h2>
      <div>
        <ul>
          {matchesToDisplay}
        </ul>
      </div>
    </>
  )
}

export default GameHistory