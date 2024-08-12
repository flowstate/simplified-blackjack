import {
  buildHouseBlackjack,
  buildHouseBusts,
  buildPlayerBlackjack,
  buildPlayerBusts,
  buildStandAboveHouse,
  buildStandBelowHouse,
  buildStandOnTie,
  ConditionState,
} from './conditions';

describe('Loss Conditions', () => {
  test('House has blackjack', () => {
    const condition = buildHouseBlackjack();
    condition.evaluate({ houseScore: 20, playerScore: 18 });
    expect(condition.getState()).toBe(ConditionState.UNMET);
    condition.evaluate({ houseScore: 21, playerScore: 18 });
    expect(condition.getState()).toBe(ConditionState.MET);
  });

  test('Player busts', () => {
    const condition = buildPlayerBusts();
    condition.evaluate({ playerScore: 20, houseScore: 18 });
    expect(condition.getState()).toBe(ConditionState.UNMET);
    condition.evaluate({ playerScore: 22, houseScore: 18 });
    expect(condition.getState()).toBe(ConditionState.MET);
  });

  test('Stand on a tie', () => {
    const condition = buildStandOnTie();
    condition.evaluate({ houseScore: 21, playerScore: 20, playerStands: true });
    expect(condition.getState()).toBe(ConditionState.UNMET);
    condition.evaluate({
      houseScore: 20,
      playerScore: 20,
      playerStands: false,
    });
    expect(condition.getState()).toBe(ConditionState.PARTIAL);
    condition.evaluate({ houseScore: 20, playerScore: 20, playerStands: true });
    expect(condition.getState()).toBe(ConditionState.MET);
  });

  test('Stand below house', () => {
    const condition = buildStandBelowHouse();
    condition.evaluate({ playerScore: 21, houseScore: 20, playerStands: true });
    expect(condition.getState()).toBe(ConditionState.UNMET);
    condition.evaluate({
      playerScore: 18,
      houseScore: 20,
      playerStands: false,
    });
    expect(condition.getState()).toBe(ConditionState.PARTIAL);
    condition.evaluate({ playerScore: 18, houseScore: 20, playerStands: true });
    expect(condition.getState()).toBe(ConditionState.MET);
  });
});

describe('Win Conditions', () => {
  test('Player has blackjack', () => {
    const condition = buildPlayerBlackjack();
    condition.evaluate({ playerScore: 20, houseScore: 18 });
    expect(condition.getState()).toBe(ConditionState.UNMET);
    condition.evaluate({ playerScore: 21, houseScore: 18 });
    expect(condition.getState()).toBe(ConditionState.MET);
  });

  test('Stand above house', () => {
    const condition = buildStandAboveHouse();
    condition.evaluate({ playerScore: 17, houseScore: 18, playerStands: true });
    expect(condition.getState()).toBe(ConditionState.UNMET);
    condition.evaluate({
      playerScore: 23,
      houseScore: 18,
      playerStands: false,
    });
    expect(condition.getState()).toBe(ConditionState.PARTIAL);
    condition.evaluate({ playerScore: 23, houseScore: 18, playerStands: true });
    expect(condition.getState()).toBe(ConditionState.MET);
  });

  test('House busts', () => {
    const condition = buildHouseBusts();
    condition.evaluate({ houseScore: 20, playerScore: 18 });
    expect(condition.getState()).toBe(ConditionState.UNMET);
    condition.evaluate({ houseScore: 22, playerScore: 18 });
    expect(condition.getState()).toBe(ConditionState.MET);
  });
});
