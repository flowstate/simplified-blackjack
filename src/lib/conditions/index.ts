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

export * from './lossConditions';
export * from './winConditions';
