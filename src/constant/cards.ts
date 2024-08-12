export enum CardRanks {
  Ace = 'A',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '0',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
}

export enum CardSuits {
  Spades = 'S',
  Hearts = 'H',
  Clubs = 'C',
  Diamonds = 'D',
}

export const API_ROOT = 'https://deckofcardsapi.com';
export const CARD_IMAGE_URL_PREFIX = `${API_ROOT}/static/img/`;
