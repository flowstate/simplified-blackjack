import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

import { OverlayProps } from '@/components/blackjack/overlays';
import { ConditionItem } from '@/components/blackjack/WinLossConditions';

import { ConditionState } from '@/constant/conditions';
import { useBlackjackGame } from '@/contexts/BlackjackGameContext';

export const LossOverlay = ({ enabled, onClose }: OverlayProps) => {
  const { startGame, lossConditions } = useBlackjackGame();

  const losingCondition = useMemo(
    () =>
      lossConditions.find(
        (condition) => condition.getState() === ConditionState.MET
      ),
    [lossConditions]
  );

  return (
    <AnimatePresence onExitComplete={onClose}>
      {enabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key='start-overlay'
          className='absolute inset-0 bg-transparent z-20 grid grid-rows-2 size-screen backdrop-saturate-0 transition-opacity backdrop-blur'
        >
          <div className='flex flex-col size-full justify-end items-center'>
            <h1 className='text-8xl mb-20 font-bold uppercase font-display flex justify-center items-center'>
              The House Wins
            </h1>
            {losingCondition && (
              <div className='flex gap-2 text-4xl items-center'>
                <p>Loss condition:</p>
                <ConditionItem
                  className='text-4xl'
                  condition={losingCondition}
                />
              </div>
            )}
          </div>
          <div className='flex flex-col size-full justify-start items-center'>
            <button
              className='mt-40 px-4 py-2 bg-blue-500 font-bold rounded hover:bg-blue-700 flex justify-center items-center'
              onClick={startGame}
            >
              Try again
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
