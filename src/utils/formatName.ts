const formatName = (player: string | null, players: (string | null)[] | undefined) => {
  const playerNames = players?.map((name) => {
    const [first, last] = name?.split(' ') ?? [];
    return { first, last };
  });

  const playerName = player?.split(' ');

  const playerIndex = playerNames?.findIndex((name) => {
    return name.first === playerName?.[0] && name.last !== playerName?.[1];
  });

  return playerIndex !== -1 ? `${playerName?.[0]} ${(playerName?.[1]?.[0] || '')}` : player;
};

export { formatName };
