export interface MessageBroker {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(topic: string, message: string): Promise<void>;
  consumeMessages(topics: string[], fromBeginning?: boolean): Promise<void>;
}
