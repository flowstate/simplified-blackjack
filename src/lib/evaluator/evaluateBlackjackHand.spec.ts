import {
  buildHouseBlackjack,
  buildHouseBusts,
  buildPlayerBlackjack,
  buildPlayerBusts,
  buildStandAboveHouse,
  buildStandBelowHouse,
  buildStandOnTie,
} from '@/lib/conditions';
import { fullDeck } from '@/lib/deck/deck';

import { buildGamePhaseEvaluator, GamePhase } from './evaluateHand';

const simplifiedLossConditions = [
  buildStandBelowHouse(),
  buildHouseBlackjack(),
  buildStandOnTie(),
  buildPlayerBusts(),
];

const simplifiedWinConditions = [
  buildStandAboveHouse(),
  buildPlayerBlackjack(),
  buildHouseBusts(),
];

const evaluator = buildGamePhaseEvaluator({
  lossConditions: simplifiedLossConditions,
  winConditions: simplifiedWinConditions,
});

describe('blackjackEval', () => {
  it('should return LOST if house score is 21', () => {
    const playerCards = [fullDeck['5S'], fullDeck['6S']];
    const houseCards = [fullDeck['AD'], fullDeck['KD']];
    expect(evaluator.evaluate({ playerCards, houseCards })).toBe(
      GamePhase.LOST
    );
  });

  it('should return LOST if player score is over 21', () => {
    const playerCards = [fullDeck['KD'], fullDeck['9D'], fullDeck['5D']];
    const houseCards = [fullDeck['5D'], fullDeck['6D']];
    expect(evaluator.evaluate({ playerCards, houseCards })).toBe(
      GamePhase.LOST
    );
  });

  it('should return LOST if player stands and player score is less than house score', () => {
    const playerCards = [fullDeck['5D'], fullDeck['6D']];
    const houseCards = [fullDeck['7D'], fullDeck['8D']];
    expect(
      evaluator.evaluate({ playerCards, houseCards, playerStands: true })
    ).toBe(GamePhase.LOST);
  });

  it('should return LOST if player stands and player score equals house score', () => {
    const playerCards = [fullDeck['7D'], fullDeck['8D']];
    const houseCards = [fullDeck['7D'], fullDeck['8D']];
    expect(
      evaluator.evaluate({ playerCards, houseCards, playerStands: true })
    ).toBe(GamePhase.LOST);
  });

  it('should return WON if player score is 21 and house score is not 21', () => {
    const playerCards = [fullDeck['AD'], fullDeck['KD']];
    const houseCards = [fullDeck['5D'], fullDeck['6D']];
    expect(evaluator.evaluate({ playerCards, houseCards })).toBe(GamePhase.WON);
  });

  it('should return WON if player score is less than 21 and greater than house score', () => {
    const playerCards = [fullDeck['9D'], fullDeck['7D']];
    const houseCards = [fullDeck['5D'], fullDeck['6D']];
    expect(
      evaluator.evaluate({ playerCards, houseCards, playerStands: true })
    ).toBe(GamePhase.WON);
  });

  it('should return ACTIVE if none of the above conditions are met', () => {
    const playerCards = [fullDeck['5D'], fullDeck['6D']];
    const houseCards = [fullDeck['5D'], fullDeck['6D']];
    expect(evaluator.evaluate({ playerCards, houseCards })).toBe(
      GamePhase.ACTIVE
    );
  });
});
