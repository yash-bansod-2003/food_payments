import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import OrdersService from "./service";
import { CreateOrderDto, UpdateOrderDto } from "./types";
import { AuthenticatedRequest } from "@/common/middlewares/authenticate";
import { ROLES } from "@/common/lib/constants";

class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly logger: Logger,
  ) {}

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

    try {
      const createdOrder = await this.orderService.create(order);
      this.logger.info(`Order created with id: ${createdOrder.id}`);
      res.json(createdOrder);
      return;
    } catch (error) {
      this.logger.error(`Error creating order: ${(error as Error).message}`);
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

      this.logger.info(`Fetched ${orders.length} orders`);
      return res.json({ page, limit, total, data: orders });
    } catch (error) {
      this.logger.error(
        `Error fetching all orders: ${(error as Error).message}`,
      );
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

      this.logger.info(`Fetched order with id: ${order.id}`);
      res.json(order);
    } catch (error) {
      this.logger.error(
        `Error fetching order with id: ${req.params.id}: ${(error as Error).message}`,
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

      const updatedOrder = await this.orderService.update(
        {
          id: Number(req.params.id),
        },
        order,
      );
      this.logger.info(`Order with id: ${req.params.id} updated`);
      res.json(updatedOrder);
    } catch (error) {
      this.logger.error(
        `Error updating order with id: ${req.params.id}: ${(error as Error).message}`,
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
      this.logger.info(`Order with id: ${req.params.id} deleted`);
      return res.json(order);
    } catch (error) {
      this.logger.error(
        `Error deleting order with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }
}

export default OrdersController;
