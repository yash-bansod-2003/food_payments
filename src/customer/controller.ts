import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import CustomerService from "./service";
import { Customer } from "./types";

class CustomersController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    this.logger.info(
      `Creating customer with data: ${JSON.stringify(req.body)}`,
    );
    const customer = req.body as Customer;

    try {
      const createdCustomer = await this.customerService.create(customer);
      this.logger.info(`Customer created with id: ${createdCustomer.id}`);
      res.json(createdCustomer);
      return;
    } catch (error) {
      this.logger.error(`Error creating customer: ${(error as Error).message}`);
      next(createHttpError(500, "internal server error"));
      return;
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    try {
      const [customers, total] = await this.customerService.findAll({
        skip,
        take: limit,
      });

      this.logger.info(`Fetched ${customers.length} customers`);
      return res.json({ page, limit, total, data: customers });
    } catch (error) {
      this.logger.error(
        `Error fetching all customers: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Fetching customer with id: ${req.params.id}`);
    try {
      const customer = await this.customerService.findOne({
        where: { id: Number(req.params.id) },
      });
      if (!customer) {
        this.logger.error(`Customer with id: ${req.params.id} not found`);
        return next(createHttpError(404, "customer not found"));
      }
      this.logger.info(`Fetched customer with id: ${customer.id}`);
      res.json(customer);
    } catch (error) {
      this.logger.error(
        `Error fetching customer with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    this.logger.info(
      `Updating customer with id: ${req.params.id} with data: ${JSON.stringify(req.body)}`,
    );
    const customer = req.body as Customer;

    try {
      const updatedCustomer = await this.customerService.update(
        {
          id: Number(req.params.id),
        },
        customer,
      );
      this.logger.info(`Customer with id: ${req.params.id} updated`);
      res.json(updatedCustomer);
    } catch (error) {
      this.logger.error(
        `Error updating customer with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Deleting customer with id: ${req.params.id}`);
    try {
      const customer = await this.customerService.delete({
        id: Number(req.params.id),
      });
      this.logger.info(`Customer with id: ${req.params.id} deleted`);
      return res.json(customer);
    } catch (error) {
      this.logger.error(
        `Error deleting customer with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }
}

export default CustomersController;
