/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ELO calculation function
const calculateNewElo = (playerElo, opponentElo, actualScore, kFactor = 32) => {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  return Math.round(playerElo + kFactor * (actualScore - expectedScore));
};

// Generate random match result with some skill variance
const generateMatchResult = (player1Elo, player2Elo) => {
  // Higher ELO player has better chance of winning
  const eloDiff = player1Elo - player2Elo;
  const player1WinProbability = 1 / (1 + Math.pow(10, -eloDiff / 400));

  const isPlayer1Winner = Math.random() < player1WinProbability;

  if (isPlayer1Winner) {
    return {
      playerOneScore: Math.floor(Math.random() * 5) + 11, // 11-15
      playerTwoScore: Math.floor(Math.random() * 10) + 1 // 1-10
    };
  } else {
    return {
      playerOneScore: Math.floor(Math.random() * 10) + 1, // 1-10
      playerTwoScore: Math.floor(Math.random() * 5) + 11 // 11-15
    };
  }
};

const main = async () => {
  // Create 10 users
  const users = [
    { email: 'alice.johnson@company.com', name: 'Alice Johnson' },
    { email: 'bob.smith@company.com', name: 'Bob Smith' },
    { email: 'charlie.brown@company.com', name: 'Charlie Brown' },
    { email: 'diana.prince@company.com', name: 'Diana Prince' },
    { email: 'ethan.hunt@company.com', name: 'Ethan Hunt' },
    { email: 'fiona.green@company.com', name: 'Fiona Green' },
    { email: 'george.wilson@company.com', name: 'George Wilson' },
    { email: 'helen.clark@company.com', name: 'Helen Clark' },
    { email: 'ivan.petrov@company.com', name: 'Ivan Petrov' },
    { email: 'julia.davis@company.com', name: 'Julia Davis' }
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        elo: 1000 // Starting ELO
      }
    });
    createdUsers.push(user);
  }

  console.log('10 users created.');

  // Create matches and update ELO scores
  const matches = [];
  const userStats = {};

  // Initialize user stats
  createdUsers.forEach((user) => {
    userStats[user.id] = {
      elo: 1000,
      matchesPlayed: 0,
      matchesWon: 0
    };
  });

  // Generate 100 matches (each user plays approximately 20 matches)
  for (let i = 0; i < 100; i++) {
    // Randomly select two different players
    const player1Index = Math.floor(Math.random() * createdUsers.length);
    let player2Index = Math.floor(Math.random() * createdUsers.length);
    while (player2Index === player1Index) {
      player2Index = Math.floor(Math.random() * createdUsers.length);
    }

    const player1 = createdUsers[player1Index];
    const player2 = createdUsers[player2Index];

    const player1CurrentElo = userStats[player1.id].elo;
    const player2CurrentElo = userStats[player2.id].elo;

    // Generate match result
    const matchResult = generateMatchResult(player1CurrentElo, player2CurrentElo);

    // Calculate new ELO scores
    const player1Won = matchResult.playerOneScore > matchResult.playerTwoScore;
    const player1Score = player1Won ? 1 : 0;
    const player2Score = player1Won ? 0 : 1;

    const newPlayer1Elo = calculateNewElo(player1CurrentElo, player2CurrentElo, player1Score);
    const newPlayer2Elo = calculateNewElo(player2CurrentElo, player1CurrentElo, player2Score);

    // Create match record
    const match = await prisma.match.create({
      data: {
        playerOneId: player1.id,
        playerOneScore: matchResult.playerOneScore,
        playerTwoId: player2.id,
        playerTwoScore: matchResult.playerTwoScore,
        playerOneElo: player1CurrentElo,
        playerTwoElo: player2CurrentElo,
        duration: `${Math.floor(Math.random() * 15) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`, // 5-20 minutes
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      }
    });

    // Update user stats
    userStats[player1.id].elo = newPlayer1Elo;
    userStats[player1.id].matchesPlayed++;
    if (player1Won) userStats[player1.id].matchesWon++;

    userStats[player2.id].elo = newPlayer2Elo;
    userStats[player2.id].matchesPlayed++;
    if (!player1Won) userStats[player2.id].matchesWon++;

    matches.push(match);
  }

  // Update all users with their final stats
  for (const user of createdUsers) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        elo: userStats[user.id].elo,
        matchesPlayed: userStats[user.id].matchesPlayed,
        matchesWon: userStats[user.id].matchesWon
      }
    });
  }

  console.log(`100 matches created and ELO scores calculated.`);
  console.log('Final user stats:');

  const finalUsers = await prisma.user.findMany({
    orderBy: { elo: 'desc' }
  });

  finalUsers.forEach((user) => {
    const winRate = user.matchesPlayed > 0 ? ((user.matchesWon / user.matchesPlayed) * 100).toFixed(1) : '0.0';
    console.log(`${user.name}: ELO ${user.elo}, ${user.matchesWon}/${user.matchesPlayed} wins (${winRate}%)`);
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
