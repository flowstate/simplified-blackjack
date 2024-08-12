import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { FullCard } from '@/components/blackjack/Cards';

import { fullDeck } from '../../lib/deck/deck';

const CardEnterExit = () => {
  const [index, setIndex] = useState(0);
  const [showCards, setShowCards] = useState(true);
  const cards = Object.values(fullDeck);

  const handleNext = () => {
    setShowCards(false);
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 2) % cards.length);
      setShowCards(true);
    }, 1000); // 0.5 second delay
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex justify-center items-center'>
        <AnimatePresence mode='sync'>
          {showCards &&
            cards.slice(index, index + 2).map((card) => (
              <motion.div
                key={card.code}
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ duration: 0.5 }}
                className='m-2'
              >
                <FullCard card={card} />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
      <button
        onClick={handleNext}
        className='mt-4 px-4 py-2 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600'
      >
        Next Cards
      </button>
    </div>
  );
};

export default CardEnterExit;
