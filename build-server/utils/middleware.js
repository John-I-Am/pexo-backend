"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./logger"));
const tokenExtractor = (request, response, next) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        request.decodedToken = jsonwebtoken_1.default.verify(authorization.substring(7), config_1.default.SECRET);
    }
    else {
        return response.status(401).json({ error: "token missing" });
    }
    next();
};
const requestLogger = (request, response, next) => {
    logger_1.default.info("Method:", request.method);
    logger_1.default.info("Path:  ", request.path);
    logger_1.default.info("Body:  ", request.body);
    logger_1.default.info("---");
    next();
};
const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
const errorHandler = (error, request, response, next) => {
    if (error.name === "ParseError") {
        return response.status(400).json({ error: error.message });
    }
    if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "invalid token" });
    }
    if (error.name === "TokenExpiredError") {
        return response.status(400).json({ error: error.message });
    }
    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
        return response.status(400).json({ error: error.errors[0].message });
    }
    if (error.name === "SequelizeValidationError") {
        return response.status(400).json({ error: error.errors[0].message });
    }
    if (error.name === "SequelizeDatabaseError") {
        return response.status(400).json({ error: error.errors[0].message });
    }
    next(error);
};
exports.default = {
    errorHandler, requestLogger, unknownEndPoint, tokenExtractor,
};
