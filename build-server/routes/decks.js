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
const decks_1 = __importDefault(require("../services/decks"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const decksRouter = express_1.default.Router();
decksRouter.post("/", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newDeck = yield decks_1.default.createDeck(request.decodedToken.userId);
    response.json(newDeck);
}));
decksRouter.get("/", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const decks = yield decks_1.default.getAllDecks(request.decodedToken.userId);
    response.json(decks);
}));
decksRouter.put("/:id", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedDeck = yield decks_1.default.updateDeck(request.body.title, +request.params.id);
    if (updatedDeck) {
        response.json(updatedDeck);
    }
    else {
        response.status(404).json({ error: "deck not found" });
    }
}));
decksRouter.delete("/:id", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedDeck = yield decks_1.default.deleteDeck(+request.params.id);
    if (deletedDeck) {
        response.status(204).end();
    }
    response.status(404).end();
}));
exports.default = decksRouter;
