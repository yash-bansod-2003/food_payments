import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import AddressService from "./service";
import { Address } from "./types";

class AddressesController {
  constructor(
    private readonly addressService: AddressService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Creating address with data: ${JSON.stringify(req.body)}`);
    const address = req.body as Address;

    try {
      const createdAddress = await this.addressService.create(address);
      this.logger.info(`Address created with id: ${createdAddress.id}`);
      res.json(createdAddress);
      return;
    } catch (error) {
      this.logger.error(`Error creating address: ${(error as Error).message}`);
      next(createHttpError(500, "internal server error"));
      return;
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    try {
      const [addresses, total] = await this.addressService.findAll({
        skip,
        take: limit,
      });

      this.logger.info(`Fetched ${addresses.length} addresses`);
      return res.json({ page, limit, total, data: addresses });
    } catch (error) {
      this.logger.error(
        `Error fetching all addresses: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    this.logger.info(`Fetching address with id: ${id}`);
    try {
      const address = await this.addressService.findOne({
        where: { id },
      });
      if (!address) {
        this.logger.error(`Address with id: ${id} not found`);
        return next(createHttpError(404, "address not found"));
      }
      this.logger.info(`Fetched address with id: ${address.id}`);
      res.json(address);
    } catch (error) {
      this.logger.error(
        `Error fetching address with id: ${id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    this.logger.info(
      `Updating address with id: ${id} with data: ${JSON.stringify(req.body)}`,
    );
    const address = req.body as Address;

    try {
      const updatedAddress = await this.addressService.update(
        {
          id: Number(req.params.id),
        },
        address,
      );
      this.logger.info(`Address with id: ${id} updated`);
      res.json(updatedAddress);
    } catch (error) {
      this.logger.error(
        `Error updating address with id: ${id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    this.logger.info(`Deleting address with id: ${id}`);
    try {
      const address = await this.addressService.delete({
        id: Number(req.params.id),
      });
      this.logger.info(`Address with id: ${id} deleted`);
      return res.json(address);
    } catch (error) {
      this.logger.error(
        `Error deleting address with id: ${id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }
}

export default AddressesController;
