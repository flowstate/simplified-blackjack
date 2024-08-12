import { Card } from '@/lib/cards/cards.types';
import { createCard } from '@/lib/cards/helpers';
import { API_ROOT } from '@/lib/deck/constants';

export const OPEN_DECK_ROUTE = `${API_ROOT}/api/deck/new/shuffle/`;
export const OPEN_SMALL_DECK_ROUTE = `${API_ROOT}/api/deck/new/shuffle/?cards=AS,2S,KS,AD,2D,KD,AC,2C,KC,AH,2H,KH,JS,JC`;

export const DRAW_CARDS_ROUTE = (deckId: string, count: number) =>
  `${API_ROOT}/api/deck/${deckId}/draw/?count=${count}`;

export const DISCARD_CARDS_ROUTE = (deckId: string, cardCodes: string) => {
  return `${API_ROOT}/api/deck/${deckId}/pile/discard/add/?cards=${cardCodes}`;
};

export type NewDeckResponse = {
  deckId: string;
  remaining: 52;
};

export const openDeck = async (): Promise<NewDeckResponse> => {
  const response = await fetch(OPEN_DECK_ROUTE, { cache: 'no-store' });
  const data = await response.json();
  return { deckId: data.deck_id, remaining: data.remaining };
};

export type DrawCardsResponse = {
  cards: Card[];
  remaining: number;
};

export const drawCards = async (
  deckId: string,
  count: number
): Promise<DrawCardsResponse> => {
  const response = await fetch(DRAW_CARDS_ROUTE(deckId, count), {
    cache: 'no-store',
  });
  const data = await response.json();
  const cards = data.cards.map(({ code }: { code: string }) =>
    createCard({ code })
  );
  return { cards, remaining: data.remaining };
};

export type DiscardPileResponse = {
  ok: boolean;
  remaining: number;
  error?: string;
};
export const shuffleDeck = async (
  deckId: string
): Promise<DiscardPileResponse> => {
  const res = await fetch(
    `${API_ROOT}/api/deck/${deckId}/shuffle/?remaining=true`,
    {
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    console.error(`Failed to shuffle deck: ${res.statusText}`);
    return { ok: false, remaining: 0, error: res.statusText };
  }
  const data = await res.json();
  return { ok: data.success, remaining: data.remaining };
};
export const discardCards = async (
  deckId: string,
  cardCodes: string
): Promise<DiscardPileResponse> => {
  const route = DISCARD_CARDS_ROUTE(deckId, cardCodes);
  const response = await fetch(route, {
    cache: 'no-store',
  });
  const data = await response.json();
  return { ok: data.success, remaining: data.remaining };
};

export const returnDiscardPile = async (
  deckId: string
): Promise<DiscardPileResponse> => {
  const response = await fetch(
    `${API_ROOT}/api/deck/${deckId}/pile/discard/return/`,
    {
      cache: 'no-store',
    }
  );
  const data = await response.json();
  return { ok: data.success, remaining: data.remaining };
};
