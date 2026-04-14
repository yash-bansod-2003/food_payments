import {
  PaymentGateway,
  PaymentGatewayCustomer,
  PaymentGatewayOptions,
} from "../types/paymentGateway";
import Stripe from "stripe";

export class StripePaymentGateway implements PaymentGateway {
  private readonly stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey);
  }

  async createCheckoutSession(options: PaymentGatewayOptions): Promise<{
    sessionId: string;
    paymentUrl: string;
  }> {
    const session = await this.stripe.checkout.sessions.create(
      {
        metadata: {
          orderId: options.orderId,
          restaurantId: options.restaurantId,
        },
        line_items: [
          {
            price_data: {
              currency: options.currency || "usd",
              product_data: {
                name: `Order #${options.orderId}`,
              },
              unit_amount: options.amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}&order_id=${options.orderId}`,
        cancel_url: "http://localhost:3000/payment/cancel",
      },
      {
        idempotencyKey: options.idempotencyKey,
      },
    );
    return {
      sessionId: session.id,
      paymentUrl: session.url,
    };
  }

  async getCustomerDetails(
    customerId: string,
  ): Promise<PaymentGatewayCustomer> {
    const customer = (await this.stripe.customers.retrieve(
      customerId,
    )) as Stripe.Customer;
    return {
      id: customer.id,
      ...(customer.address && {
        address: {
          line1: customer.address.line1,
          line2: customer.address.line2,
          city: customer.address.city,
          state: customer.address.state,
          postal_code: customer.address.postal_code,
          country: customer.address.country,
        },
      }),
      description: customer.description,
      email: customer.email || "",
      metadata: customer.metadata,
      name: customer.name || "",
      phone: customer.phone,
    };
  }

  async createCustomer(
    email: string,
    name: string,
  ): Promise<PaymentGatewayCustomer> {
    const customer = await this.stripe.customers.create({
      email,
      name,
    });
    return {
      id: customer.id,
      ...(customer.address && {
        address: {
          line1: customer.address.line1,
          line2: customer.address.line2,
          city: customer.address.city,
          state: customer.address.state,
          postal_code: customer.address.postal_code,
          country: customer.address.country,
        },
      }),
      description: customer.description,
      email: customer.email || "",
      metadata: customer.metadata,
      name: customer.name || "",
      phone: customer.phone,
    };
  }
}
