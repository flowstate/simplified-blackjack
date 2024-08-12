import { useRef, useState } from 'react';

import {
  DiscardPileResponse,
  DrawCardsResponse,
  NewDeckResponse,
} from '@/lib/deck/apiDeck';
import { Card } from '@/lib/deck/deck';
import { DeckProvider } from '@/lib/deckProvider/deckProvider';

import { useActions } from '@/contexts/ActionsContext';

export const useApiDeckProvider = (): DeckProvider => {
  const { addAction } = useActions();
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
    addAction(
      `Discarded ${discardedCards.length} cards: ${discardedCards
        .map((card) => card.code)
        .join(', ')}`
    );
  };

  const drawCards = async (count: number): Promise<Card[]> => {
    const drawnCards: Card[] = [];
    addAction(
      `Drawing ${count} cards, deck ${deckIdRef.current} size: ${deckSizeRef.current}`
    );
    if (count > deckSizeRef.current) {
      // draw the remaining cards
      addAction(
        `Asked to draw ${count} cards, but deck only has ${deckSizeRef.current} cards left. Drawing all remaining cards.`
      );
      const preshuffleDrawResponse = await fetch(
        `/api/deck/${deckIdRef.current}/draw?count=${deckSizeRef.current}`,
        { cache: 'no-store' }
      );
      const preshuffleDrawData: DrawCardsResponse =
        await preshuffleDrawResponse.json();
      drawnCards.push(...preshuffleDrawData.cards);
      addAction(
        `Drew ${
          preshuffleDrawData.cards.length
        } cards: ${preshuffleDrawData.cards
          .map((card) => card.code)
          .join(', ')}`
      );

      // put the discard pile back into the deck
      const returnDiscardResponse = await fetch(
        `/api/deck/${deckIdRef.current}/discard/return`,
        { cache: 'no-store' }
      );
      const returnData: DiscardPileResponse =
        await returnDiscardResponse.json();
      deckSizeRef.current = returnData.remaining;
      addAction(
        `Returned discard pile to deck, deck size: ${deckSizeRef.current}`
      );

      // shuffle the deck
      await fetch(`/api/deck/${deckIdRef.current}/shuffle`, {
        cache: 'no-store',
      });
      addAction(`Shuffled deck, deck size: ${deckSizeRef.current}`);
    }

    const drawResponse = await fetch(
      `/api/deck/${deckIdRef.current}/draw?count=${count - drawnCards.length}`,
      { cache: 'no-store' }
    );
    const drawData: DrawCardsResponse = await drawResponse.json();

    deckSizeRef.current = drawData.remaining;
    drawnCards.push(...drawData.cards);
    addAction(
      `Drew ${drawnCards.length} cards: ${drawnCards
        .map((card) => card.code)
        .join(', ')}`
    );
    addAction(`Deck size: ${drawData.remaining}`);
    return drawnCards;
  };

  const openDeck = async () => {
    const response = await fetch('/api/deck/new', { cache: 'no-store' });
    const data: NewDeckResponse = await response.json();
    addAction(`Opened deck: ${data.deckId} with ${data.remaining} cards`);
    deckIdRef.current = data.deckId;
    deckSizeRef.current = data.remaining;
    addAction(`Deck ${deckIdRef.current} size: ${deckSizeRef.current}`);
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
