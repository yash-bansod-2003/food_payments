import configuration from "@/common/lib/configuration.js";
import { KafkaBroker } from "../services/kafka.js";
import { MessageBroker } from "../types/broker.js";

let messageBroker: MessageBroker | null = null;

export const createMessageBrokerFactory = (): MessageBroker => {
  if (!messageBroker) {
    messageBroker = new KafkaBroker({
      clientId: configuration.kafka.clientId,
      brokers: configuration.kafka.brokers,
    });
  }
  return messageBroker;
};
