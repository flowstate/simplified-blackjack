import { Fragment } from 'react';

import { GamePhase } from '@/lib/evaluateHand';
import { cn } from '@/lib/utils';

import { SpadeChip } from '@/assets/icons';
import { useBlackjackGame } from '@/contexts/BlackjackGameContext';

export const TableRules = () => {
  const { gamePhase } = useBlackjackGame();
  const rules = ['no betting', 'house plays 2', 'no hit limit'];
  return (
    <section className='relative flex flex-1 flex-col gap-2 justify-center items-center size-full'>
      <div
        className={cn('flex flex-col gap-2 items-center', {
          'z-30': gamePhase === GamePhase.INITIAL,
        })}
      >
        <h1 className='text-8xl relative font-display uppercase font-semibold'>
          Simplified Blackjack
        </h1>
        <div className='flex gap-4 items-center text-4xl font-display  font-semibold'>
          {rules.map((rule, index) => (
            <Fragment key={index}>
              <h3 key={index}>{rule}</h3>
              {index !== rules.length - 1 && (
                <SpadeChip className='size-6 text-foreground' />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
