const getWelcomeMessage = () => {
  const messages = [
    'Welcome back! Ready for a match?',
    'Show us what you got!',
    'Back already? Good luck. 🍀',
    'Version 2.0 - Magnus edition 👀',
    'Welcome to REVIEWS.io ✪',
    '#YotpoSucks',
    'Watch out for Ajay\'s lightning fast shots ⚡️'
  ];
  const randomIdx = Math.floor(Math.random() * messages.length);

  return messages[randomIdx];
};

export default getWelcomeMessage;
