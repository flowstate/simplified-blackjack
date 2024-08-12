import { cn } from '@/lib/utils';

import { Hand } from '@/components/blackjack/Hand';
import {
  LossOverlay,
  StartOverlay,
  WinOverlay,
} from '@/components/blackjack/overlays';
import { PlayerActions } from '@/components/blackjack/PlayerActions';
import { TableRules } from '@/components/blackjack/TableRules';
import {
  LossConditions,
  WinConditions,
} from '@/components/blackjack/WinLossConditions';

import backgroundImage from '@/assets/images/felt720.png';
import { useBlackjackGame } from '@/contexts/BlackjackGameContext';
import { ModalProvider } from '@/components/AnimatedModal';

export const BlackjackTable = () => {
  const { playerCards, houseCards } = useBlackjackGame();

  return (
    <main
      className={cn(
        'relative size-screen flex justify-center bg-table-gradient text-foreground transition-colors'
      )}
    >
      <div className='w-[1440px] h-screen flex flex-col items-center py-10 z-10'>
        <section className='flex items-start flex-1 gap-10 size-full relative'>
          <LossConditions className='flex-1 mt-20' />
          <Hand className='flex-1 mt-14' isHouse cards={houseCards} />
          <WinConditions className='flex-1 mt-20' />
        </section>
        <TableRules />
        <section className='size-full flex flex-col gap-10 items-center flex-1'>
          <Hand className='flex-1' cards={playerCards} />
          <PlayerActions />
        </section>
      </div>
      <div
        className='absolute inset-0 bg-repeat opacity-90 mix-blend-multiply z-[1]'
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      />
      <ModalProvider>
        <StartOverlay />
      </ModalProvider>
      <ModalProvider>
        <WinOverlay />
      </ModalProvider>
      <ModalProvider>
        <LossOverlay />
      </ModalProvider>
    </main>
  );
};
