export interface PaymentGatewayOptions {
  amount: number;
  orderId: number;
  restaurantId: number;
  currency?: string;
  idempotencyKey?: string;
}

export interface PaymentGateway {
  createCheckoutSession(options: PaymentGatewayOptions): Promise<{
    sessionId: string;
    paymentUrl: string;
  }>;
}
