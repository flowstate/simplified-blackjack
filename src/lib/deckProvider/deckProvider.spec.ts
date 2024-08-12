import { createLocalDeckProvider } from './deckProvider';

describe('DeckProvider', () => {
  // TODO: fix this, it doesn't test correctly

  it('should shuffle the initial deck', async () => {
    const deckProvider = createLocalDeckProvider();

    const firstDeck = await deckProvider.drawCards(52);
    const secondDeck = await deckProvider.drawCards(52);

    expect(firstDeck).not.toEqual(secondDeck);
  });

  it('should shuffle the discard pile when the deck is empty', async () => {
    const deckProvider = createLocalDeckProvider();
    const initialDraw = await deckProvider.drawCards(52);
    expect(initialDraw.length).toEqual(52);

    const cardsToDiscard = initialDraw.slice(0, 4);
    const cardsToDiscardCodes = cardsToDiscard.map((card) => card.code);
    await deckProvider.discardCards(cardsToDiscard);
    const newDrawCodes = await deckProvider.drawCards(4);

    expect(newDrawCodes).toEqual(expect.arrayContaining(cardsToDiscardCodes));
  });
});
