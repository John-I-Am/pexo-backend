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
const user_1 = __importDefault(require("../models/user"));
const middleware_1 = __importDefault(require("../utils/middleware"));
// eslint-disable-next-line consistent-return
const isAdmin = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findByPk(request.decodedToken.userId);
    if (user && !user.admin) {
        return response.status(401).json({ error: "operation not allowed" });
    }
    next();
});
const adminRouter = express_1.default.Router();
adminRouter.put("/:id", middleware_1.default.tokenExtractor, isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({
        where: {
            id: +(req.params.id),
        },
    });
    if (user) {
        user.disabled = req.body.disable;
        yield user.save();
        res.json(user);
    }
    else {
        res.status(400).end();
    }
}));
