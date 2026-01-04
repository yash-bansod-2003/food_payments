export interface MessageBroker {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(topics: string, message: string): Promise<void>;
  consumeMessages(topic: string[], fromBeginning?: boolean): Promise<void>;
}
