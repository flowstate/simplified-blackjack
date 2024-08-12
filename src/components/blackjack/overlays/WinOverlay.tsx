import {
  ModalBody,
  ModalContent,
  useModal,
} from '@/components/blackjack/overlays/AnimatedModal';
import { ConditionItem } from '@/components/blackjack/WinLossConditions';

import { useBlackjackGame } from '@/contexts/BlackjackGameContext';
import { ConditionState } from '@/lib/conditions';
import { GamePhase } from '@/lib/evaluator/evaluateHand';
import { useEffect, useMemo } from 'react';

export const WinOverlay = () => {
  const { startGame, gamePhase, winConditions } = useBlackjackGame();
  const { open, setOpen } = useModal();

  useEffect(() => {
    if (gamePhase === GamePhase.WON) {
      setOpen(true);
      return;
    }
    setOpen(false);
  }, [gamePhase]);

  const losingCondition = useMemo(() => {
    if (!open) return;
    return winConditions.find(
      (condition) => condition.getState() === ConditionState.MET
    );
  }, [open, winConditions]);

  return (
    <ModalBody onOutsideClick={startGame}>
      <ModalContent>
        <div className='flex flex-col items-center gap-12'>
          <div className='flex flex-col size-full justify-end items-center gap-4'>
            <h1 className='text-6xl text-primary-green font-bold uppercase font-display flex flex-col items-center'>
              You Won!
            </h1>
            {losingCondition && (
              <div className='flex gap-2 text-4xl items-center text-white'>
                <p>Win condition:</p>
                <ConditionItem
                  className='text-4xl'
                  condition={losingCondition}
                />
              </div>
            )}
          </div>
          <div className='flex flex-col size-full justify-start items-center'>
            <button
              className='p-[3px] relative active:scale-90 hover:scale-105 transition-all'
              onClick={startGame}
            >
              <div className='absolute inset-0 bg-gradient-to-r from-primary-red to-primary-orange rounded-lg' />
              <div className='px-8 py-2  bg-black rounded-[6px] font-bold  relative group transition duration-200 text-white hover:bg-transparent'>
                Play Another Hand
              </div>
            </button>
          </div>
        </div>
      </ModalContent>
    </ModalBody>
  );
};
