import { User } from "@prisma/client";
import { trpc } from "../utils/trpc"

interface UserWithWins extends User {
  wins: number;
}

const PlayerLeaderboard: React.FC = () => {
  const playerQuery = trpc.useQuery(["user.getAll", { with: ["wins"] }]);
  /**
   * Typescript is too stupid to understand the backend logic
   * basically we map over an array of User[], and add the win attribute
   * It's then returned as UserWithWins[].
   * 
   * Typescript is ignoring the if statement, so it doesn't realise 
   * that the actual returned type is different than the default.
   * 
   * The things we do for typesafety eh?
   */
  let players = playerQuery.data as UserWithWins[] | undefined;

  // sort players
  players = players?.sort((a, b) => a.wins < b.wins ? 1 : -1);
  return (
    <>
      <h2 className="text-2xl">Leaderboard</h2>
      <div>
        <ul>
          {players && players?.map((p, idx) => {
            return (
              <li key={p.id} className="bg-gray-200 px-4 py-2 flex justify-between">
                <div className="flex">
                  <span className="mr-2">#{idx + 1}</span>
                  <p className="mx-2">
                    {p.name}
                  </p>
                </div>
                <p>Wins: {p.wins}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default PlayerLeaderboard