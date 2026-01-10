import { ProductMessage } from "./entity";
import { productService } from "./service";
import { MessageBrokerEvent } from "@/common/types/broker.js";

class ProductBrokerHandler {
  async handleProductCreateOrUpdate(message: string) {
    try {
      const messageBrokerEven = JSON.parse(message) as MessageBrokerEvent<ProductMessage>;
      const productData = messageBrokerEven.data;
      const existingProduct = await productService.findOne({
        where: { id: productData._id },
      });
      if (!existingProduct) {
        await productService.create({
          id: productData._id,
          name: productData.name,
          priceConfigurations: productData.priceConfigurations,
          restaurantId: productData.restaurentId,
        });
        console.log(`Product created with ID: ${productData._id}`);
        return;
      }
      await productService.update(
        { id: productData._id },
        {
          name: productData.name,
          priceConfigurations: productData.priceConfigurations,
          restaurantId: productData.restaurentId,
        },
      );
      console.log(`Product updated with ID: ${productData._id}`);
    } catch (error) {
      console.error("Failed to parse product update message:", error);
    }
  }
}

export const productBrokerHandler = new ProductBrokerHandler();
