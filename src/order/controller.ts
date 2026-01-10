import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import OrdersService from "./service";
import { CreateOrderDto, UpdateOrderDto } from "./types";
import { AuthenticatedRequest } from "@/common/middlewares/authenticate";
import { ROLES } from "@/common/lib/constants";
import IdempotencyService from "@/idempotency/service";
import CouponsService from "@/coupon/service";
import CustomersService from "@/customer/service";
import AddressesService from "@/address/service";
import ProductsService from "@/product/service";
import ToppingService from "@/toppings/service";
import { PaymentGateway } from "@/common/types/paymentGateway";
import { ResponseWithMetadata } from "@/common/types";

class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly idempotencyService: IdempotencyService,
    private readonly customerService: CustomersService,
    private readonly productService: ProductsService,
    private readonly toppingService: ToppingService,
    private readonly addressService: AddressesService,
    private readonly couponService: CouponsService,
    private readonly paymentGateway: PaymentGateway,
    private readonly logger: Logger,
  ) { }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    this.logger.info(`Creating order with data: ${JSON.stringify(req.body)}`);
    const order = req.body as CreateOrderDto;
    const { role } = req.auth;

    if (
      role === ROLES.MANAGER &&
      order.restaurantId !== req.auth.restaurantId
    ) {
      this.logger.error(
        `Manager with id: ${req.auth.sub} attempted to create order for restaurantId: ${order.restaurantId}`,
      );
      next(createHttpError(403, "forbidden"));
      return;
    }

    const coupon = await this.couponService.findOne({
      where: { code: order.coupon },
    });

    if (order.coupon && !coupon) {
      this.logger.error(`Coupon with code: ${order.coupon} not found`);
      next(createHttpError(400, "invalid coupon code"));
      return;
    }

    const customer = await this.customerService.findOne({
      where: { id: order.customerId },
    });

    if (!customer) {
      this.logger.error(`Customer with id: ${order.customerId} not found`);
      next(createHttpError(400, "invalid customer id"));
      return;
    }

    const address = await this.addressService.findOne({
      where: { id: order.addressId },
    });

    if (!address) {
      this.logger.error(`Address with id: ${order.addressId} not found`);
      next(createHttpError(400, "invalid address id"));
      return;
    }

    const calculatedCart: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const cartItem of order.cart) {
      if (cartItem.product.quantity <= 0) {
        this.logger.error(
          `Product with id: ${cartItem.product._id} has invalid quantity: ${cartItem.product.quantity}`,
        );
        next(
          createHttpError(
            400,
            `invalid quantity for product id: ${cartItem.product._id}`,
          ),
        );
        return;
      }

      const product = await this.productService.findOne({
        where: { id: cartItem.product._id },
      });

      if (!product) {
        this.logger.error(`Product with id: ${cartItem.product._id} not found`);
        next(
          createHttpError(400, `invalid product id: ${cartItem.product._id}`),
        );
        return;
      }

      let selectedToppingsTotal = 0;

      for (const toppingItem of cartItem.chosenConfiguration.selectedToppings) {
        const topping = await this.toppingService.findOne({
          where: { id: toppingItem._id },
        });

        if (!topping) {
          this.logger.error(`Topping with id: ${toppingItem._id} not found`);
          next(createHttpError(400, `invalid topping id: ${toppingItem._id}`));
          return;
        }

        selectedToppingsTotal += topping.price;
      }

      const priceConfigurationsTotal = Object.entries(
        cartItem.chosenConfiguration.priceConfigurations,
      ).reduce((sum, [key, value]) => {
        const record = product.priceConfigurations[key];
        const price = record.availableOptions[value] || 0;
        return sum + price;
      }, 0);

      const totalExcludeQuantity =
        selectedToppingsTotal + priceConfigurationsTotal;
      const totalWithoutDiscount =
        totalExcludeQuantity * cartItem.product.quantity;

      calculatedCart.push({
        productId: product.id,
        quantity: cartItem.product.quantity,
        unitPrice: totalExcludeQuantity,
        totalPrice: totalWithoutDiscount,
      });
    }

    const discount = coupon.discount ?? 0;
    const totalWithoutDiscount = calculatedCart.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
    const total =
      totalWithoutDiscount - (totalWithoutDiscount * discount) / 100;

    const idempotencyKey = req.headers["idempotency-key"];

    if (!idempotencyKey || typeof idempotencyKey !== "string") {
      this.logger.error("Idempotency key missing or invalid");
      next(createHttpError(400, "idempotency key missing or invalid"));
      return;
    }

    try {
      const existingIdempotency = await this.idempotencyService.findOne({
        where: { key: idempotencyKey },
      });

      if (existingIdempotency) {
        this.logger.info(
          `Returning cached response for idempotency key: ${idempotencyKey}`,
        );
        const existingIdempotencyResponse = JSON.parse(
          existingIdempotency.response,
        ) as { message: unknown; status: number };
        return res
          .json(existingIdempotencyResponse.message)
          .status(existingIdempotencyResponse.status);
      }

      // TODO: Wrap in transaction
      const result = await this.orderService.create({
        address,
        customer,
        coupon: coupon || null,
        paymentMode: order.paymentMode,
        restaurantId: order.restaurantId,
        metadata: {
          total: total,
        },
      });

      const { paymentUrl, sessionId } =
        await this.paymentGateway.createCheckoutSession({
          amount: total,
          orderId: result.id,
          restaurantId: result.restaurantId,
          idempotencyKey: idempotencyKey,
        });
      const responsePayload: ResponseWithMetadata<{
        paymentUrl: string;
        sessionId: string;
      }> = {
        data: { paymentUrl, sessionId },
        success: true,
      };
      await this.idempotencyService.create({
        key: idempotencyKey,
        response: JSON.stringify({
          message: responsePayload,
          status: 201,
        }),
      });

      this.logger.info(`Order created with id: ${result.id}`);
      res.status(201).json(responsePayload);
      return;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error(`Error creating order: ${errorMessage}`);
      try {
        await this.idempotencyService.create({
          key: idempotencyKey,
          response: JSON.stringify({
            message: "internal server error",
            status: 500,
          }),
        });
      } catch (idempotencyError: unknown) {
        const idempotencyErrorMessage =
          idempotencyError instanceof Error
            ? idempotencyError.message
            : JSON.stringify(idempotencyError);
        this.logger.error(
          `Error storing idempotency record: ${idempotencyErrorMessage}`,
        );
      }
      next(createHttpError(500, "internal server error"));
      return;
    }
  }

  async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    try {
      const [orders, total] = await this.orderService.findAll({
        skip,
        take: limit,
        relations: ["customer", "address", "coupon"],
        ...(req.auth.role === ROLES.MANAGER && {
          where: { restaurantId: req.auth.restaurantId },
        }),
      });

      const responseWithMetadata: ResponseWithMetadata<unknown> = {
        data: orders,
        success: true,
        meta: {
          page,
          perPage: limit,
          total,
        }
      }

      this.logger.info(`Fetched ${orders.length} orders`);
      return res.json(responseWithMetadata);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error(`Error fetching all orders: ${errorMessage}`);
      next(createHttpError(500, "internal server error"));
    }
  }

  async findOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    this.logger.info(`Fetching order with id: ${req.params.id}`);
    try {
      const order = await this.orderService.findOne({
        where: { id: Number(req.params.id) },
        relations: ["customer", "address", "coupon"],
      });
      if (!order) {
        this.logger.error(`Order with id: ${req.params.id} not found`);
        return next(createHttpError(404, "order not found"));
      }

      if (
        req.auth.role === ROLES.MANAGER &&
        order.restaurantId !== req.auth.restaurantId
      ) {
        this.logger.error(
          `Manager with id: ${req.auth.sub} attempted to access order for restaurantId: ${order.restaurantId}`,
        );
        next(createHttpError(403, "forbidden"));
        return;
      }
      const responseWithMetadata: ResponseWithMetadata<unknown> = {
        data: order,
        success: true,
      }
      this.logger.info(`Fetched order with id: ${order.id}`);
      res.json(responseWithMetadata);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error(
        `Error fetching order with id: ${req.params.id}: ${errorMessage}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    this.logger.info(
      `Updating order with id: ${req.params.id} with data: ${JSON.stringify(req.body)}`,
    );
    const order = req.body as UpdateOrderDto;

    try {
      if (req.auth.role === ROLES.MANAGER) {
        const existingOrder = await this.orderService.findOne({
          where: { id: Number(req.params.id) },
        });

        if (!existingOrder) {
          this.logger.error(`Order with id: ${req.params.id} not found`);
          return next(createHttpError(404, "order not found"));
        }

        if (existingOrder.restaurantId !== req.auth.restaurantId) {
          this.logger.error(
            `Manager with id: ${req.auth.sub} attempted to update order for restaurantId: ${existingOrder.restaurantId}`,
          );
          next(createHttpError(403, "forbidden"));
          return;
        }

        if (
          order.restaurantId &&
          order.restaurantId !== req.auth.restaurantId
        ) {
          this.logger.error(
            `Manager with id: ${req.auth.sub} attempted to change order to restaurantId: ${order.restaurantId}`,
          );
          next(createHttpError(403, "forbidden"));
          return;
        }
      }
      await this.orderService.update(
        {
          id: Number(req.params.id),
        },
        order,
      );
      const updatedOrder = await this.orderService.findOne({
        where: { id: Number(req.params.id) },
      });
      const responseWithMetadata: ResponseWithMetadata<unknown> = {
        data: updatedOrder,
        success: true,
      };
      this.logger.info(`Order with id: ${req.params.id} updated`);
      res.json(responseWithMetadata);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error(
        `Error updating order with id: ${req.params.id}: ${errorMessage}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Deleting order with id: ${req.params.id}`);
    try {
      const order = await this.orderService.delete({
        id: Number(req.params.id),
      });
      const responseWithMetadata: ResponseWithMetadata<unknown> = {
        data: order,
        success: true,
      };
      this.logger.info(`Order with id: ${req.params.id} deleted`);
      return res.json(responseWithMetadata);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error(
        `Error deleting order with id: ${req.params.id}: ${errorMessage}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }
}

export default OrdersController;
