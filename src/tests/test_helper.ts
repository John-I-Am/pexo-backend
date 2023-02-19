import User from "../models/user";
import Deck from "../models/deck";
import Card from "../models/card";

const usersInDb = async () => {
  const users: User[] = await User.findAll({});
  return users.map((user: User) => user.toJSON());
};

const decksInDb = async () => {
  const decks: Deck[] = await Deck.findAll({});
  return decks.map((deck: Deck) => deck.toJSON());
};

const cardsInDb = async () => {
  const cards: Card[] = await Card.findAll({});
  return cards.map((card: Card) => card.toJSON());
};

export default { usersInDb, decksInDb, cardsInDb };
