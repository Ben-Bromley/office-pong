import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';

type newGameData = {
  p1: string;
  p2: string;
  p1_score: number;
  p2_score: number;
};

type Props = {
  players: User[] | undefined;
};

const NewGameForm: React.FC<Props> = ({ players }) => {
  const newGame = trpc.useMutation(['match.create']);
  const { data: session, status } = useSession();

  // set initial input states
  const [p1, setP1] = useState('');
  const [p1Score, setP1Score] = useState('0');
  const [p2, setP2] = useState('DEFAULT');
  const [p2Score, setP2Score] = useState('0');

  // set first player as logged in user
  useEffect(() => {
    if (session?.user) setP1(session.user?.id);
  }, [session, status]);

  // handle form submission
  const handleSubmitGame = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!p1 || !p2 || p1 === 'DEFAULT' || p2 === 'DEFAULT') return;
    if (!+p1Score && !+p2Score) return;
    if (+p1Score === +p2Score) return;
    if (+p1Score < 11 && +p2Score < 11) return alert('Please enter a score of 11 or more');
    if (+p1Score >= 11 && +p2Score >= 11 && Math.abs(+p1Score - +p2Score) > 2)
      return alert('Scores must be within 2 points of each other');

    // create new user data
    const newGameData: newGameData = {
      p1,
      p2,
      p1_score: parseInt(p1Score),
      p2_score: parseInt(p2Score)
    };

    try {
      newGame.mutate({ ...newGameData });
    } catch (e: unknown) {
      console.log((e as Error).message);
    }
    location.reload();
  };

  // render component
  return (
    <>
      <h2 className="text-lg font-bold mb-4">New Game</h2>
      <form id="new-game-form" onSubmit={handleSubmitGame}>
        <div className="flex justify-between mb-2">
          <h3 className="w-8 font-light flex items-center">P1:</h3>
          <select
            name="p1"
            id="p1"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            className="flex-grow border rounded-md p-2 mx-2 w-48"
            required
          >
            {players &&
              players?.map((player) => {
                return (
                  <option key={player.id} value={player.id} disabled={player.id == p2}>
                    {player.name}
                  </option>
                );
              })}
          </select>
          <input
            type="number"
            value={p1Score}
            onChange={(e) => {
              setP1Score(e.target.value);
            }}
            min="0"
            max="50"
            name="p1_score"
            id="p1_score"
            className="w-18 border rounded-md p-2 mx-2"
          />
        </div>
        <div className="flex justify-between mb-2">
          <h3 className="w-8 font-light flex items-center">P2:</h3>
          <select
            name="p2"
            id="p2"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            className="flex-grow border rounded-md p-2 mx-2 w-48"
            required
          >
            <option value="DEFAULT" disabled>
              {' '}
              - Select Opponent -{' '}
            </option>
            {players &&
              players?.map((player) => {
                return (
                  <option key={player.id} value={player.id} disabled={player.id == p1}>
                    {player.name}
                  </option>
                );
              })}
          </select>
          <input
            type="number"
            value={p2Score}
            onChange={(e) => {
              setP2Score(e.target.value);
            }}
            min="0"
            max="50"
            name="p2_score"
            id="p2_score"
            className="w-18 border rounded-md p-2 mx-2"
          />
        </div>
        <input
          type="submit"
          value="Submit Results"
          className="w-44 text-center transition-all font-medium border-2 border-blue-500 mt-4 p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        />
      </form>
    </>
  );
};

export default NewGameForm;
