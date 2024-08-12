import { useUpdateEffect } from 'ahooks';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

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
        updateGamePhase({
          playerCards: playerCardsRef.current,
          houseCards: houseCardsRef.current,
        });
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
    (input: GamePhaseProps) => {
      const newState = evaluator.evaluate(input);
      if (newState === gamePhase) return;
      setGamePhase(newState);
    },
    [evaluator, gamePhase]
  );

  const startGame = useCallback(async () => {
    addAction('Starting a new game');
    // TODO: try moving gamephase set up here
    setGamePhase(GamePhase.ACTIVE);
    if (gamePhase === GamePhase.INITIAL) {
      addAction('Opening a brand new deck');
      await deckProvider.openDeck();
      setHandState(HandState.DEALING);
      return;
    }

    // there are already cards in hand, we need to clear them
    setHandState(HandState.CLEARING);
  }, [addAction, deckProvider, gamePhase]);

  const dealCards = async () => {
    addAction('Dealing cards');
    const drawnCards = await deckProvider.drawCards(4);
    const newPlayerCards = drawnCards.slice(0, 2);
    const newHouseCards = drawnCards.slice(2, 4);
    playerCardsRef.current = newPlayerCards;
    houseCardsRef.current = newHouseCards;
  };

  const stand = useCallback(() => {
    addAction('Player stands');
    updateGamePhase({
      playerCards: playerCardsRef.current,
      houseCards: houseCardsRef.current,
      playerStands: true,
    });
  }, [addAction, updateGamePhase]);

  const clearCards = () => {
    console.log('Clearing cards');
    const discardedCards = [
      ...playerCardsRef.current,
      ...houseCardsRef.current,
    ];
    deckProvider.discardCards(discardedCards);
    playerCardsRef.current = [];
    houseCardsRef.current = [];
  };

  const hit = useCallback(async () => {
    addAction('Player hits');
    const newCard = await deckProvider.drawCards(1);
    addAction(`Drew a card: ${newCard[0].code}`);
    const newPlayerCards = [...playerCardsRef.current, newCard[0]];
    playerCardsRef.current = newPlayerCards;
  }, [addAction, deckProvider]);

  const value = useMemo(
    () => ({
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
    }),
    [
      deckProvider.discardPile,
      gamePhase,
      handState,
      hit,
      lossConditions,
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
