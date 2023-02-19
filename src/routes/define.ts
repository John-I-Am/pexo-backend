/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import express, { Request, Response } from "express";
import dictionaryService from "../services/dictionary";

const defineRouter = express.Router();

defineRouter.get("/:word", async (request: Request, response: Response): Promise<void> => {
  const result: any = await dictionaryService.define(request.params.word);
  const resultToProcess: any = result.results[0].lexicalEntries[0].entries[0];

  const pronunciation: string = resultToProcess.pronunciations[0].audioFile;
  const definition: any = resultToProcess.senses[0].definitions[0];
  const examples: any = [];

  const result2: any = await dictionaryService.define2(request.params.word);
  const resultToProcess2: any = result2.results[0].lexicalEntries[0].sentences;
  resultToProcess2.forEach((entry: any) => {
    examples.push(entry.text);
  });

  response.json({ pronunciation, definition, examples });
});

export default defineRouter;
