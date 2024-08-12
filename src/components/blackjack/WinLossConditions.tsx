import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { ConditionState, GameCondition } from '@/lib/conditions';
import { GamePhase } from '@/lib/evaluator/evaluateHand';
import { ClassName, cn } from '@/lib/utils';

import { useBlackjackGame } from '@/contexts/BlackjackGameContext';

interface ConditionItemProps {
  condition: GameCondition;
  className?: ClassName;
}

export const ConditionItem = ({ condition, className }: ConditionItemProps) => {
  const layoutId = `condition-${condition.toString().replace(/\s+/g, '-')}`;

  return (
    <motion.div
      layout
      layoutId={layoutId}
      className={cn('text-2xl font-semibold text-white', className)}
    >
      {condition.toString()}
    </motion.div>
  );
};

interface ConditionsProps {
  className?: ClassName;
  title: string;
  conditions: GameCondition[];
  rightJustify?: boolean;
}
const DisplayConditions = ({
  title,
  conditions,
  className,
  rightJustify = false,
}: ConditionsProps) => {
  const { gamePhase } = useBlackjackGame();
  const unmetConditions = useMemo(
    () =>
      gamePhase !== GamePhase.ACTIVE
        ? conditions.filter(
            (condition) => condition.getState() !== ConditionState.MET
          )
        : conditions,
    [conditions, gamePhase]
  );
  return (
    <div
      className={cn(
        'flex flex-col gap-1 items-start opacity-80 text-foreground',
        { 'items-end': rightJustify },
        className
      )}
    >
      <h3
        className={cn('text-3xl w-full uppercase font-bold', {
          'text-right': rightJustify,
        })}
      >
        {title}
      </h3>
      {unmetConditions.map((condition, index) => (
        <ConditionItem key={index} condition={condition} />
      ))}
    </div>
  );
};

export const WinConditions = ({ className }: { className?: ClassName }) => {
  const { winConditions } = useBlackjackGame();
  return (
    <DisplayConditions
      title='to win'
      conditions={winConditions}
      className={cn('text-primary-green', className)}
    />
  );
};

export const LossConditions = ({ className }: { className?: ClassName }) => {
  const { lossConditions } = useBlackjackGame();
  return (
    <DisplayConditions
      title='to lose'
      conditions={lossConditions}
      className={cn('text-primary-red', className)}
      rightJustify
    />
  );
};
