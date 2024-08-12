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

export interface Card {
  rank: CardRanks;
  value: number;
  suit: CardSuits;
  code: string;
  imageUrl: string;
  fullString: string;
}
