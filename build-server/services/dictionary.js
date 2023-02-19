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
const config_1 = __importDefault(require("../utils/config"));
const define = (word) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/${word}?fields=definitions%2Cexamples%2Cpronunciations&strictMatch=false`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            app_id: config_1.default.OXFORD_APP_ID,
            app_key: config_1.default.OXFORD_APP_KEY,
        },
    });
    return response.json();
});
const define2 = (word) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://od-api.oxforddictionaries.com/api/v2/sentences/en/${word}?strictMatch=false
  `, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            app_id: config_1.default.OXFORD_APP_ID,
            app_key: config_1.default.OXFORD_APP_KEY,
        },
    });
    return response.json();
});
exports.default = { define, define2 };
