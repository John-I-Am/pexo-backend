"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { SECRET, PORT, OXFORD_APP_ID, OXFORD_APP_KEY, } = process.env;
const DATABASE_URL = (process.env.NODE_ENV === ("test") || process.env.NODE_ENV === ("development"))
    ? process.env.DATABASE_URL_TEST
    : process.env.DATABASE_URL;
exports.default = {
    PORT, DATABASE_URL, SECRET, OXFORD_APP_ID, OXFORD_APP_KEY,
};
