import http from "http";
import config from "./utils/config";
import app from "./app";
import logger from "./utils/logger";

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
