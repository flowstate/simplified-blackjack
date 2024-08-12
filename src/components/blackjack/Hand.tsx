import {
  AnimatePresence,
  AnimationDefinition,
  motion,
  Variants,
} from 'framer-motion';
import { useEffect, useMemo } from 'react';

import { Card } from '@/lib/deck/deck';
import { calculateHandScore } from '@/lib/helper';
import { ClassName, cn } from '@/lib/utils';

import { FullCard } from '@/components/blackjack/Cards';

import { HandState, useBlackjackGame } from '@/contexts/BlackjackGameContext';

interface HandProps {
  cards: Card[];
  isHouse?: boolean;
  className?: ClassName;
}

const variants: Variants = {
  dealEnter: {
    opacity: 0,
    x: '-100%',
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

export const Hand = ({ cards, className, isHouse = false }: HandProps) => {
  const { setHandState } = useBlackjackGame();
  const calculatedScore = useMemo(() => calculateHandScore(cards), [cards]);
  const scoreText = useMemo(() => {
    const prefix = 'Score ';
    return calculatedScore > 0 ? `${prefix}${calculatedScore}` : prefix;
  }, [calculatedScore]);

  // pass in a delay prop to the variants
  // add a delay to all animations, add index-based delay to each card (not hitting card, just the initial deal)

  const handleExitComplete = () => {
    console.log('HAND: handleExitComplete');
    if (isHouse) return;
    setTimeout(() => {
      console.log('HAND: Setting state to dealing');
      setHandState(HandState.DEALING);
    }, 1000);
  };

  const handleAnimationComplete = (definition: string) => {
    if (!definition.toLowerCase().includes('animate')) return;
    setHandState(HandState.WAITING_ON_PLAYER);
  };

  useEffect(() => {
    console.log(
      `${isHouse ? 'House' : 'Player'} cards:`,
      cards.map((card) => card.code).join(', ')
    );
  }, [cards, isHouse]);

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
                duration: 0.3,
                ease: 'easeInOut',
                // layout: { duration: 0.5, ease: 'easeInOut' },
                // x: { delay: 0.3, type: 'easeOut' },
                // opacity: { delay: 0.3, duration: 0.2 },
              }}
              onAnimationComplete={(definition: AnimationDefinition) => {
                if (isHouse || index !== cards.length - 1) return;
                console.log('HAND: handleAnimationComplete', definition);
                handleAnimationComplete(definition.toLocaleString());
              }}
            >
              <FullCard card={card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p
        className={cn('font-bold font-display uppercase text-3xl', {
          'opacity-50': calculatedScore === 0,
        })}
      >
        {scoreText}
      </p>
    </div>
  );
};
