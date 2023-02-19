import express, { NextFunction, Request, Response } from "express";
import User from "../models/user";
import middleware from "../utils/middleware";

// eslint-disable-next-line consistent-return
const isAdmin = async (request: Request, response: Response, next: NextFunction) => {
  const user: User | null = await User.findByPk(request.decodedToken.userId);
  if (user && !user.admin) {
    return response.status(401).json({ error: "operation not allowed" });
  }
  next();
};

const adminRouter = express.Router();

adminRouter.put("/:id", middleware.tokenExtractor, isAdmin, async (req, res) => {
  const user: User | null = await User.findOne({
    where: {
      id: +(req.params.id),
    },
  });

  if (user) {
    user.disabled = req.body.disable;
    await user.save();
    res.json(user);
  } else {
    res.status(400).end();
  }
});
