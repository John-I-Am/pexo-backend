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
const users_1 = __importDefault(require("../services/users"));
const user_1 = __importDefault(require("../models/user"));
const db_1 = __importDefault(require("../utils/db"));
jest.mock("bcrypt", () => ({
    hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
}));
describe("usersService works", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.sequelize.sync({ force: true });
    }));
    it("should be possible to add user", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            email: "test@test.com",
            name: "Test",
            surname: "User",
            password: "testpassword",
        };
        const mockUser = {
            id: 1,
            email: newUser.email,
            name: newUser.name,
            surname: newUser.surname,
            passwordHash: "hashed_testpassword",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        jest.spyOn(user_1.default, "create").mockResolvedValueOnce(mockUser);
        jest.spyOn(user_1.default, "findByPk").mockResolvedValueOnce(Object.assign(Object.assign({}, mockUser), { passwordHash: undefined }));
        yield users_1.default.createUser(newUser);
        expect(user_1.default.create).toHaveBeenCalledWith({
            email: newUser.email,
            name: newUser.name,
            surname: newUser.surname,
            passwordHash: "hashed_testpassword",
        });
    }));
    it("should throw an error if user is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            email: "test@test.com",
            name: "Test",
            surname: "User",
            password: "testpassword",
        };
        jest.spyOn(user_1.default, "create").mockRejectedValueOnce(new Error("Failed to create user"));
        yield expect(users_1.default.createUser(newUser)).rejects.toThrow("Failed to create user");
    }));
    it("should throw an error if user creation fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            email: "test@test.com",
            name: "Test",
            surname: "User",
            password: "testpassword",
        };
        jest.spyOn(user_1.default, "create").mockRejectedValueOnce(new Error("Failed to create user"));
        yield expect(users_1.default.createUser(newUser)).rejects.toThrow("Failed to create user");
    }));
    afterAll(() => {
        jest.clearAllMocks();
        db_1.default.sequelize.close();
    });
});
