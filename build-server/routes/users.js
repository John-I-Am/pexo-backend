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
const typeguards_1 = __importDefault(require("../typeguards"));
const users_1 = __importDefault(require("../services/users"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const usersRouter = express_1.default.Router();
usersRouter.post("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = typeguards_1.default.toNewUser(request.body);
    const user = yield users_1.default.createUser(newUser);
    response.json(user);
}));
usersRouter.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield users_1.default.getAllUsers();
    response.json(users);
}));
usersRouter.get("/:id", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.getUser(request.params.id);
    if (user) {
        response.json(user);
    }
    else {
        response.status(404).end();
    }
}));
usersRouter.put("/:id", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = typeguards_1.default.toUpdatedUser(request.body);
    const user = yield users_1.default.updateUser(updatedUser, +request.params.id);
    if (user) {
        response.json(user);
    }
    response.status(401).json({ error: "invalid credentials" });
}));
usersRouter.delete("/:id", middleware_1.default.tokenExtractor, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield users_1.default.deleteUser(request.params.id);
    if (deletedUser) {
        response.status(204).end();
    }
    response.status(404).json({ error: "user not found" });
}));
exports.default = usersRouter;
