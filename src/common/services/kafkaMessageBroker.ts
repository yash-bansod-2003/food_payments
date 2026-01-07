import { MessageBroker } from "@/common/types/broker";
import {
  Kafka,
  Producer,
  Consumer,
  Partitioners,
  EachMessagePayload,
} from "kafkajs";
import { productBrokerHandler } from "../../product/brokerHandler";
import { toppingsBrokerHandler } from "../../toppings/brokerHandler";

export class KafkaMessageBroker implements MessageBroker {
  private readonly producer: Producer;
  private readonly consumer: Consumer;

  constructor({ clientId, brokers }: { clientId: string; brokers: string[] }) {
    const kafka = new Kafka({
      clientId,
      brokers,
    });
    this.producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
    this.consumer = kafka.consumer({ groupId: "default-group" });
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
      await this.consumer.disconnect();
    }
  }

  async sendMessage(topic: string, message: string): Promise<void> {
    if (!this.producer) {
      throw new Error("Producer is not initialized");
    }
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  async consumeMessages(
    topics: string[],
    fromBeginning: boolean = false,
  ): Promise<void> {
    if (!this.consumer) {
      throw new Error("Consumer is not initialized");
    }
    await this.consumer.connect();
    await this.consumer.subscribe({ topics, fromBeginning });
    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        console.log({
          topic,
          partition,
          value: message.value?.toString(),
        });
        if (topic === "product-topic" && message.value) {
          await productBrokerHandler.handleProductCreateOrUpdate(
            message.value.toString(),
          );
        }
        if (topic === "toppings-topic" && message.value) {
          await toppingsBrokerHandler.handleToppingCreateOrUpdate(
            message.value.toString(),
          );
        }
      },
    });
  }
}
