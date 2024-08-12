import { Card, CardRanks, CardSuits } from '@/lib/cards/cards.types';
import { CARD_IMAGE_URL_PREFIX } from '@/lib/deck/constants';

export const rankToValue = (rank: CardRanks): number => {
  return rank === CardRanks.Ace
    ? 11
    : rank === CardRanks.Jack ||
      rank === CardRanks.Queen ||
      rank === CardRanks.King ||
      rank === CardRanks.Ten
    ? 10
    : Number(rank);
};

export const rankToString = (rank: CardRanks): string => {
  switch (rank) {
    case CardRanks.Ace:
      return 'Ace';
    case CardRanks.King:
      return 'King';
    case CardRanks.Queen:
      return 'Queen';
    case CardRanks.Jack:
      return 'Jack';
    case CardRanks.Ten:
      return 'Ten';
    case CardRanks.Nine:
      return 'Nine';
    case CardRanks.Eight:
      return 'Eight';
    case CardRanks.Seven:
      return 'Seven';
    case CardRanks.Six:
      return 'Six';
    case CardRanks.Five:
      return 'Five';
    case CardRanks.Four:
      return 'Four';
    case CardRanks.Three:
      return 'Three';
    case CardRanks.Two:
      return 'Two';
    default:
      throw new Error(`Unhandled card rank: ${rank}`);
  }
};

export const suitToString = (suit: CardSuits): string => {
  switch (suit) {
    case CardSuits.Spades:
      return 'Spades';
    case CardSuits.Hearts:
      return 'Hearts';
    case CardSuits.Diamonds:
      return 'Diamonds';
    case CardSuits.Clubs:
      return 'Clubs';
    default:
      throw new Error(`Unhandled card suit: ${suit}`);
  }
};

export const cardCodeToRankAndSuit = (
  code: string
): { rank: CardRanks; suit: CardSuits } => {
  const rank = code.slice(0, -1) as CardRanks;
  const suit = code.slice(-1) as CardSuits;
  return { rank, suit };
};

export const rankAndSuitToCardCode = (
  rank: CardRanks,
  suit: CardSuits
): string => {
  return `${rank}${suit.charAt(0)}`;
};

type CreateCardInput = { rank: CardRanks; suit: CardSuits } | { code: string };

export const createCard = (props: CreateCardInput): Card => {
  let rank: CardRanks;
  let suit: CardSuits;
  let code: string;

  if ('code' in props) {
    ({ rank, suit } = cardCodeToRankAndSuit(props.code));
    code = props.code;
  } else {
    ({ rank, suit } = props);
    code = rankAndSuitToCardCode(rank, suit);
  }
  const value = rankToValue(rank);
  const fullString = `${rankToString(rank)} of ${suitToString(suit)}`;
  return {
    rank,
    value,
    suit,
    code,
    imageUrl: `${CARD_IMAGE_URL_PREFIX}${code}.png`,
    fullString,
  };
};

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
