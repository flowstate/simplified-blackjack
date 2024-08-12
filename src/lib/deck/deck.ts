import { createCard } from '@/lib/cards/helpers';
import { Card, CardRanks, CardSuits } from '../cards/cards.types';

export const createFullDeck = (): Record<string, Card> => {
  const deck: Record<string, Card> = {};
  for (const suit of Object.values(CardSuits)) {
    for (const rank of Object.values(CardRanks)) {
      deck[`${rank}${suit}`] = createCard({ rank, suit });
    }
  }
  return deck;
};

export const fullDeck = createFullDeck();
