import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional,
} from "sequelize";
import db from "../utils/db";

const { sequelize } = db;

// eslint-disable-next-line no-use-before-define
class User extends Model <InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;

  declare admin: CreationOptional<boolean>;

  declare disabled: CreationOptional<boolean>;

  declare email: string;

  declare name: string;

  declare surname: string;

  declare passwordHash: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: "user",
  // defaultScope: {
  //   attributes: {
  //     exclude: ["passwordHash"],
  //   },
  // },
});

export default User;
