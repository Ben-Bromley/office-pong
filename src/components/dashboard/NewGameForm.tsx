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

// interface ScoreProps {
//   score: number;
//   setScore: (score: number) => void;
// }

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
            disabled={match.isLoading}
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
            disabled={match.isLoading}
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
            disabled={match.isLoading}
            onChange={(e) => setPlayerTwoScore(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="border-b border-slate-100 my-4" />

      <div className="flex flex-row justify-end">
        <button
          type="button"
          onClick={() => submitGame()}
          disabled={match.isLoading}
          className={clsx(
            'text-white focus:outline-none font-normal rounded-md text-sm px-4 py-2 text-center inline-flex items-center bg-gradient-to-r from-gray-700 via-gray-900 to-black',
            match.isLoading && 'opacity-40 cursor-not-allowed'
          )}
        >
          Submit Results
          {match.isLoading ? (
            <svg
              aria-hidden="true"
              role="status"
              className="inline ml-2 w-2 h-2 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <RightPointingArrow />
          )}
        </button>
      </div>
    </section>
  );
};

export default NewGameForm;
