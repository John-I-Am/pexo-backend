import express, { Request, Response } from "express";
import { NewCard, UpdatedCard } from "../types";
import cardsService from "../services/cards";
import typeguards from "../typeguards";
import middleware from "../utils/middleware";
import Card from "../models/card";

const cardsRouter = express.Router();

cardsRouter.post("/", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const newCard: NewCard = typeguards.toNewCard(request.body);
  const savedCard: Card = await cardsService.createCard(
    request.body.deckId,
    newCard,
  );

  if (savedCard) {
    response.json(savedCard);
  } else {
    response.status(404).json({ error: "Deck does not exist" });
  }
});

cardsRouter.get("/", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const cards: Card[] = await cardsService.getAllCards(request.decodedToken.userId);
  response.json(cards);
});

cardsRouter.get("/:id", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const card: Card | null = await cardsService.getCard(request.params.id);

  response.json(card);
});

cardsRouter.put("/:id", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const updatedCard: UpdatedCard = typeguards.toUpdatedCard(request.body);
  const result: Card | null = await cardsService.updateCard(updatedCard, +request.params.id);

  response.json(result);
});

cardsRouter.delete("/:id", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const deletedCard: Card | null = await cardsService.deleteCard(
    +request.params.id,
  );

  if (deletedCard) {
    response.status(204).end();
  }

  response.status(404).end();
});

export default cardsRouter;
