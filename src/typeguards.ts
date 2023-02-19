/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import {
  CardType,
  NewCard, NewUser, UpdatedCard, UpdatedDeck, UpdatedUser, UserCredential,
} from "./types";

const isString = (text: unknown): text is string => typeof text === "string" || text instanceof String;

const isArray = (array: unknown): array is Array<any> => Array.isArray(array);

const isNumber = (value: unknown): value is number => typeof value === "number";

// const isCardType = (value: any): value is CardType => value in CardType;

const parseTextContent = (content: unknown): string => {
  const error = new Error("Incorrect type or missing text content");
  error.name = "ParseError";
  if ((!content && content !== "") || !isString(content)) {
    throw error;
  }

  return content;
};

const parseArrayContent = (content: any): Array<any> => {
  const error = new Error("Incorrect type or missing array content");
  error.name = "ParseError";
  if (!content || !isArray(content)) {
    throw error;
  }

  return content;
};

const parseNumberContent = (content: unknown): number => {
  const error = new Error("Incorrect type of missing number content");
  error.name = "ParseError";
  if ((!content || !isNumber(content)) && (content !== 0)) {
    throw error;
  }

  return content;
};

const parseCardType = (content: unknown): CardType => {
  const error = new Error("Incorrect type or missing text content");
  error.name = "ParseError";
  if (!content || !isString(content) || (content !== "classic" && content !== "cloze")) {
    throw error;
  }

  return content;
};

const toNewUser = (object: any): NewUser => {
  const newUser: NewUser = {
    email: parseTextContent(object.email),
    name: parseTextContent(object.name),
    surname: parseTextContent(object.surname),
    password: parseTextContent(object.password),
  };

  return newUser;
};

const toUpdatedUser = (object: any): UpdatedUser => {
  const updatedUser: UpdatedUser = {
    email: object.email !== undefined ? parseTextContent(object.email) : undefined,
    name: object.name !== undefined ? parseTextContent(object.name) : undefined,
    surname: object.surname !== undefined ? parseTextContent(object.surname) : undefined,
    currentPassword: object.currentPassword !== undefined ? parseTextContent(object.currentPassword) : undefined,
    newPassword: object.newPassword !== undefined ? parseTextContent(object.newPassword) : undefined,
  };

  return updatedUser;
};

const toUserCredential = (object: any): UserCredential => {
  const userCredential: UserCredential = {
    email: parseTextContent(object.email),
    password: parseTextContent(object.password),
  };

  return userCredential;
};

const toNewCard = (object: any): NewCard => {
  const newCard: NewCard = {
    type: parseCardType(object.type),
    tags: object.tags !== undefined ? parseArrayContent(object.tags) : undefined,
    deckId: parseNumberContent(object.deckId),
    front: parseTextContent(object.front),
    back: parseTextContent(object.back),
    // audio: object.audio !== undefined ? parseTextContent(object.audio) : undefined,
    audio: object.audio ? parseTextContent(object.audio) : undefined,
    examples: object.examples !== undefined ? parseArrayContent(object.examples) : undefined,
  };

  return newCard;
};

const toUpdatedCard = (object: any): UpdatedCard => {
  const updatedCard: UpdatedCard = {
    type: object.type !== undefined ? parseCardType(object.type) : undefined,
    tags: object.tags !== undefined ? parseArrayContent(object.tags) : undefined,
    deckId: object.deckId !== undefined ? parseNumberContent(object.deckId) : undefined,
    front: object.front !== undefined ? parseTextContent(object.front) : undefined,
    back: object.back !== undefined ? parseTextContent(object.back) : undefined,
    level: object.level !== undefined ? parseNumberContent(object.level) : undefined,
    audio: object.audio ? parseTextContent(object.audio) : "",
    examples: object.examples !== undefined ? parseArrayContent(object.examples) : undefined,
  };

  return updatedCard;
};

const toUpdatedDeck = (object: any): UpdatedDeck => {
  const updatedDeck: UpdatedDeck = {
    title: parseTextContent(object.title),
  };

  return updatedDeck;
};

export default {
  toNewUser,
  toUserCredential,
  toUpdatedCard,
  toNewCard,
  toUpdatedUser,
  toUpdatedDeck,
};
