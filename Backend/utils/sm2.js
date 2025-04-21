module.exports = function updateCard(card, q) {
    let EF = card.EF;
    let interval = card.interval;
    let repetition = card.repetition;
    const now = new Date();
  
    if (q < 3) {
      repetition = 0;
      interval = 1;
    } else {
      EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      EF = Math.max(EF, 1.3);
      repetition++;
      interval = repetition === 1 ? 1 : Math.round(interval * EF);
    }
  
    const nextReviewDate = new Date(now.getTime() + interval * 86400000);
  
    return {
      EF,
      interval,
      repetition,
      lastReviewed: now,
      nextReviewDate,
    };
  };