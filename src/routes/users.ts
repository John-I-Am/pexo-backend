import express, { Request, Response } from "express";
import { NewUser, UpdatedUser } from "../types";
import typeguards from "../typeguards";
import userService from "../services/users";
import middleware from "../utils/middleware";
import User from "../models/user";

const usersRouter = express.Router();

usersRouter.post("/", async (request: Request, response: Response): Promise<void> => {
  const newUser: NewUser = typeguards.toNewUser(request.body);
  const user: User = await userService.createUser(newUser);
  response.json(user);
});

usersRouter.get("/", async (request: Request, response: Response): Promise<void> => {
  const users: User[] = await userService.getAllUsers();
  response.json(users);
});

usersRouter.get("/:id", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const user: User | null = await userService.getUser(request.params.id);
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

usersRouter.put("/:id", middleware.tokenExtractor, async (request: Request, response: Response): Promise<void> => {
  const updatedUser: UpdatedUser = typeguards.toUpdatedUser(request.body);
  const user: User | null = await userService.updateUser(
    updatedUser,
    +request.params.id,
  );

  if (user) {
    response.json(user);
  }

  response.status(401).json({ error: "invalid credentials" });
});

usersRouter.delete("/:id", middleware.tokenExtractor, async (request: any, response: Response): Promise<void> => {
  const deletedUser: User | null = await userService.deleteUser(request.params.id);
  if (deletedUser) {
    response.status(204).end();
  }

  response.status(404).json({ error: "user not found" });
});

export default usersRouter;
