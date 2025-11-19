const getWelcomeMessage = () => {
  const messages = [
    'Welcome back! Ready for a match? 👀',
    'Show us what you got! 💪',
    'Now supporting ELO! 💯',
    'Back already? Good luck 🍀',
    'Slack integration coming soon... 📲',
    'Welcome to REVIEWS.io ✪',
    '[insert inspirational quote here]',
    "Who's gonna be at the top? 🏆",
    'Have fun! But not too much fun... 😄'
  ];
  const randomIdx = Math.floor(Math.random() * messages.length);

  return messages[randomIdx];
};

export default getWelcomeMessage;
