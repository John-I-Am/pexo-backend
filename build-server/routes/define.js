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
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
const express_1 = __importDefault(require("express"));
const dictionary_1 = __importDefault(require("../services/dictionary"));
const defineRouter = express_1.default.Router();
defineRouter.get("/:word", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dictionary_1.default.define(request.params.word);
    const resultToProcess = result.results[0].lexicalEntries[0].entries[0];
    const pronunciation = resultToProcess.pronunciations[0].audioFile;
    const definition = resultToProcess.senses[0].definitions[0];
    const examples = [];
    const result2 = yield dictionary_1.default.define2(request.params.word);
    const resultToProcess2 = result2.results[0].lexicalEntries[0].sentences;
    resultToProcess2.forEach((entry) => {
        examples.push(entry.text);
    });
    response.json({ pronunciation, definition, examples });
}));
exports.default = defineRouter;
