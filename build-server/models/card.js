"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../utils/db"));
const { sequelize } = db_1.default;
// eslint-disable-next-line no-use-before-define
class Card extends sequelize_1.Model {
}
Card.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tags: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    front: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    back: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    audio: {
        type: sequelize_1.DataTypes.STRING,
    },
    examples: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    },
    level: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 5,
        },
    },
    checkpointDate: {
        type: sequelize_1.DataTypes.DATE,
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
exports.default = Card;
