import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import CouponsService from "./service";
import { Coupon } from "./types";
import { AuthenticatedRequest } from "@/common/middlewares/authenticate";
import { ROLES } from "@/common/lib/constants";
import { couponValidationSchema } from "./validators";
import z from "zod";

class CouponsController {
  constructor(
    private readonly couponService: CouponsService,
    private readonly logger: Logger,
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    this.logger.info(`Creating coupon with data: ${JSON.stringify(req.body)}`);
    const couponData = req.body as z.infer<typeof couponValidationSchema>;
    const { role } = req.auth;
    if (
      role === ROLES.MANAGER &&
      couponData.restaurantId !== req.auth.restaurantId
    ) {
      this.logger.error(
        `Manager with id: ${req.auth.sub} attempted to create coupon for restaurantId: ${couponData.restaurantId}`,
      );
      next(createHttpError(403, "forbidden"));
      return;
    }

    try {
      const coupon = await this.couponService.findOne({
        where: { code: couponData.code },
      });

      if (coupon) {
        this.logger.error(
          `Coupon with code: ${couponData.code} already exists`,
        );
        next(createHttpError(409, "coupon code already exists"));
        return;
      }
      const createdCoupon = await this.couponService.create(couponData);
      this.logger.info(`Coupon created with id: ${createdCoupon.id}`);
      res.json(createdCoupon);
      return;
    } catch (error) {
      this.logger.error(`Error creating coupon: ${(error as Error).message}`);
      next(createHttpError(500, "internal server error"));
      return;
    }
  }

  async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    try {
      const [coupons, total] = await this.couponService.findAll({
        skip,
        take: limit,
        ...(req.auth.role === ROLES.MANAGER && {
          restaurantId: req.auth.restaurantId,
        }),
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

  async findOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    this.logger.info(`Fetching coupon with id: ${req.params.id}`);
    try {
      const coupon = await this.couponService.findOne({
        where: { id: Number(req.params.id) },
      });
      if (!coupon) {
        this.logger.error(`Coupon with id: ${req.params.id} not found`);
        return next(createHttpError(404, "coupon not found"));
      }

      if (
        req.auth.role === ROLES.MANAGER &&
        coupon.restaurantId !== req.auth.restaurantId
      ) {
        this.logger.error(
          `Manager with id: ${req.auth.sub} attempted to access coupon for restaurantId: ${coupon.restaurantId}`,
        );
        next(createHttpError(403, "forbidden"));
        return;
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

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    this.logger.info(
      `Updating coupon with id: ${req.params.id} with data: ${JSON.stringify(req.body)}`,
    );
    const coupon = req.body as Coupon;

    try {
      if (req.auth.role === ROLES.MANAGER) {
        const existingCoupon = await this.couponService.findOne({
          where: { id: Number(req.params.id) },
        });

        if (!existingCoupon) {
          this.logger.error(`Coupon with id: ${req.params.id} not found`);
          return next(createHttpError(404, "coupon not found"));
        }

        if (existingCoupon.restaurantId !== req.auth.restaurantId) {
          this.logger.error(
            `Manager with id: ${req.auth.sub} attempted to update coupon for restaurantId: ${existingCoupon.restaurantId}`,
          );
          next(createHttpError(403, "forbidden"));
          return;
        }

        if (
          coupon.restaurantId &&
          coupon.restaurantId !== req.auth.restaurantId
        ) {
          this.logger.error(
            `Manager with id: ${req.auth.sub} attempted to change coupon to restaurantId: ${coupon.restaurantId}`,
          );
          next(createHttpError(403, "forbidden"));
          return;
        }
      }

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
