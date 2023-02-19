import Card from "../models/card";
import Deck from "../models/deck";
import { NewCard, UpdatedCard } from "../types";

const createCard = async (deckId: number, cardToCreate: NewCard): Promise<any> => {
  const savedDeck: Deck | null = await Deck.findByPk(deckId);
  if (savedDeck) {
    const savedCard: Card = await Card.create({
      ...cardToCreate,
      checkpointDate: new Date(),
      level: 0,
      deckId: savedDeck.id,
      userId: savedDeck.userId,
    });

    return savedCard;
  }
  return null;
};

const getAllCards = async (userId: number): Promise<Card[]> => {
  const savedCards: Card[] = await Card.findAll({ where: { userId } });
  return savedCards;
};

const getCard = async (cardId: string): Promise<Card | null> => {
  const card: Card | null = await Card.findByPk(cardId);
  return card;
};

const updateCard = async (updatedCard: UpdatedCard, cardId: number)
: Promise<Card | null> => {
  const cardToUpdate: any = await Card.findByPk(cardId);

  const currentCheckpoint: number = cardToUpdate.checkpointDate.getTime();
  let interval = 0;

  if (updatedCard.level || updatedCard.level === 0) {
  // formula for adding time: min * 60000
    switch (updatedCard.level) {
      case 0:
      // 15 minutes
        interval = (15 * 60000);
        break;
      case 1:
      // 2 hours
        interval = (120 * 60000);
        break;
      case 2:
      // 8 hours
        interval = (480 * 60000);
        break;
      case 3:
      // 1 day
        interval = (1440 * 60000);
        break;
      case 4:
      // 3 days
        interval = (4320 * 60000);
        break;
      case 5:
      // 1 week
        interval = (10080 * 60000);
        break;
      default:
        interval = 0;
        break;
    }
  }

  cardToUpdate.update({
    ...updatedCard,
    checkpointDate: new Date(currentCheckpoint + interval),
  });

  await cardToUpdate.save();
  return cardToUpdate;
};

const deleteCard = async (cardId: number): Promise<Card | null> => {
  const card: Card | null = await Card.findByPk(cardId);
  if (card) {
    await card.destroy();
  }

  return card;
};

export default {
  createCard, getAllCards, getCard, updateCard, deleteCard,
};
