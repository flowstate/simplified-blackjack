import { useEffect } from 'react';

import { GamePhase } from '@/lib/evaluator/evaluateHand';

import {
  ModalBody,
  ModalContent,
  useModal,
} from '@/components/blackjack/overlays/AnimatedModal';

import { useBlackjackGame } from '@/contexts/BlackjackGameContext';

export const StartOverlay = () => {
  const { startGame, gamePhase } = useBlackjackGame();
  const { setOpen } = useModal();

  useEffect(() => {
    if (gamePhase === GamePhase.INITIAL) {
      setOpen(true);
      return;
    }
    setOpen(false);
  }, [gamePhase, setOpen]);

  return (
    <ModalBody onOutsideClick={startGame}>
      <ModalContent>
        <div className='flex flex-col size-full justify-end items-center'>
          <h1 className='text-6xl text-primary-orange mb-20 font-bold uppercase font-display flex flex-col items-center'>
            <span>Welcome to</span> <span>Simplified Blackjack!</span>
          </h1>
        </div>
        <div className='flex flex-col size-full justify-start items-center'>
          <button
            className='p-[3px] relative active:scale-90 hover:scale-105 transition-all'
            onClick={startGame}
          >
            <div className='absolute inset-0 bg-gradient-to-r from-primary-red to-primary-orange rounded-lg' />
            <div className='px-8 py-2  bg-black rounded-[6px] font-bold  relative group transition duration-200 text-white hover:bg-transparent'>
              Start Game
            </div>
          </button>
        </div>
      </ModalContent>
    </ModalBody>
  );
};
