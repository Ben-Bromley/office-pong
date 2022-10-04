import { FC } from 'react';
import { formatName } from '../../utils/formatName';
import { trpc } from '../../utils/trpc';

const Scoreboard: FC = () => {
  const scoreboard = trpc.useQuery(['user.scoreboard']);
  const players = scoreboard.data?.map((p) => p.name);

  if (scoreboard.status === 'loading') return null;

  return (
    <>
      <h2 className="text-lg font-bold mb-4">🏓 Scoreboard</h2>
      <ul className="max-h-[36rem] overflow-scroll rounded-lg">
        {scoreboard.data?.map((player, idx) => (
          <li key={player.id} className="bg-gray-100 rounded-md px-4 py-2 flex justify-between mb-2">
            <div className="flex">
              <span className="mr-2 text-xs self-center">#{idx + 1}</span>
              <p className="mx-2 font-bold">
                {formatName(player.name, players)}
                {idx === 0 && ' 🏆'}
              </p>
            </div>
            <p>Score: {player.elo}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Scoreboard;
