import { CustomerMessage } from "./entity";
import { customerService } from "./service";
import { MessageBrokerEvent } from "@/common/types/broker.js";
import { createPaymentGatewayFactory } from "@/common/factories/paymentGatewayFactory";

const paymentGateway = createPaymentGatewayFactory();

class CustomerBrokerHandler {
  async handleCustomerCreateOrUpdate(message: string) {
    try {
      const messageEvent = JSON.parse(
        message,
      ) as MessageBrokerEvent<CustomerMessage>;
      const customerData = messageEvent.data;

      const existingCustomer = await customerService.findOne({
        where: { id: customerData.id },
      });

      const payload = {
        id: customerData.id,
        firstname: customerData.firstname,
        lastname: customerData.lastname,
        email: customerData.email,
      };

      if (!existingCustomer) {
        const paymentGatewayCustomer = await paymentGateway.createCustomer(
          customerData.email,
          `${customerData.firstname} ${customerData.lastname}`,
        );
        await customerService.create({
          ...payload,
          payment_gateway_customer_id: paymentGatewayCustomer.id,
        });
        console.log(`Customer created with ID: ${customerData.id}`);
        return;
      }

      await customerService.update({ id: customerData.id }, payload);
      console.log(`Customer updated with ID: ${customerData.id}`);
    } catch (error) {
      console.error("Failed to parse customer update message:", error);
    }
  }
}

export const customerBrokerHandler = new CustomerBrokerHandler();
