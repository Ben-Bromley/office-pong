import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { FC, useRef, useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useQueryClient } from 'react-query';
import SectionTitle from '../shared/SectionTitle';
import { ArrowRightCircle, ChevronDown, RotateCw } from 'lucide-react';
import SectionCard from '../shared/SectionCard';

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

  const playerOneInputRef = useRef<HTMLInputElement>(null);
  const playerTwoInputRef = useRef<HTMLInputElement>(null);
  const [playerOneScore, setPlayerOneScore] = useState<number>(0);
  const [playerTwoScore, setPlayerTwoScore] = useState<number>(0);

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
      { p1: playerOneId, p2: playerTwoId, p1_score: playerOneScore!, p2_score: playerTwoScore! },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['match.getAll']);
          queryClient.invalidateQueries(['match.userMatches']);
          queryClient.invalidateQueries(['user.scoreboard']);
          queryClient.invalidateQueries(['user.stats']);
          queryClient.invalidateQueries(['user.insights']);
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
            onChange={(e) => {
              label === 'One'
                ? playerOneInputRef.current?.value === '0' && playerOneInputRef.current?.focus()
                : playerTwoInputRef.current?.value === '0' && playerTwoInputRef.current?.focus();
              setName(e.target.value);
            }}
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
            {/* sort by name */}
            {users.data &&
              users.data
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
                .map((player) => {
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
            <ChevronDown
              className={clsx('h-5 w-5 text-slate-300', label === 'One' && errors.playerOneId && 'text-red-500')}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SectionCard>
      <SectionTitle title="📝 &nbsp;New Game" />
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
            ref={playerOneInputRef}
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
            ref={playerTwoInputRef}
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
            'text-white focus:outline-none font-normal rounded-md text-sm px-3.5 py-2 text-center inline-flex items-center bg-black',
            match.isLoading && 'opacity-30 cursor-not-allowed'
          )}
        >
          Submit Scores
          {match.isLoading ? (
            <RotateCw className="ml-1.5 w-3.5 h-3.5 animate-spin" />
          ) : (
            <ArrowRightCircle className="ml-1.5 w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </SectionCard>
  );
};

export default NewGameForm;
