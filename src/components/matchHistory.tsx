import { User } from "@prisma/client";
import { trpc } from "../utils/trpc";
import MatchHistoryItem from "./matchHistoryItem";
import SkeletonLoader from "../components/skeletonLoader";

type Props = {
  players: Array<User> | undefined
}

const GameHistory: React.FC<Props> = ({ players }) => {
  const matchesQuery = trpc.useQuery(["match.getAll"]);
  let matches = matchesQuery.data;

  // sort games by date
  matches = matches?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const matchesToDisplay = matches?.map(m => {
    return <MatchHistoryItem key={m.id} game={m} players={players} />
  })

  return (
    <section className="">
      <h2 className="text-lg font-bold mb-4">🏓 Match History</h2>
      <ul className="max-h-80 overflow-scroll rounded-lg">
        {!matches && <SkeletonLoader rows={3} />}
        {matchesToDisplay?.length != 0 && matchesToDisplay}
        {matchesToDisplay?.length == 0 && <p>Go Play Some Ping Pong!</p>}
      </ul>
    </section>
  )
}

export default GameHistory