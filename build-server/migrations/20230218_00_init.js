"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const sequelize_1 = require("sequelize");
module.exports = {
    up: ({ context: queryInterface }) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.createTable("decks", {
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
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        });
        yield queryInterface.createTable("cards", {
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
            checkpoint_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        });
        yield queryInterface.createTable("users", {
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
            password_hash: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        });
        yield queryInterface.addColumn("cards", "user_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
        });
        yield queryInterface.addColumn("cards", "deck_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: { model: "decks", key: "id" },
        });
        yield queryInterface.addColumn("decks", "user_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
        });
    }),
    down: ({ context: queryInterface }) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.dropTable("cards");
        yield queryInterface.dropTable("decks");
        yield queryInterface.dropTable("users");
    }),
};
