import { useRef, useState } from 'react';

import {
  DiscardPileResponse,
  DrawCardsResponse,
  NewDeckResponse,
} from '@/lib/deck/apiDeck';
import { Card } from '@/lib/cards/cards.types';
import { DeckProvider } from '@/lib/deckProvider/deckProvider';

export const useApiDeckProvider = (): DeckProvider => {
  const deckIdRef = useRef<string | null>(null);
  const deckSizeRef = useRef<number>(0);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);

  const discardCards = async (discardedCards: Card[]) => {
    setDiscardPile((prev) => [...prev, ...discardedCards]);
    const cardCodes = discardedCards.map((card) => card.code).join(',');
    await fetch(
      `/api/deck/${deckIdRef.current}/discard/add?codes=${cardCodes}`,
      {
        cache: 'no-store',
      }
    );
  };

  const drawCards = async (count: number): Promise<Card[]> => {
    const drawnCards: Card[] = [];
    if (count > deckSizeRef.current) {
      // draw the remaining cards
      const preshuffleDrawResponse = await fetch(
        `/api/deck/${deckIdRef.current}/draw?count=${deckSizeRef.current}`,
        { cache: 'no-store' }
      );
      const preshuffleDrawData: DrawCardsResponse =
        await preshuffleDrawResponse.json();
      drawnCards.push(...preshuffleDrawData.cards);

      // put the discard pile back into the deck
      const returnDiscardResponse = await fetch(
        `/api/deck/${deckIdRef.current}/discard/return`,
        { cache: 'no-store' }
      );
      const returnData: DiscardPileResponse =
        await returnDiscardResponse.json();
      deckSizeRef.current = returnData.remaining;

      // shuffle the deck
      await fetch(`/api/deck/${deckIdRef.current}/shuffle`, {
        cache: 'no-store',
      });
    }

    const drawResponse = await fetch(
      `/api/deck/${deckIdRef.current}/draw?count=${count - drawnCards.length}`,
      { cache: 'no-store' }
    );
    const drawData: DrawCardsResponse = await drawResponse.json();

    deckSizeRef.current = drawData.remaining;
    drawnCards.push(...drawData.cards);
    return drawnCards;
  };

  const openDeck = async () => {
    const response = await fetch('/api/deck/new', { cache: 'no-store' });
    const data: NewDeckResponse = await response.json();
    deckIdRef.current = data.deckId;
    deckSizeRef.current = data.remaining;
  };

  return {
    discardPile,
    discardCards,
    drawCards,
    openDeck,
    deckSize: deckSizeRef.current,
    deckId: deckIdRef.current ?? 'null',
  };
};
