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
const createCard = (deckId, cardToCreate) => __awaiter(void 0, void 0, void 0, function* () {
    const savedDeck = yield deck_1.default.findByPk(deckId);
    if (savedDeck) {
        const savedCard = yield card_1.default.create(Object.assign(Object.assign({}, cardToCreate), { checkpointDate: new Date(), level: 0, deckId: savedDeck.id, userId: savedDeck.userId }));
        return savedCard;
    }
    return null;
});
const getAllCards = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const savedCards = yield card_1.default.findAll({ where: { userId } });
    return savedCards;
});
const getCard = (cardId) => __awaiter(void 0, void 0, void 0, function* () {
    const card = yield card_1.default.findByPk(cardId);
    return card;
});
const updateCard = (updatedCard, cardId) => __awaiter(void 0, void 0, void 0, function* () {
    const cardToUpdate = yield card_1.default.findByPk(cardId);
    const currentCheckpoint = cardToUpdate.checkpointDate.getTime();
    let interval = 0;
    if (updatedCard.level || updatedCard.level === 0) {
        // formula for adding time: min * 60000
        switch (updatedCard.level) {
            case 0:
                // 15 minutes
                interval = (15 * 60000);
                break;
            case 1:
                // 2 hours
                interval = (120 * 60000);
                break;
            case 2:
                // 8 hours
                interval = (480 * 60000);
                break;
            case 3:
                // 1 day
                interval = (1440 * 60000);
                break;
            case 4:
                // 3 days
                interval = (4320 * 60000);
                break;
            case 5:
                // 1 week
                interval = (10080 * 60000);
                break;
            default:
                interval = 0;
                break;
        }
    }
    cardToUpdate.update(Object.assign(Object.assign({}, updatedCard), { checkpointDate: new Date(currentCheckpoint + interval) }));
    yield cardToUpdate.save();
    return cardToUpdate;
});
const deleteCard = (cardId) => __awaiter(void 0, void 0, void 0, function* () {
    const card = yield card_1.default.findByPk(cardId);
    if (card) {
        yield card.destroy();
    }
    return card;
});
exports.default = {
    createCard, getAllCards, getCard, updateCard, deleteCard,
};
