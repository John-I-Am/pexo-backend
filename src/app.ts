import "express-async-errors";
import express from "express";
import cors from "cors";
import config from "./utils/config";
import logger from "./utils/logger";

import usersRouter from "./routes/users";
import loginRouter from "./routes/login";
import decksRouter from "./routes/decks";
import cardsRouter from "./routes/cards";
import dictionaryRouter from "./routes/define";
import testingRouter from "./routes/testing";
import middleware from "./utils/middleware";
import db from "./utils/db";
import joinDb from "./models";

logger.info("connecting to", config.DATABASE_URL);

const start = async () => {
  joinDb();
  await db.connectToDatabase();
};

start();

const app = express();
app.use(express.static("build"));
app.use(middleware.requestLogger);

app.use(cors());
app.use(express.json());

// eslint-disable-next-line consistent-return
function httpsRedirectMiddleware(req: any, res: any, next: any) {
  console.log("lolololo");
  if (req.headers["x-forwarded-proto"] !== "https" && process.env.NODE_ENV === "production") {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  next();
}

// eslint-disable-next-line consistent-return
app.use(httpsRedirectMiddleware);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/decks", decksRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/define", dictionaryRouter);
app.get("*", (request, response) => {
  response.sendFile("index.html", { root: "build" });
});

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

export default app;
