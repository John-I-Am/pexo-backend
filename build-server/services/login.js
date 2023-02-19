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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const authUser = (userToAuth) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({
        where: { email: userToAuth.email },
        attributes: {
            include: ["passwordHash"],
        },
    });
    const passwordCorrect = user === null
        ? false
        : yield bcrypt_1.default.compare(userToAuth.password, user.passwordHash);
    if (!(user && passwordCorrect)) {
        return false;
    }
    if (user.disabled) {
        return false;
    }
    const userToken = {
        userId: user.id,
    };
    const token = jsonwebtoken_1.default.sign(userToken, process.env.SECRET, { expiresIn: "6h" });
    return {
        token,
        userId: user.id,
    };
});
exports.default = { authUser };
