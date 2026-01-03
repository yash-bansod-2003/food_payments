import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import IdempotencyService from "./service";
import { AuthenticatedRequest } from "@/common/middlewares/authenticate";

class IdempotencyController {
  constructor(
    private readonly idempotencyService: IdempotencyService,
    private readonly logger: Logger,
  ) { }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    this.logger.info(`Creating idempotency key with data: ${JSON.stringify(req.body)}`);

    try {
      const idempotencyKey = await this.idempotencyService.create(req.body);
      this.logger.info(`Idempotency key created with id: ${idempotencyKey.id}`);
      res.json(idempotencyKey);
      return;
    } catch (error) {
      this.logger.error(`Error creating idempotency key: ${(error as Error).message}`);
      next(createHttpError(500, "internal server error"));
      return;
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Deleting idempotency key with id: ${req.params.id}`);

    try {
      const deletedKey = await this.idempotencyService.delete({
        id: req.params.id,
      });
      this.logger.info(`Idempotency key with id: ${req.params.id} deleted`);
      return res.json(deletedKey);
    } catch (error) {
      this.logger.error(
        `Error deleting idempotency key with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }
}

export default IdempotencyController;
