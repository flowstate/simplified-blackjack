import { useUpdateEffect } from 'ahooks';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { DeckProvider } from '@/lib/deckProvider/deckProvider';
import {
  buildGamePhaseEvaluator,
  GamePhase,
  EvaluateGamePhaseProps,
} from '@/lib/evaluator/evaluateHand';

import {
  GameCondition,
  buildStandBelowHouse,
  buildHouseBlackjack,
  buildStandOnTie,
  buildPlayerBusts,
  buildStandAboveHouse,
  buildPlayerBlackjack,
  buildHouseBusts,
} from '@/lib/conditions';
import { Card } from '@/lib/cards/cards.types';
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
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.INITIAL);
  const [handState, setHandState] = useState<HandState>(HandState.COMPLETE);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [houseCards, setHouseCards] = useState<Card[]>([]);

  const winConditions = useMemo(() => simplifiedWinConditions, []);
  const lossConditions = useMemo(() => simplifiedLossConditions, []);

  useUpdateEffect(() => {
    // all inactive phases mean the hand is complete
    if (gamePhase !== GamePhase.ACTIVE) {
      setHandState(HandState.COMPLETE);
      return;
    }

    switch (handState) {
      case HandState.CLEARING:
        clearCards();
        break;
      case HandState.DEALING:
        dealCards();
        break;
      case HandState.HITTING:
        hit();
        break;
      case HandState.WAITING_ON_PLAYER:
        updateGamePhase();
        break;
      default:
        break;
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

  const updateGamePhase = useCallback(
    (input?: EvaluateGamePhaseProps) => {
      const newState = evaluator.evaluate(input ?? { playerCards, houseCards });
      if (newState === gamePhase) return;
      setGamePhase(newState);
    },
    [evaluator, gamePhase, playerCards, houseCards]
  );

  const startGame = useCallback(async () => {
    if (gamePhase === GamePhase.INITIAL) {
      await deckProvider.openDeck();
      setGamePhase(GamePhase.ACTIVE);
      setHandState(HandState.DEALING);
      return;
    }

    setGamePhase(GamePhase.ACTIVE);
    // there are already cards in hand, we need to clear them
    setHandState(HandState.CLEARING);
  }, [deckProvider, gamePhase]);

  const dealCards = useCallback(async () => {
    const drawnCards = await deckProvider.drawCards(4);
    const newPlayerCards = drawnCards.slice(0, 2);
    const newHouseCards = drawnCards.slice(2, 4);
    setPlayerCards(newPlayerCards);
    setHouseCards(newHouseCards);
  }, [deckProvider]);

  const stand = useCallback(() => {
    updateGamePhase({
      playerCards,
      houseCards,
      playerStands: true,
    });
  }, [updateGamePhase, playerCards, houseCards]);

  const clearCards = useCallback(() => {
    const discardedCards = [...playerCards, ...houseCards];
    deckProvider.discardCards(discardedCards);
    setPlayerCards([]);
    setHouseCards([]);
  }, [playerCards, houseCards, deckProvider]);

  const hit = useCallback(async () => {
    const newCard = await deckProvider.drawCards(1);
    setPlayerCards((prev) => [...prev, newCard[0]]);
  }, [deckProvider, setPlayerCards]);

  const value = useMemo(
    () => ({
      discardPile: deckProvider.discardPile,
      gamePhase,
      handState,
      hit,
      houseCards,
      lossConditions,
      playerCards,
      setHandState,
      stand,
      startGame,
      winConditions,
    }),
    [
      deckProvider.discardPile,
      gamePhase,
      handState,
      hit,
      houseCards,
      lossConditions,
      playerCards,
      stand,
      startGame,
      winConditions,
    ]
  );

  return (
    <BlackjackGameContext.Provider value={value}>
      {children}
    </BlackjackGameContext.Provider>
  );
};
