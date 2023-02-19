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
const express_1 = __importDefault(require("express"));
const cards_1 = __importDefault(require("../services/cards"));
const typeguards_1 = __importDefault(require("../typeguards"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const cardsRouter = express_1.default.Router();
cardsRouter.post("/", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newCard = typeguards_1.default.toNewCard(request.body);
    const savedCard = yield cards_1.default.createCard(request.body.deckId, newCard);
    if (savedCard) {
        response.json(savedCard);
    }
    else {
        response.status(404).json({ error: "Deck does not exist" });
    }
}));
cardsRouter.get("/", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const cards = yield cards_1.default.getAllCards(request.decodedToken.userId);
    response.json(cards);
}));
cardsRouter.get("/:id", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const card = yield cards_1.default.getCard(request.params.id);
    response.json(card);
}));
cardsRouter.put("/:id", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedCard = typeguards_1.default.toUpdatedCard(request.body);
    const result = yield cards_1.default.updateCard(updatedCard, +request.params.id);
    response.json(result);
}));
cardsRouter.delete("/:id", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCard = yield cards_1.default.deleteCard(+request.params.id);
    if (deletedCard) {
        response.status(204).end();
    }
    response.status(404).end();
}));
exports.default = cardsRouter;
