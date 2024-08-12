import { GameCondition, ConditionState } from '@/lib/conditions';
import { Card } from '@/lib/cards/cards.types';
import { calculateHandScore } from '@/lib/cards/helpers';

// TODO: move to constants?
export enum GamePhase {
  INITIAL = 'initial',
  ACTIVE = 'active',
  WON = 'won',
  LOST = 'lost',
}

export interface EvaluateGamePhaseProps {
  playerCards: Card[];
  houseCards: Card[];
  playerStands?: boolean;
}

interface GamePhaseEvaluator {
  evaluate: (props: EvaluateGamePhaseProps) => GamePhase;
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
  }: EvaluateGamePhaseProps): GamePhase => {
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
