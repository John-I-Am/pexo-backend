/* eslint-disable import/no-extraneous-dependencies */
import supertest from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import helper from "./test_helper";
import User from "../models/user";
import Deck from "../models/deck";
import Card from "../models/card";

import app from "../app";
import {
  NewCard, NewUser, UserCredential,
} from "../types";
import db from "../utils/db";

const api = supertest(app);

describe("what happens when there is initally one user", () => {
  let createdUser: any;
  beforeEach(async () => {
    await db.sequelize.sync({ force: true });

    const passwordHash: string = await bcrypt.hash("root", 10);
    createdUser = await User.create({
      name: "rootname",
      surname: "rootsurname",
      passwordHash,
      email: "root@root.com",
    });
  }, 10000);

  test("if user can be created with unique email", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser: NewUser = {
      name: "rootname2",
      surname: "rootsurname2",
      password: "root",
      email: "root2@root.com",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const emails = usersAtEnd.map((users: any) => users.email);
    expect(emails).toContain(newUser.email);
  });

  test("if user creation fails with non unique email", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser: NewUser = {
      name: "rootname3",
      surname: "rootsurname3",
      password: "root",
      email: "root@root.com",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("email must be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("if user can login and if token is returned", async () => {
    const userCredentials: UserCredential = {
      email: "root@root.com",
      password: "root",
    };

    const result = await api
      .post("/api/login")
      .send(userCredentials)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(result.body).toHaveProperty("token");

    const userToken: any = jwt.verify(result.body.token, process.env.SECRET as string);

    const user: User | null = await User.findByPk(userToken.userId);

    if (user) {
      expect(user.email).toEqual(userCredentials.email);
    }
  });

  describe("what happens after user is logged in", () => {
    let token: any;
    let userId: any;
    const userCredentials: UserCredential = {
      email: "root@root.com",
      password: "root",
    };

    beforeEach(async () => {
      const response = await api
        .post("/api/login")
        .send(userCredentials);

      token = response.body.token;
      userId = response.body.userId;
    });

    test("if user profile can be fetched", async () => {
      const response = await api
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
    });

    test("if user details can be changed", async () => {
      const usersAtStart = await helper.usersInDb();

      const updatedUserInfo = {
        name: "newName",
        surname: "nameSurname",
        email: "newemail@root.com",
        newPassword: "rootchanged",
        currentPassword: "root",
      };

      const response = await api
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

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);

      await api
        .post("/api/login")
        .send(userCredentials)
        .expect(401);

      await api
        .post("/api/login")
        .send({
          email: updatedUserInfo.email,
          password: updatedUserInfo.newPassword,
        })
        .expect(200);
    });

    test("User can be deleted", async () => {
      const usersAtStart = await helper.usersInDb();

      await api
        .delete(`/api/users/${userId}`)
        .set("Authorization", `bearer ${token}`)
        .expect(204);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(
        usersAtStart.length - 1,
      );
    });

    describe("Where there is initially one deck with one card", () => {
      beforeEach(async () => {
        await Deck.sync({ force: true });
        await Card.sync({ force: true });

        const response = await api
          .post("/api/decks")
          .set("Authorization", `bearer ${token}`);

        const newCard: any = {
          type: "classic",
          tags: ["tag1"],
          deckId: +(response.body.id),
          front: "front of card",
          back: "back of card",
          audio: "audioURL",
          examples: ["blahblah"],
        };

        await api
          .post("/api/cards")
          .set("Authorization", `bearer ${token}`)
          .send(newCard);
      });

      test("New deck can be created", async () => {
        const decksAtStart = await helper.decksInDb();

        const response = await api
          .post("/api/decks")
          .set("Authorization", `bearer ${token}`)
          .expect(200);

        const decksAtEnd = await helper.decksInDb();
        expect(decksAtEnd).toHaveLength(decksAtStart.length + 1);

        const deckIds = decksAtEnd.map((deck) => deck.id);
        expect(deckIds).toContain(response.body.id);
      });

      test("All decks can be returned", async () => {
        const decksAtStart = await helper.decksInDb();

        const response = await api
          .get("/api/decks")
          .set("Authorization", `bearer ${token}`);

        expect(response.body).toHaveLength(decksAtStart.length);
      });

      test("Deck title can be edited", async () => {
        const decksAtStart = await helper.decksInDb();
        const deckToEdit = decksAtStart[0];

        await api
          .put(`/api/decks/${deckToEdit.id}`)
          .set("Authorization", `bearer ${token}`)
          .send({ title: "new Title" })
          .expect(200);

        const decksAtEnd = await helper.decksInDb();
        const deckTitlesAtEnd = decksAtEnd.map((deck) => deck.title);
        expect(deckTitlesAtEnd).toContain("new Title");
      });

      test("Deck can be deleted", async () => {
        const decksAtStart = await helper.decksInDb();
        const deckToDelete = decksAtStart[0];

        await api
          .delete(`/api/decks/${deckToDelete.id}`)
          .set("Authorization", `bearer ${token}`)
          .expect(204);

        const decksAtEnd = await helper.decksInDb();
        expect(decksAtEnd).toHaveLength(
          decksAtStart.length - 1,
        );

        const ids = decksAtEnd.map((deck: any) => deck.id);
        expect(ids).not.toContain(deckToDelete.id);
      });

      test("Card can be created", async () => {
        const decksAtStart = await helper.decksInDb();
        const cardsAtStart = await helper.cardsInDb();

        const newCard: NewCard = {
          type: "classic",
          tags: ["fun"],
          deckId: decksAtStart[0].id,
          front: "this is front of card",
          back: "this is back of card",
          audio: "km",
          examples: ["example"],
        };

        await api
          .post("/api/cards")
          .set("Authorization", `bearer ${token}`)
          .send(newCard)
          .expect(200);

        const cardsAtEnd = await helper.cardsInDb();
        expect(cardsAtEnd).toHaveLength(cardsAtStart.length + 1);

        const contents = cardsAtEnd.map((card: any) => card.front);
        expect(contents).toContainEqual("this is front of card");
      });

      // test("All cards can be returned", async () => {
      //   const cardsAtStart = await helper.cardsInDb();

      //   const response = await api
      //     .get("/api/cards")
      //     .set("Authorization", `bearer ${token}`);

      //   expect(response.body).toHaveLength(cardsAtStart.length);
      // });

      test("Specific card can be returned", async () => {
        const cardsAtStart = await helper.cardsInDb();
        const response = await api
          .get(`/api/cards/${cardsAtStart[0].id}`)
          .set("Authorization", `bearer ${token}`)
          .expect(200);

        expect(JSON.parse(JSON.stringify(cardsAtStart[0]))).toEqual(response.body);
      });

      test("Card can be updated", async () => {
        const cardsAtStart = await helper.cardsInDb();
        const newCard = {
          front: "updated front",
        };

        await api
          .put(`/api/cards/${cardsAtStart[0].id}`)
          .set("Authorization", `bearer ${token}`)
          .send(newCard)
          .expect(200);
      });

      test("card can be deleted", async () => {
        const cardsAtStart = await helper.cardsInDb();
        const cardToDelete = cardsAtStart[0];

        await api
          .delete(`/api/cards/${cardToDelete.id}`)
          .set("Authorization", `bearer ${token}`)
          .expect(204);

        const cardsAtEnd = await helper.cardsInDb();
        expect(cardsAtEnd).toHaveLength(
          cardsAtStart.length - 1,
        );

        const contents = cardsAtEnd.map((r: any) => r.content);
        expect(contents).not.toContain(cardToDelete);
      });
    });
  });

  afterAll(() => {
    db.sequelize.close();
  });
});
