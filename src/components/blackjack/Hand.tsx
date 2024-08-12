import {
  AnimatePresence,
  AnimationDefinition,
  motion,
  Variants,
} from 'framer-motion';
import { useCallback, useEffect, useMemo } from 'react';

import { ClassName, cn } from '@/lib/utils';

import { DisplayCard } from '@/components/blackjack/Cards';

import { HandState, useBlackjackGame } from '@/contexts/BlackjackGameContext';
import { calculateHandScore } from '@/lib/cards/helpers';
import { GamePhase } from '@/lib/evaluator/evaluateHand';

interface HandProps {
  isHouse?: boolean;
  className?: ClassName;
}

const variants: Variants = {
  dealEnter: {
    opacity: 0,
  },
  dealAnimate: {
    opacity: 1,
    x: 0,
  },
  hitEnter: {
    opacity: 0,
  },
  hitAnimate: {
    opacity: 1,
  },
  exit: { x: '100%', opacity: 0 },
};

export const Hand = ({ className, isHouse = false }: HandProps) => {
  const { setHandState, playerCards, houseCards, gamePhase, handState } =
    useBlackjackGame();
  const cards = useMemo(() => {
    if (gamePhase === GamePhase.INITIAL) return [];
    return isHouse ? houseCards : playerCards;
  }, [isHouse, playerCards, houseCards, gamePhase]);

  const calculatedScore = useMemo(() => calculateHandScore(cards), [cards]);
  const scoreText = useMemo(
    () => (calculatedScore > 0 ? calculatedScore : null),
    [calculatedScore]
  );

  const handleExitComplete = useCallback(() => {
    if (isHouse || handState !== HandState.CLEARING) return;
    setTimeout(() => {
      setHandState(HandState.DEALING);
    }, 500);
  }, [isHouse, setHandState, handState]);

  const handleAnimationComplete = (definition: string) => {
    if (!definition.toLowerCase().includes('animate')) return;
    setHandState(HandState.WAITING_ON_PLAYER);
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2 items-center justify-start size-full',
        { ' flex-col-reverse': !isHouse },
        className
      )}
    >
      <div className='relative w-full justify-center flex gap-1 h-[250px]'>
        <AnimatePresence mode='wait' onExitComplete={handleExitComplete}>
          {cards.map((card, index) => (
            <motion.div
              key={`${isHouse ? 'house' : 'player'}-card-${card.code}`}
              layout
              variants={variants}
              layoutId={`card-${card.code}`}
              initial={index > 1 ? 'hitEnter' : 'dealEnter'}
              animate={index > 1 ? 'hitAnimate' : 'dealAnimate'}
              exit='exit'
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
                delay: index * 0.1 + (isHouse ? 0 : 0.4),
              }}
              onAnimationComplete={(definition: AnimationDefinition) => {
                if (isHouse || index !== cards.length - 1) return;
                handleAnimationComplete(definition.toLocaleString());
              }}
            >
              <DisplayCard card={card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className={cn('flex items-end', { 'text-transparent': !scoreText })}>
        {scoreText && (
          <p
            className={cn('font-bold font-display text-4xl', {
              'opacity-50': calculatedScore === 0,
            })}
          >
            {scoreText}
          </p>
        )}
        <p
          className={cn('font-bold font-display text-2xl', {
            'opacity-50': calculatedScore === 0,
          })}
        >
          pts
        </p>
      </div>
    </div>
  );
};
