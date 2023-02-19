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
const login_1 = __importDefault(require("../services/login"));
const typeguards_1 = __importDefault(require("../typeguards"));
const loginRouter = express_1.default.Router();
loginRouter.post("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userCredential = typeguards_1.default.toUserCredential(request.body);
    const result = yield login_1.default.authUser(userCredential);
    if (result) {
        response.status(200).send(result);
    }
    else {
        response.status(401).json({ error: "invalid credentials" });
    }
}));
exports.default = loginRouter;
