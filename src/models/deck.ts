import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey,
} from "sequelize";
import db from "../utils/db";

const { sequelize } = db;

// eslint-disable-next-line no-use-before-define
class Deck extends Model<InferAttributes<Deck>, InferCreationAttributes<Deck>> {
  declare id: CreationOptional<number>;

  declare userId: ForeignKey<number>;

  declare title: CreationOptional<string>;
}

Deck.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: "untitled",
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: "deck",
  // defaultScope: {
  //   attributes: {
  //     exclude: ["userId"],
  //   },
  // },
});

export default Deck;
