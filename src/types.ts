export interface DecodedToken {
  userId: number,
}

declare module "express-serve-static-core" {
  // eslint-disable-next-line no-unused-vars
  interface Request {
    decodedToken: DecodedToken
  }
}

export interface NewUser {
  email: string,
  name: string,
  surname: string,
  password: string,
}

export interface UpdatedUser {
  email: string | undefined,
  name: string | undefined,
  surname: string | undefined,
  currentPassword: string | undefined,
  newPassword: string | undefined
}

export interface UserCredential {
  email: string,
  password: string,
}

export type CardType = "classic" | "cloze"

export interface NewCard {
  type: CardType,
  tags: Array<string> | undefined,
  deckId: number,
  front: string,
  back: string,
  audio: string | undefined
  examples: Array<string> | undefined,
}

export interface UpdatedCard {
  type: CardType | undefined,
  tags: Array<string> | undefined,
  deckId: number | undefined,
  front: string | undefined,
  back: string | undefined,
  level: number | undefined,
  audio: string| undefined,
  examples: Array<string> | undefined,
}

export interface UpdatedDeck {
  title: string,
}
