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
const card_1 = __importDefault(require("./card"));
const deck_1 = __importDefault(require("./deck"));
const user_1 = __importDefault(require("./user"));
const joinDb = () => __awaiter(void 0, void 0, void 0, function* () {
    user_1.default.hasMany(deck_1.default);
    user_1.default.hasMany(card_1.default);
    deck_1.default.belongsTo(user_1.default);
    deck_1.default.hasMany(card_1.default);
    card_1.default.belongsTo(deck_1.default);
    card_1.default.belongsTo(user_1.default);
});
exports.default = joinDb;
