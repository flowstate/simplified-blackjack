import { Card } from '@/lib/deck/deck';
import { calculateHandScore } from '@/lib/helper';

import { ConditionState, GameCondition } from '@/constant/conditions';

// TODO: move to constants?
export enum GamePhase {
  INITIAL,
  ACTIVE,
  WON,
  LOST,
}

export interface GamePhaseProps {
  playerCards: Card[];
  houseCards: Card[];
  playerStands?: boolean;
}

interface GamePhaseEvaluator {
  evaluate: (props: GamePhaseProps) => GamePhase;
}

export const buildGamePhaseEvaluator = ({
  lossConditions,
  winConditions,
}: {
  lossConditions: GameCondition[];
  winConditions: GameCondition[];
}): GamePhaseEvaluator => {
  const evaluate = ({
    playerCards,
    houseCards,
    playerStands = false,
  }: GamePhaseProps): GamePhase => {
    const playerScore = calculateHandScore(playerCards);
    const houseScore = calculateHandScore(houseCards);

    for (const condition of lossConditions) {
      condition.evaluate({ playerScore, houseScore, playerStands });
      if (condition.getState() === ConditionState.MET) {
        return GamePhase.LOST;
      }
    }

    for (const condition of winConditions) {
      condition.evaluate({ playerScore, houseScore, playerStands });
      if (condition.getState() === ConditionState.MET) {
        return GamePhase.WON;
      }
    }

    return GamePhase.ACTIVE;
  };

  return {
    evaluate,
  };
};
