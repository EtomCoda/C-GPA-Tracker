export const getMotivationalGreeting = (): string => {
  const date = new Date();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  // 1. Check for Holidays
  // Christmas Eve (Dec 24)
  if (month === 11 && day === 24) {
    return "Merry Christmas Eve! The best gift is your potential! 🎁";
  }
  // Christmas (Dec 25 - 26)
  if (month === 11 && (day >= 25 && day <= 26)) {
    return "Merry Christmas! Wishing you a season of success! 🎄";
  }
  // New Year (Dec 31 - Jan 1)
  if ((month === 11 && day === 31) || (month === 0 && day === 1)) {
    return "Happy New Year! Let's crush this year's goals! 🎆";
  }
  // Halloween (Oct 31)
  if (month === 9 && day === 31) {
    return "Don't let your grades ghost you! 👻";
  }
  // Valentine's (Feb 14)
  if (month === 1 && day === 14) {
    return "Love your studies, and they'll love you back! 💙";
  }

  // 2. Random Motivational Quotes
  const quotes = [
    "Consistency is key! 🗝️",
    "Small steps lead to big grades. 📈",
    "Focus on the process, not just the result. 🧠",
    "Believe you can and you're halfway there. 🚀",
    "Your potential is endless. 🌟",
    "Stay focused, stay sharp. 🎯",
    "Every expert was once a beginner. 📚",
    "Dream big, work hard, stay humble. 💪",
    "Education is the passport to the future. 🌍",
    "The best way to predict the future is to create it. ✨",
    "Success doesn't come to you, you go to it. 🏃‍♂️",
    "Don't stop until you're proud. 🦁"
  ];

  // Use the date as a seed or just random?
  // User asked for "per login", so strictly random per mount is fine.
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};
