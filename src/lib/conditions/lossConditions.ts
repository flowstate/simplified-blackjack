import {
  ConditionType,
  ConditionInput,
  ConditionState,
  GameCondition,
  createGameCondition,
} from '@/lib/conditions';

export const buildStandBelowHouse = (): GameCondition => {
  return createGameCondition(
    ConditionType.LOSS,
    (input: ConditionInput) => {
      const { playerScore, houseScore, playerStands = false } = input;
      if (playerScore < houseScore) {
        return playerStands ? ConditionState.MET : ConditionState.PARTIAL;
      } else {
        return ConditionState.UNMET;
      }
    },
    'Stand on a lower score'
  );
};

export const buildHouseBlackjack = (): GameCondition => {
  return createGameCondition(
    ConditionType.LOSS,
    ({ houseScore }: ConditionInput) => {
      return houseScore === 21 ? ConditionState.MET : ConditionState.UNMET;
    },
    'House scores 21'
  );
};

export const buildStandOnTie = (): GameCondition => {
  return createGameCondition(
    ConditionType.LOSS,
    ({ houseScore, playerScore, playerStands = false }: ConditionInput) => {
      return playerScore === houseScore
        ? playerStands
          ? ConditionState.MET
          : ConditionState.PARTIAL
        : ConditionState.UNMET;
    },
    'Stand on a tie'
  );
};

export const buildPlayerBusts = (): GameCondition => {
  return createGameCondition(
    ConditionType.LOSS,
    ({ playerScore }: ConditionInput) => {
      return playerScore > 21 ? ConditionState.MET : ConditionState.UNMET;
    },
    'Score over 21'
  );
};
