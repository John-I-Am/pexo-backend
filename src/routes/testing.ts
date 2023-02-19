import express, { Response, Request } from "express";
import Card from "../models/card";
import User from "../models/user";
import Deck from "../models/deck";

const testingRouter = express.Router();

testingRouter.post("/reset", async (request: Request, response: Response): Promise<void> => {
  await Card.sync({ force: true });
  await User.sync({ force: true });
  await Deck.sync({ force: true });
  response.status(204).end();
});

export default testingRouter;
