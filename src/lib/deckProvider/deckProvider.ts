import { Card } from '@/lib/cards/cards.types';
import { fullDeck } from '@/lib/deck/deck';

export interface DeckProvider {
  openDeck: () => Promise<void>;
  drawCards: (count: number) => Promise<Card[]>;
  discardCards: (discardedCards: Card[]) => Promise<void>;
  discardPile: Card[];
  deckSize: number;
  deckId: string;
}

export const createLocalDeckProvider = (): DeckProvider => {
  const rawDeck = fullDeck;
  const discardPile: Card[] = [];
  const deck: Card[] = [];

  const shuffleCards = (cards: Card[]) => {
    return cards.sort(() => Math.random() - 0.5);
  };

  const openDeck = () => {
    deck.push(...shuffleCards(Object.values(rawDeck)));
    return Promise.resolve();
  };
  const drawCards = (count: number): Promise<Card[]> => {
    if (deck.length < count) {
      deck.push(...shuffleCards(discardPile.splice(0, discardPile.length)));
    }
    const drawnCards = deck.splice(0, count);
    return Promise.resolve(drawnCards);
  };

  const discardCards = (discardedCards: Card[]) => {
    discardPile.push(...discardedCards);
    return Promise.resolve();
  };
  return {
    openDeck,
    drawCards,
    discardCards,
    discardPile,
    deckSize: deck.length,
    deckId: 'local',
  };
};
