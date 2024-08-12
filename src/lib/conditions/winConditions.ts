import {
  ConditionInput,
  ConditionState,
  ConditionType,
  createGameCondition,
  GameCondition,
} from '@/lib/conditions';

export const buildStandAboveHouse = (): GameCondition => {
  return createGameCondition(
    ConditionType.WIN,
    ({ playerScore, houseScore, playerStands = false }: ConditionInput) => {
      if (playerScore > houseScore) {
        return playerStands ? ConditionState.MET : ConditionState.PARTIAL;
      } else {
        return ConditionState.UNMET;
      }
    },
    'Stand on a higher score'
  );
};

export const buildPlayerBlackjack = (): GameCondition => {
  return createGameCondition(
    ConditionType.WIN,
    ({ playerScore }: ConditionInput) => {
      return playerScore === 21 ? ConditionState.MET : ConditionState.UNMET;
    },
    'Score a blackjack'
  );
};

export const buildHouseBusts = (): GameCondition => {
  return createGameCondition(
    ConditionType.WIN,
    ({ houseScore }: ConditionInput) => {
      return houseScore > 21 ? ConditionState.MET : ConditionState.UNMET;
    },
    'House busts'
  );
};
