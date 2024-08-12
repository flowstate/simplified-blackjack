export enum ConditionState {
  UNMET = 'UNMET',
  PARTIAL = 'PARTIAL',
  MET = 'MET',
}

export enum ConditionType {
  WIN = 'WIN',
  LOSS = 'LOSS',
}

export type ConditionInput = {
  playerScore: number;
  houseScore: number;
  playerStands?: boolean;
};

export interface GameCondition {
  getState: () => ConditionState;
  type: ConditionType;
  evaluate: (input: ConditionInput) => void;
  toString: () => string;
}

export const createGameCondition = (
  type: ConditionType,
  evaluateFn: (input: ConditionInput) => ConditionState,
  toStringMessage: string
): GameCondition => {
  let state = ConditionState.UNMET;

  const evaluate = (input: ConditionInput) => {
    state = evaluateFn(input); // Directly update state based on evaluation function
  };

  const getState = () => state;

  const toString = () => toStringMessage;

  return {
    evaluate,
    getState,
    toString,
    type,
  };
};

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
    'House has blackjack'
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
    'Stand above house'
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
