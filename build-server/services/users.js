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
const user_1 = __importDefault(require("../models/user"));
const deck_1 = __importDefault(require("../models/deck"));
const createUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, surname, password, } = newUser;
    const passwordHash = yield bcrypt_1.default.hash(password, 10);
    const savedUser = yield user_1.default.create({
        email,
        name,
        surname,
        passwordHash,
    });
    const userNoHash = user_1.default.findByPk(savedUser.id, {
        attributes: { exclude: ["passwordHash"] },
    });
    return userNoHash;
});
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findByPk(userId, {
        attributes: { exclude: ["passwordHash"] },
    });
    return user;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return user_1.default.findAll({
        include: [{
                model: deck_1.default,
            }],
    });
});
const updateUser = (updatedUser, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, surname, currentPassword, newPassword, } = updatedUser;
    const userToUpdate = yield user_1.default.findByPk(userId);
    if (userToUpdate) {
        userToUpdate.set(Object.assign(Object.assign({}, userToUpdate), { name: name || userToUpdate.name, surname: surname || userToUpdate.surname }));
        if (newPassword) {
            const newPasswordHash = yield bcrypt_1.default.hash(newPassword, 10);
            const passwordCorrect = yield bcrypt_1.default.compare(currentPassword, userToUpdate.passwordHash);
            if (!(passwordCorrect)) {
                return null;
            }
            userToUpdate.passwordHash = newPasswordHash;
        }
        if (email) {
            const emailTaken = yield user_1.default.findOne({
                where: {
                    email,
                },
            });
            if (!emailTaken) {
                userToUpdate.email = email;
            }
        }
    }
    else {
        return null;
    }
    yield userToUpdate.save();
    const userNoHash = yield user_1.default.findByPk(userToUpdate.id, {
        attributes: { exclude: ["passwordHash"] },
    });
    return userNoHash;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userToDelete = yield user_1.default.findByPk(userId);
    if (userToDelete) {
        yield userToDelete.destroy();
    }
    return userToDelete;
});
exports.default = {
    createUser, getAllUsers, getUser, updateUser, deleteUser,
};
