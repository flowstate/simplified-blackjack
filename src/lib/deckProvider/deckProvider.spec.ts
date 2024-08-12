import { createLocalDeckProvider } from './deckProvider';

describe('DeckProvider', () => {
  it('should shuffle the initial deck', async () => {
    const deckProvider = createLocalDeckProvider();
    const deckProvider2 = createLocalDeckProvider();
    await deckProvider.openDeck();
    await deckProvider2.openDeck();
    const firstDeck = await deckProvider.drawCards(52);
    const secondDeck = await deckProvider2.drawCards(52);

    expect(firstDeck[0].code).not.toEqual(secondDeck[0].code);
  });

  it('should shuffle the discard pile when the deck is empty', async () => {
    const deckProvider = createLocalDeckProvider();
    await deckProvider.openDeck();
    const initialDraw = await deckProvider.drawCards(52);
    expect(initialDraw.length).toEqual(52);

    const cardsToDiscard = initialDraw.slice(0, 4);
    const cardsToDiscardCodes = cardsToDiscard.map((card) => card.code);
    await deckProvider.discardCards(cardsToDiscard);
    const newDrawCodes = await deckProvider.drawCards(4);

    expect(newDrawCodes.map((card) => card.code)).toEqual(
      expect.arrayContaining(cardsToDiscardCodes)
    );
  });
});
