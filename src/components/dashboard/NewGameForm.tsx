import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useQueryClient } from 'react-query';
import RightPointingArrow from '../shared/RightPointingArrow';

interface PlayerSelectProps {
  label: 'One' | 'Two';
  name: string;
  setName: (name: string) => void;
}

interface ScoreProps {
  score: number;
  setScore: (score: number) => void;
}

const NewGameForm: FC = () => {
  const queryClient = useQueryClient();
  const users = trpc.useQuery(['user.getAll']);
  const match = trpc.useMutation(['match.create']);
  const { data: session } = useSession();

  const [playerOneId, setPlayerOneId] = useState(session?.user?.id ?? '');
  const [playerTwoId, setPlayerTwoId] = useState('');

  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);

  const [errors, setErrors] = useState({
    playerOneId: false,
    playerTwoId: false,
    playerOneScore: false,
    playerTwoScore: false
  });

  const validateFields = () => {
    const localErrors = {
      playerOneId: !playerOneId || playerOneId === playerTwoId,
      playerTwoId: !playerTwoId || playerOneId === playerTwoId,
      playerOneScore:
        (!playerOneScore && !playerTwoScore) ||
        playerOneScore === playerTwoScore ||
        (playerOneScore < 11 && playerTwoScore < 11) ||
        (((playerOneScore >= 11 && playerTwoScore >= 11) || playerOneScore > 11 || playerTwoScore > 11) &&
          Math.abs(playerOneScore - playerTwoScore) > 2) ||
        Math.abs(playerOneScore - playerTwoScore) < 2,
      playerTwoScore:
        (!playerOneScore && !playerTwoScore) ||
        playerOneScore === playerTwoScore ||
        (playerOneScore < 11 && playerTwoScore < 11) ||
        (((playerOneScore >= 11 && playerTwoScore >= 11) || playerOneScore > 11 || playerTwoScore > 11) &&
          Math.abs(playerOneScore - playerTwoScore) > 2) ||
        Math.abs(playerOneScore - playerTwoScore) < 2
    };

    setErrors(localErrors);
    return !Object.values(localErrors).some((error) => error);
  };

  const submitGame = () => {
    if (!validateFields()) return;
    match.mutate(
      { p1: playerOneId, p2: playerTwoId, p1_score: playerOneScore, p2_score: playerTwoScore },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['match.getAll']);
          queryClient.invalidateQueries(['user.scoreboard']);
          queryClient.invalidateQueries(['user.stats']);
        }
      }
    );
    setPlayerOneScore(0);
    setPlayerTwoScore(0);
    setPlayerTwoId('');
  };

  const PlayerSelect: FC<PlayerSelectProps> = ({ label, name, setName }) => (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="mb-1 text-xs text-slate-400">
        Player {label}
      </label>
      <div className="flex flex-row">
        <div className="inline-block relative w-full">
          <select
            id={name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={clsx(
              'border  text-sm rounded-sm block w-full py-1 h-8 px-2 appearance-none',
              label === 'Two' && errors.playerTwoId ? 'border-red-500' : 'border-slate-300',
              name === '' ? 'text-gray-400' : 'text-gray-900'
            )}
          >
            <option value="" disabled>
              Select Player
            </option>
            {users.data &&
              users.data.map((player) => {
                return (
                  <option
                    key={player.id}
                    value={player.id}
                    disabled={
                      (label === 'Two' && player.id === playerOneId) || (label === 'One' && player.id === playerTwoId)
                    }
                  >
                    {player.name}
                  </option>
                );
              })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className={clsx(
                'fill-current h-5 w-5 text-slate-300',
                label === 'One' && errors.playerOneId && 'text-red-500'
              )}
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-white m-2 p-4 rounded-md">
      <h2 className="text-lg font-bold self-center mb-4">📝 &nbsp;New Game</h2>
      <div className="flex flex-row w-full gap-4">
        <div className="flex flex-row w-full">
          <PlayerSelect label="One" name={playerOneId} setName={setPlayerOneId} />
          <input
            className={clsx(
              'border text-gray-900 text-sm rounded-sm block w-12 py-1 px-2 ml-1 cursor-default self-end h-8',
              errors.playerOneScore ? 'border-red-500' : 'border-slate-300'
            )}
            type={'number'}
            min={0}
            value={playerOneScore}
            onChange={(e) => setPlayerOneScore(parseInt(e.target.value))}
          />
        </div>
        <div className="flex flex-row w-full">
          <PlayerSelect label="Two" name={playerTwoId} setName={setPlayerTwoId} />
          <input
            className={clsx(
              'border text-gray-900 text-sm rounded-sm block w-12 py-1 px-2 ml-1 cursor-default self-end h-8',
              errors.playerTwoScore ? 'border-red-500' : 'border-slate-300'
            )}
            type={'number'}
            min={0}
            value={playerTwoScore}
            onChange={(e) => setPlayerTwoScore(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="border-b border-slate-100 my-4" />

      <div className="flex flex-row justify-end">
        <button
          type="button"
          onClick={() => submitGame()}
          className="text-white focus:outline-none font-normal rounded-md text-sm px-4 py-2 text-center inline-flex items-center bg-gradient-to-r from-gray-700 via-gray-900 to-black"
        >
          Submit Results
          <RightPointingArrow />
        </button>
      </div>
    </section>
  );
};

export default NewGameForm;
