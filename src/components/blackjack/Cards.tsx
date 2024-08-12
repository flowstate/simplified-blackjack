import Image from 'next/image';

import { Card } from '@/lib/deck/deck';
import { ClassName, cn } from '@/lib/utils';

interface PlaceholderProps {
  className?: ClassName;
}

export const CardPlaceholder = ({ className }: PlaceholderProps) => {
  return (
    <div
      className={cn(
        'w-[180px] h-[250px] border-4 border-white/50  rounded-xl',
        className
      )}
    />
  );
};

interface FullCardProps {
  card: Card;
}

export const FullCard = ({ card }: FullCardProps) => {
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
