import logger from "@/common/lib/logger";
import { toppingService } from "./service";
import { MessageBrokerEvent } from "@/common/types/broker.js";

interface ToppingMessage {
  _id: string;
  name: string;
  image: string;
  price: number;
  restaurantId: number;
  isPublished: boolean;
}

class ToppingsBrokerHandler {
  async handleToppingCreateOrUpdate(message: string) {
    try {
      const messageBrokerEvent = JSON.parse(
        message,
      ) as MessageBrokerEvent<ToppingMessage>;
      logger.info(
        `Received topping event: ${JSON.stringify(messageBrokerEvent)}`,
      );
      const toppingsData = messageBrokerEvent.data;
      const existingTopping = await toppingService.findOne({
        where: { id: toppingsData._id },
      });
      if (!existingTopping) {
        await toppingService.create({
          id: toppingsData._id,
          name: toppingsData.name,
          price: toppingsData.price,
          restaurantId: toppingsData.restaurantId,
          isPublished: toppingsData.isPublished,
        });
        console.log(`Product created with ID: ${toppingsData._id}`);
        return;
      }
      await toppingService.update(
        { id: toppingsData._id },
        {
          name: toppingsData.name,
          price: toppingsData.price,
          restaurantId: toppingsData.restaurantId,
          isPublished: toppingsData.isPublished,
        },
      );
      console.log(`Product updated with ID: ${toppingsData._id}`);
    } catch (error) {
      console.error("Failed to parse product update message:", error);
    }
  }
}

export const toppingsBrokerHandler = new ToppingsBrokerHandler();
