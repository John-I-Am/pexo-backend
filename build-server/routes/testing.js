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
const card_1 = __importDefault(require("../models/card"));
const user_1 = __importDefault(require("../models/user"));
const deck_1 = __importDefault(require("../models/deck"));
const testingRouter = express_1.default.Router();
testingRouter.post("/reset", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    yield card_1.default.sync({ force: true });
    yield user_1.default.sync({ force: true });
    yield deck_1.default.sync({ force: true });
    response.status(204).end();
}));
exports.default = testingRouter;
