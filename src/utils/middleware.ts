/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "./config";
import logger from "./logger";

const tokenExtractor = (request: any, response: Response, next: NextFunction)
: Response | void => {
  const authorization: string = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.decodedToken = jwt.verify(authorization.substring(7), config.SECRET as string);
  } else {
    return response.status(401).json({ error: "token missing" });
  }

  next();
};

const requestLogger = (request: Request, response: Response, next: NextFunction): void => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");

  next();
};

const unknownEndPoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error: any, request: Request, response: Response, next: NextFunction)
: Response | void => {
  if (error.name === "ParseError") {
    return response.status(400).json({ error: error.message });
  } if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  } if (error.name === "TokenExpiredError") {
    return response.status(400).json({ error: error.message });
  } if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } if (error.name === "SequelizeUniqueConstraintError") {
    return response.status(400).json({ error: error.errors[0].message });
  } if (error.name === "SequelizeValidationError") {
    return response.status(400).json({ error: error.errors[0].message });
  } if (error.name === "SequelizeDatabaseError") {
    return response.status(400).json({ error: error.errors[0].message });
  }

  next(error);
};

export default {
  errorHandler, requestLogger, unknownEndPoint, tokenExtractor,
};
