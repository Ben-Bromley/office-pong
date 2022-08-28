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
    <section className="">
      <h2 className="text-lg font-bold mb-4">🏓 Match History</h2>
      <div>
        <ul>
          {matchesToDisplay}
          {matchesToDisplay?.length == 0 && <p>Go Play Some Ping Pong!</p>}
        </ul>
      </div>
    </section>
  )
}

export default GameHistory