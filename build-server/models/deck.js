"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../utils/db"));
const { sequelize } = db_1.default;
// eslint-disable-next-line no-use-before-define
class Deck extends sequelize_1.Model {
}
Deck.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
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
exports.default = Deck;
