import Image from 'next/image';

import { Card } from '@/lib/cards/cards.types';

interface DisplayCardProps {
  card: Card;
}

export const DisplayCard = ({ card }: DisplayCardProps) => {
  return (
    // janky aspect ratio matches the card images from the API
    <div className='w-[180px] h-[250px] relative'>
      <Image
        src={card.imageUrl}
        alt={card.fullString}
        fill
        className='rounded-xl shadow-2xl'
      />
    </div>
  );
};
