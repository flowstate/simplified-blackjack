import { useUpdateEffect } from 'ahooks';
import { createContext, useContext, useMemo, useRef, useState } from 'react';

import { Card } from '@/lib/deck/deck';
import { DeckProvider } from '@/lib/deckProvider/deckProvider';
import {
  buildGamePhaseEvaluator,
  GamePhase,
  GamePhaseProps,
} from '@/lib/evaluateHand';

import {
  buildHouseBlackjack,
  buildHouseBusts,
  buildPlayerBlackjack,
  buildPlayerBusts,
  buildStandAboveHouse,
  buildStandBelowHouse,
  buildStandOnTie,
  GameCondition,
} from '@/constant/conditions';
import { useActions } from '@/contexts/ActionsContext';
export enum HandState {
  STARTING = 'starting',
  CLEARING = 'clearing',
  DEALING = 'dealing',
  WAITING_ON_PLAYER = 'waiting_on_player',
  HITTING = 'hitting',
  COMPLETE = 'complete',
}
interface BlackjackGameClient {
  startGame: () => Promise<void>;
  stand: () => void;
  hit: () => Promise<void>;
  playerCards: Card[];
  houseCards: Card[];
  discardPile: Card[];
  gamePhase: GamePhase;
  winConditions: GameCondition[];
  lossConditions: GameCondition[];
  handState: HandState;
  setHandState: (state: HandState) => void;
}

const BlackjackGameContext = createContext<BlackjackGameClient | null>(null);

const simplifiedLossConditions = [
  buildStandBelowHouse(),
  buildHouseBlackjack(),
  buildStandOnTie(),
  buildPlayerBusts(),
];

const simplifiedWinConditions = [
  buildStandAboveHouse(),
  buildPlayerBlackjack(),
  buildHouseBusts(),
];

export const useBlackjackGame = () => {
  const context = useContext(BlackjackGameContext);
  if (!context) {
    throw new Error(
      'useBlackjackGame must be used within a BlackjackGameProvider'
    );
  }
  return context;
};

export const BlackjackGameProvider = ({
  children,
  deckProvider,
}: {
  children: React.ReactNode;
  deckProvider: DeckProvider;
}) => {
  const { addAction } = useActions();
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.INITIAL);
  const [handState, setHandState] = useState<HandState>(HandState.COMPLETE);
  const playerCardsRef = useRef<Card[]>([]);
  const houseCardsRef = useRef<Card[]>([]);
  const winConditions = useMemo(() => simplifiedWinConditions, []);
  const lossConditions = useMemo(() => simplifiedLossConditions, []);

  useUpdateEffect(() => {
    // all inactive phases mean the hand is complete
    if (gamePhase !== GamePhase.ACTIVE) {
      console.log('setting hand state to complete');
      setHandState(HandState.COMPLETE);
    }

    if (handState === HandState.DEALING) {
      dealCards();
    }

    if (handState === HandState.HITTING) {
      hit();
    }

    if (handState === HandState.WAITING_ON_PLAYER) {
      updateGamePhase({
        playerCards: playerCardsRef.current,
        houseCards: houseCardsRef.current,
      });
    }
  }, [gamePhase, handState]);

  const evaluator = useMemo(
    () =>
      buildGamePhaseEvaluator({
        lossConditions,
        winConditions,
      }),
    [lossConditions, winConditions]
  );

  const updateGamePhase = (input: GamePhaseProps) => {
    const newState = evaluator.evaluate(input);
    if (newState === GamePhase.LOST || newState === GamePhase.WON) {
      console.log(
        newState === GamePhase.LOST
          ? 'Player has lost the game.'
          : 'Player has won the game.'
      );
      endGame(newState);
    }
    setGamePhase(newState);
  };

  const endGame = async (state: GamePhase.LOST | GamePhase.WON) => {
    addAction(
      state === GamePhase.LOST ? 'You lose. Better luck next time!' : 'You win!'
    );
    const discardedCards = [
      ...playerCardsRef.current,
      ...houseCardsRef.current,
    ];
    await deckProvider.discardCards(discardedCards);
  };

  const startGame = async () => {
    addAction('Starting a new game');
    if (gamePhase === GamePhase.INITIAL) {
      addAction('Opening a brand new deck');
      await deckProvider.openDeck();
    }

    setGamePhase(GamePhase.ACTIVE);
    setHandState(HandState.STARTING);
  };

  const dealCards = async () => {
    addAction('Dealing cards');
    const drawnCards = await deckProvider.drawCards(4);
    const newPlayerCards = drawnCards.slice(0, 2);
    const newHouseCards = drawnCards.slice(2, 4);
    playerCardsRef.current = newPlayerCards;
    houseCardsRef.current = newHouseCards;
    updateGamePhase({
      playerCards: newPlayerCards,
      houseCards: newHouseCards,
    });
  };

  const stand = () => {
    addAction('Player stands');
    updateGamePhase({
      playerCards: playerCardsRef.current,
      houseCards: houseCardsRef.current,
      playerStands: true,
    });
  };

  const hit = async () => {
    addAction('Player hits');
    const newCard = await deckProvider.drawCards(1);
    addAction(`Drew a card: ${newCard[0].code}`);
    const newPlayerCards = [...playerCardsRef.current, newCard[0]];
    playerCardsRef.current = newPlayerCards;
    updateGamePhase({
      playerCards: newPlayerCards,
      houseCards: houseCardsRef.current,
    });
  };

  return (
    <BlackjackGameContext.Provider
      value={{
        handState,
        setHandState,
        startGame,
        stand,
        hit,
        playerCards: playerCardsRef.current,
        houseCards: houseCardsRef.current,
        discardPile: deckProvider.discardPile,
        gamePhase,
        winConditions,
        lossConditions,
      }}
    >
      {children}
    </BlackjackGameContext.Provider>
  );
};
