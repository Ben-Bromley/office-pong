import { User } from "@prisma/client";
import { trpc } from "../utils/trpc"
import SkeletonLoader from "../components/skeletonLoader";

interface UserWithWins extends User {
  wins: number;
}

const PlayerLeaderboard: React.FC = () => {
  const playerQuery = trpc.useQuery(["user.getAll", { with: ["wins"] }]);
  // assert type
  let players = playerQuery.data as UserWithWins[] | undefined;

  // sort players
  players = players?.sort((a, b) => a.wins < b.wins ? 1 : -1);

  /**
   * check if more than one players have the same first name
   * @param name player name to check
   * @return true if first name is duplicate
   */
  const hasDuplicateFirstName = (name: string | null) => {
    // get first name from name
    const firstName = name?.split(" ")[0] || '';
    if (!firstName || typeof firstName !== "string") return false;
    // check if firstName exists already, and remove
    const allPlayerNames = players?.map(p => p.name?.split(" ")[0] || '');
    const firstNameIndex = allPlayerNames?.indexOf(firstName) ?? -1
    if (firstNameIndex !== -1) allPlayerNames?.splice(firstNameIndex, 1)

    // if there's not another instance of that name, it's not duplicate
    if (allPlayerNames?.indexOf(firstName) === -1) return false;
    // if first name exists more than once, it's duplicate
    return true;
  }

  /**
   * Format player name based on uniqueness
   * @returns formmated name
   */
  const formatName = (name: string | null) => {
    // if first name is duplicate, include surname initial
    if (name && hasDuplicateFirstName(name)) {
      const surInitial = name?.split(" ")[1] ? name?.split(" ")[1]?.[0] : '';
      return `${name?.split(" ")[0]} ${surInitial}.`
    }
    return name?.split(" ")[0];
  }

  return (
    <>
      <h2 className="text-lg font-bold mb-4">Leaderboard</h2>
      <ul className="max-h-[36rem] overflow-scroll rounded-lg">
        {!players && <SkeletonLoader rows={3} />}
        {players && players?.map((p, idx) => {
          return (<li key={p.id} className="bg-gray-100 rounded-md px-4 py-2 flex justify-between mb-2">
            <div className="flex">
              <span className="mr-2">#{idx + 1}</span>
              <p className="mx-2">
                {formatName(p.name)}
              </p>
            </div>
            <p>Wins: {p.wins}</p>
          </li>)
        })}
      </ul>
    </>
  )
}

export default PlayerLeaderboard