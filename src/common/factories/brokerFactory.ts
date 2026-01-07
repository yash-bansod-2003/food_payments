import configuration from "@/common/lib/configuration";
import { KafkaMessageBroker } from "../services/kafkaMessageBroker";
import { MessageBroker } from "../types/broker";

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
