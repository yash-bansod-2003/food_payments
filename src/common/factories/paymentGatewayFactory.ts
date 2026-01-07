import configuration from "@/common/lib/configuration";
import { StripePaymentGateway } from "../services/stripePaymentGateway";
import { PaymentGateway } from "../types/paymentGateway";

let paymentGateway: PaymentGateway | null = null;

export const createPaymentGatewayFactory = (): PaymentGateway => {
  if (!paymentGateway) {
    paymentGateway = new StripePaymentGateway(configuration.stripe.secret_key || "");
  }
  return paymentGateway;
};
