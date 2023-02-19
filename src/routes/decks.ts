import express, { Request, Response } from "express";
import Deck from "../models/deck";
import decksService from "../services/decks";
import middleware from "../utils/middleware";

const decksRouter = express.Router();

decksRouter.post("/", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const newDeck: Deck = await decksService.createDeck(request.decodedToken.userId);
  response.json(newDeck);
});

decksRouter.get("/", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const decks: Deck[] = await decksService.getAllDecks(request.decodedToken.userId);
  response.json(decks);
});

decksRouter.put("/:id", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const updatedDeck: Deck | null = await decksService.updateDeck(
    request.body.title,
    +request.params.id,
  );

  if (updatedDeck) {
    response.json(updatedDeck);
  } else {
    response.status(404).json({ error: "deck not found" });
  }
});

decksRouter.delete("/:id", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const deletedDeck: Deck | null = await decksService.deleteDeck(
    +request.params.id,
  );

  if (deletedDeck) {
    response.status(204).end();
  }
  response.status(404).end();
});

export default decksRouter;
