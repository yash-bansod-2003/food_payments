import configuration from "@/common/lib/configuration.js";
import { KafkaMessageBroker } from "../services/kafkaMessageBroker.js";
import { MessageBroker } from "../types/broker.js";

let messageBroker: MessageBroker | null = null;

export const createMessageBrokerFactory = (): MessageBroker => {
  if (!messageBroker) {
    messageBroker = new KafkaMessageBroker({
      clientId: configuration.kafka.clientId,
      brokers: configuration.kafka.brokers,
    });
  }
  return messageBroker;
};
