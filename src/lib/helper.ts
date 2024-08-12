import { Card } from '@/lib/deck/deck';

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

export function calculateHandScore(hand: Card[]): number {
  let score = 0;
  let aces = 0;

  hand.forEach((card) => {
    if (card.rank === 'A') {
      aces += 1;
      score += 11;
      return;
    }
    if (['J', 'Q', 'K'].includes(card.rank)) {
      score += 10;
      return;
    }
    score += card.value;
  });

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
}
