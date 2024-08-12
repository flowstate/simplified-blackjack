import { useMemo } from 'react';

import TableButton from '@/components/buttons/TableButton';

import { NoBets } from '@/assets/icons/NoBets';
import { HandState, useBlackjackGame } from '@/contexts/BlackjackGameContext';

export const PlayerActions = () => {
  const { stand, handState, setHandState } = useBlackjackGame();

  const playerActionsDisabled = useMemo(
    () => handState !== HandState.WAITING_ON_PLAYER,
    [handState]
  );
  return (
    <div className='flex gap-4 justify-center items-center w-full'>
      <TableButton
        disabled={playerActionsDisabled}
        onClick={() => setHandState(HandState.HITTING)}
        className='border-primary-green font-semibold border-4 text-primary-green hover:bg-primary-green/40'
      >
        Hit
      </TableButton>
      <NoBets className='opacity-30 size-40 text-white' />
      <TableButton
        disabled={playerActionsDisabled}
        className='border-primary-blue font-semibold border-4 text-primary-blue hover:bg-primary-blue/40'
        onClick={stand}
      >
        Stand
      </TableButton>
    </div>
  );
};
