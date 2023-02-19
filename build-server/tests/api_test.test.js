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
/* eslint-disable import/no-extraneous-dependencies */
const supertest_1 = __importDefault(require("supertest"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const test_helper_1 = __importDefault(require("./test_helper"));
const user_1 = __importDefault(require("../models/user"));
const deck_1 = __importDefault(require("../models/deck"));
const card_1 = __importDefault(require("../models/card"));
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../utils/db"));
const api = (0, supertest_1.default)(app_1.default);
describe("what happens when there is initally one user", () => {
    let createdUser;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.sequelize.sync({ force: true });
        const passwordHash = yield bcrypt_1.default.hash("root", 10);
        createdUser = yield user_1.default.create({
            name: "rootname",
            surname: "rootsurname",
            passwordHash,
            email: "root@root.com",
        });
    }), 10000);
    test("if user can be created with unique email", () => __awaiter(void 0, void 0, void 0, function* () {
        const usersAtStart = yield test_helper_1.default.usersInDb();
        const newUser = {
            name: "rootname2",
            surname: "rootsurname2",
            password: "root",
            email: "root2@root.com",
        };
        yield api
            .post("/api/users")
            .send(newUser)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        const usersAtEnd = yield test_helper_1.default.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
        const emails = usersAtEnd.map((users) => users.email);
        expect(emails).toContain(newUser.email);
    }));
    test("if user creation fails with non unique email", () => __awaiter(void 0, void 0, void 0, function* () {
        const usersAtStart = yield test_helper_1.default.usersInDb();
        const newUser = {
            name: "rootname3",
            surname: "rootsurname3",
            password: "root",
            email: "root@root.com",
        };
        const result = yield api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body.error).toContain("email must be unique");
        const usersAtEnd = yield test_helper_1.default.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    }));
    test("if user can login and if token is returned", () => __awaiter(void 0, void 0, void 0, function* () {
        const userCredentials = {
            email: "root@root.com",
            password: "root",
        };
        const result = yield api
            .post("/api/login")
            .send(userCredentials)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(result.body).toHaveProperty("token");
        const userToken = jsonwebtoken_1.default.verify(result.body.token, process.env.SECRET);
        const user = yield user_1.default.findByPk(userToken.userId);
        if (user) {
            expect(user.email).toEqual(userCredentials.email);
        }
    }));
    describe("what happens after user is logged in", () => {
        let token;
        let userId;
        const userCredentials = {
            email: "root@root.com",
            password: "root",
        };
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api
                .post("/api/login")
                .send(userCredentials);
            token = response.body.token;
            userId = response.body.userId;
        }));
        test("if user profile can be fetched", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api
                .get(`/api/users/${userId}`)
                .set("Authorization", `bearer ${token}`)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(response.body).toEqual({
                id: userId,
                admin: false,
                disabled: false,
                name: "rootname",
                surname: "rootsurname",
                email: "root@root.com",
                createdAt: createdUser.createdAt.toJSON(),
                updatedAt: (createdUser.updatedAt).toJSON(),
            });
        }));
        test("if user details can be changed", () => __awaiter(void 0, void 0, void 0, function* () {
            const usersAtStart = yield test_helper_1.default.usersInDb();
            const updatedUserInfo = {
                name: "newName",
                surname: "nameSurname",
                email: "newemail@root.com",
                newPassword: "rootchanged",
                currentPassword: "root",
            };
            const response = yield api
                .put(`/api/users/${userId}`)
                .send(updatedUserInfo)
                .set("Authorization", `bearer ${token}`)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            expect(response.body).toEqual({
                id: userId,
                admin: false,
                disabled: false,
                name: "newName",
                surname: "nameSurname",
                email: "newemail@root.com",
                createdAt: createdUser.createdAt.toJSON(),
                updatedAt: (response.body.updatedAt),
            });
            const usersAtEnd = yield test_helper_1.default.usersInDb();
            expect(usersAtEnd).toHaveLength(usersAtStart.length);
            yield api
                .post("/api/login")
                .send(userCredentials)
                .expect(401);
            yield api
                .post("/api/login")
                .send({
                email: updatedUserInfo.email,
                password: updatedUserInfo.newPassword,
            })
                .expect(200);
        }));
        test("User can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
            const usersAtStart = yield test_helper_1.default.usersInDb();
            yield api
                .delete(`/api/users/${userId}`)
                .set("Authorization", `bearer ${token}`)
                .expect(204);
            const usersAtEnd = yield test_helper_1.default.usersInDb();
            expect(usersAtEnd).toHaveLength(usersAtStart.length - 1);
        }));
        describe("Where there is initially one deck with one card", () => {
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                yield deck_1.default.sync({ force: true });
                yield card_1.default.sync({ force: true });
                const response = yield api
                    .post("/api/decks")
                    .set("Authorization", `bearer ${token}`);
                const newCard = {
                    type: "classic",
                    tags: ["tag1"],
                    deckId: +(response.body.id),
                    front: "front of card",
                    back: "back of card",
                    audio: "audioURL",
                    examples: ["blahblah"],
                };
                yield api
                    .post("/api/cards")
                    .set("Authorization", `bearer ${token}`)
                    .send(newCard);
            }));
            test("New deck can be created", () => __awaiter(void 0, void 0, void 0, function* () {
                const decksAtStart = yield test_helper_1.default.decksInDb();
                const response = yield api
                    .post("/api/decks")
                    .set("Authorization", `bearer ${token}`)
                    .expect(200);
                const decksAtEnd = yield test_helper_1.default.decksInDb();
                expect(decksAtEnd).toHaveLength(decksAtStart.length + 1);
                const deckIds = decksAtEnd.map((deck) => deck.id);
                expect(deckIds).toContain(response.body.id);
            }));
            test("All decks can be returned", () => __awaiter(void 0, void 0, void 0, function* () {
                const decksAtStart = yield test_helper_1.default.decksInDb();
                const response = yield api
                    .get("/api/decks")
                    .set("Authorization", `bearer ${token}`);
                expect(response.body).toHaveLength(decksAtStart.length);
            }));
            test("Deck title can be edited", () => __awaiter(void 0, void 0, void 0, function* () {
                const decksAtStart = yield test_helper_1.default.decksInDb();
                const deckToEdit = decksAtStart[0];
                yield api
                    .put(`/api/decks/${deckToEdit.id}`)
                    .set("Authorization", `bearer ${token}`)
                    .send({ title: "new Title" })
                    .expect(200);
                const decksAtEnd = yield test_helper_1.default.decksInDb();
                const deckTitlesAtEnd = decksAtEnd.map((deck) => deck.title);
                expect(deckTitlesAtEnd).toContain("new Title");
            }));
            test("Deck can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
                const decksAtStart = yield test_helper_1.default.decksInDb();
                const deckToDelete = decksAtStart[0];
                yield api
                    .delete(`/api/decks/${deckToDelete.id}`)
                    .set("Authorization", `bearer ${token}`)
                    .expect(204);
                const decksAtEnd = yield test_helper_1.default.decksInDb();
                expect(decksAtEnd).toHaveLength(decksAtStart.length - 1);
                const ids = decksAtEnd.map((deck) => deck.id);
                expect(ids).not.toContain(deckToDelete.id);
            }));
            test("Card can be created", () => __awaiter(void 0, void 0, void 0, function* () {
                const decksAtStart = yield test_helper_1.default.decksInDb();
                const cardsAtStart = yield test_helper_1.default.cardsInDb();
                const newCard = {
                    type: "classic",
                    tags: ["fun"],
                    deckId: decksAtStart[0].id,
                    front: "this is front of card",
                    back: "this is back of card",
                    audio: "km",
                    examples: ["example"],
                };
                yield api
                    .post("/api/cards")
                    .set("Authorization", `bearer ${token}`)
                    .send(newCard)
                    .expect(200);
                const cardsAtEnd = yield test_helper_1.default.cardsInDb();
                expect(cardsAtEnd).toHaveLength(cardsAtStart.length + 1);
                const contents = cardsAtEnd.map((card) => card.front);
                expect(contents).toContainEqual("this is front of card");
            }));
            // test("All cards can be returned", async () => {
            //   const cardsAtStart = await helper.cardsInDb();
            //   const response = await api
            //     .get("/api/cards")
            //     .set("Authorization", `bearer ${token}`);
            //   expect(response.body).toHaveLength(cardsAtStart.length);
            // });
            test("Specific card can be returned", () => __awaiter(void 0, void 0, void 0, function* () {
                const cardsAtStart = yield test_helper_1.default.cardsInDb();
                const response = yield api
                    .get(`/api/cards/${cardsAtStart[0].id}`)
                    .set("Authorization", `bearer ${token}`)
                    .expect(200);
                expect(JSON.parse(JSON.stringify(cardsAtStart[0]))).toEqual(response.body);
            }));
            test("Card can be updated", () => __awaiter(void 0, void 0, void 0, function* () {
                const cardsAtStart = yield test_helper_1.default.cardsInDb();
                const newCard = {
                    front: "updated front",
                };
                yield api
                    .put(`/api/cards/${cardsAtStart[0].id}`)
                    .set("Authorization", `bearer ${token}`)
                    .send(newCard)
                    .expect(200);
            }));
            test("card can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
                const cardsAtStart = yield test_helper_1.default.cardsInDb();
                const cardToDelete = cardsAtStart[0];
                yield api
                    .delete(`/api/cards/${cardToDelete.id}`)
                    .set("Authorization", `bearer ${token}`)
                    .expect(204);
                const cardsAtEnd = yield test_helper_1.default.cardsInDb();
                expect(cardsAtEnd).toHaveLength(cardsAtStart.length - 1);
                const contents = cardsAtEnd.map((r) => r.content);
                expect(contents).not.toContain(cardToDelete);
            }));
        });
    });
    afterAll(() => {
        db_1.default.sequelize.close();
    });
});
