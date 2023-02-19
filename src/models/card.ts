import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey,
} from "sequelize";
import db from "../utils/db";

const { sequelize } = db;

// eslint-disable-next-line no-use-before-define
class Card extends Model<InferAttributes<Card>, InferCreationAttributes<Card>> {
  declare id: CreationOptional<number>;

  declare userId: ForeignKey<number>;

  declare deckId: ForeignKey<number>;

  declare tags: CreationOptional<Array<string>>;

  declare type: string;

  declare front: string;

  declare back: string;

  declare audio: CreationOptional<string>;

  declare examples: CreationOptional<Array<string>>;

  declare level: number;

  declare checkpointDate: Date;
}

Card.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  front: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  back: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  audio: {
    type: DataTypes.STRING,
  },
  examples: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  },
  checkpointDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: "card",
  defaultScope: {
    attributes: {
      exclude: ["userId"],
    },
  },
});

export default Card;
