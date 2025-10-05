import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import CouponsService from "./service";
import { Coupon } from "./types";

class CouponsController {
  constructor(
    private readonly couponService: CouponsService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Creating coupon with data: ${JSON.stringify(req.body)}`);
    const coupon = req.body as Coupon;

    try {
      const createdCoupon = await this.couponService.create(coupon);
      this.logger.info(`Coupon created with id: ${createdCoupon.id}`);
      res.json(createdCoupon);
      return;
    } catch (error) {
      this.logger.error(`Error creating coupon: ${(error as Error).message}`);
      next(createHttpError(500, "internal server error"));
      return;
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    try {
      const [coupons, total] = await this.couponService.findAll({
        skip,
        take: limit,
      });

      this.logger.info(`Fetched ${coupons.length} coupons`);
      return res.json({ page, limit, total, data: coupons });
    } catch (error) {
      this.logger.error(
        `Error fetching all coupons: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Fetching coupon with id: ${req.params.id}`);
    try {
      const coupon = await this.couponService.findOne({
        where: { id: Number(req.params.id) },
      });
      if (!coupon) {
        this.logger.error(`Coupon with id: ${req.params.id} not found`);
        return next(createHttpError(404, "coupon not found"));
      }
      this.logger.info(`Fetched coupon with id: ${coupon.id}`);
      res.json(coupon);
    } catch (error) {
      this.logger.error(
        `Error fetching coupon with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    this.logger.info(
      `Updating coupon with id: ${req.params.id} with data: ${JSON.stringify(req.body)}`,
    );
    const coupon = req.body as Coupon;

    try {
      const updatedCoupon = await this.couponService.update(
        {
          id: Number(req.params.id),
        },
        coupon,
      );
      this.logger.info(`Coupon with id: ${req.params.id} updated`);
      res.json(updatedCoupon);
    } catch (error) {
      this.logger.error(
        `Error updating coupon with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Deleting coupon with id: ${req.params.id}`);
    try {
      const coupon = await this.couponService.delete({
        id: Number(req.params.id),
      });
      this.logger.info(`Coupon with id: ${req.params.id} deleted`);
      return res.json(coupon);
    } catch (error) {
      this.logger.error(
        `Error deleting coupon with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }
}

export default CouponsController;
