import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { Card } from '@/lib/deck/deck';
import { calculateHandScore } from '@/lib/helper';
import { ClassName, cn } from '@/lib/utils';

import { FullCard } from '@/components/blackjack/Cards';

import { HandState, useBlackjackGame } from '@/contexts/BlackjackGameContext';

interface HandProps {
  cards: Card[];
  isHouse?: boolean;
  className?: ClassName;
  setReadyForAction?: (ready: boolean) => void;
}

export const Hand = ({
  setReadyForAction,
  cards,
  className,
  isHouse = false,
}: HandProps) => {
  const { handState, setHandState } = useBlackjackGame();
  const calculatedScore = useMemo(() => calculateHandScore(cards), [cards]);
  const [showCards, setShowCards] = useState(true);
  const scoreText = useMemo(() => {
    const prefix = 'Score ';
    return calculatedScore > 0 ? `${prefix}${calculatedScore}` : prefix;
  }, [calculatedScore]);

  // pass in a delay prop to the variants
  // add a delay to all animations, add index-based delay to each card (not hitting card, just the initial deal)
  useEffect(() => {
    if (isHouse) return;
    // if starting hand
    if (handState === HandState.STARTING) {
      // if player has cards
      if (cards.length > 0) {
        // set state to clearing
        setHandState(HandState.CLEARING);
      }
    }
  }, [handState, cards, isHouse, setHandState]);

  // clear the cards
  // set state to dealing
  // deal the cards
  // set state to waiting on player

  // if hitting
  // player can't act
  // add card to hand with variant hit
  // on animation complete, set state to waiting on player

  const handleExitComplete = () => {
    setShowCards(false);
    setTimeout(() => {
      setShowCards(true);
    }, 1000);
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
          <LayoutGroup>
            {showCards &&
              cards.map((card) => (
                <motion.div
                  key={`${isHouse ? 'house' : 'player'}-card-${card.code}`}
                  layout
                  layoutId={`card-${card.code}`}
                  initial={{ opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0 }}
                  transition={{
                    layout: { duration: 0.5, ease: 'easeInOut' },
                    opacity: { delay: 0.3, duration: 0.2 },
                    x: { delay: 0.3, type: 'easeOut' },
                  }}
                  onAnimationComplete={() => setReadyForAction?.(true)}
                >
                  <FullCard card={card} />
                </motion.div>
              ))}
          </LayoutGroup>
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
