"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../utils/db"));
const { sequelize } = db_1.default;
// eslint-disable-next-line no-use-before-define
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    admin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    disabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    passwordHash: {
        type: sequelize_1.DataTypes.STRING,
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
exports.default = User;
