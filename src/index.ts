import "reflect-metadata";
import { Express } from "express";
import { createServer } from "@/server";
import configuration from "@/common/lib/configuration";
import { AppDataSource } from "@/data-source";
import logger from "@/common/lib/logger";
import { createMessageBrokerFactory } from "./common/factories/brokerFactory.js";

const port = configuration.port;
const host = configuration.host;
const server: Express = createServer();
const messageBroker = createMessageBrokerFactory();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
server.listen(port, host, async () => {
  try {
    await AppDataSource.initialize();
    await messageBroker.connect();
    logger.info("Kafka connected successfully");
    await messageBroker.consumeMessages(["product-topic", "toppings-topic"]);
    logger.info("Subscribed to product-topic and toppings-topic successfully");
    logger.info(`Server Listening on  http://${host}:${port}`);
  } catch (error: unknown) {
    logger.error(error);
    await messageBroker.disconnect();
    process.exit(1);
  }
});
