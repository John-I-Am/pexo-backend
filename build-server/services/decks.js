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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = __importDefault(require("../models/card"));
const deck_1 = __importDefault(require("../models/deck"));
const createDeck = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const newDeck = yield deck_1.default.create({ userId });
    return newDeck;
});
const getAllDecks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const decks = yield deck_1.default.findAll({
        where: { userId },
        include: {
            model: card_1.default,
        },
    });
    return decks;
});
const updateDeck = (updatedTitle, deckId) => __awaiter(void 0, void 0, void 0, function* () {
    const deck = yield deck_1.default.findByPk(deckId);
    if (deck) {
        deck.title = updatedTitle;
        yield deck.save();
    }
    return deck;
});
const deleteDeck = (deckId) => __awaiter(void 0, void 0, void 0, function* () {
    const deck = yield deck_1.default.findByPk(deckId);
    if (deck) {
        yield deck.destroy();
    }
    return deck;
});
exports.default = {
    createDeck,
    getAllDecks,
    updateDeck,
    deleteDeck,
};
