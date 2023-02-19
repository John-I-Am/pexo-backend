import Card from "./card";
import Deck from "./deck";
import User from "./user";

const joinDb = async () => {
  User.hasMany(Deck);
  User.hasMany(Card);
  Deck.belongsTo(User);
  Deck.hasMany(Card);
  Card.belongsTo(Deck);
  Card.belongsTo(User);
};

export default joinDb;
