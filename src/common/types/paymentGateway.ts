import { Address } from "@/address/entity";

export interface PaymentGatewayOptions {
  amount: number;
  orderId: number;
  restaurantId: number;
  currency?: string;
  idempotencyKey?: string;
}

export interface PaymentGatewayCustomer {
  id: string;
  address?: Pick<
    Address,
    "line1" | "line2" | "city" | "state" | "postal_code" | "country"
  >;
  description?: string | null;
  email: string;
  metadata: unknown;
  name: string;
  phone: string | null;
}

export interface PaymentGateway {
  createCheckoutSession(options: PaymentGatewayOptions): Promise<{
    sessionId: string;
    paymentUrl: string;
  }>;
  getCustomerDetails(customerId: string): Promise<PaymentGatewayCustomer>;
  createCustomer(email: string, name: string): Promise<PaymentGatewayCustomer>;
}
