export interface MessageBroker {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(topic: string, message: string): Promise<void>;
  consumeMessages(topics: string[], fromBeginning?: boolean): Promise<void>;
}

export type EVENT_TYPE =
  | "product.created"
  | "product.updated"
  | "product.deleted"
  | "topping.created"
  | "topping.updated"
  | "topping.deleted";

export interface ProducerMeta {
  service: string;
  version: string;
}

export interface MessageBrokerEvent<T = unknown> {
  event_id: string;
  event_type: EVENT_TYPE;
  event_version: string;
  occurred_at: string;
  producer: ProducerMeta;
  partition_key: string;
  data: T;
}
