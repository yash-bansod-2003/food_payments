import { Router, RequestHandler } from "express";
import CouponsController from "./controller";
import CouponsService from "./service";
import { AppDataSource } from "@/data-source";
import { Coupon } from "./entity";
import authenticate from "@/common/middlewares/authenticate";
import authorization from "@/common/middlewares/authorization";
import logger from "@/common/lib/logger";
import { ROLES } from "@/common/lib/constants";
import { couponCreateValidator } from "./validators";

const router = Router();

const couponsRepository = AppDataSource.getRepository(Coupon);
const couponService = new CouponsService(couponsRepository);
const couponsController = new CouponsController(couponService, logger);

router.post(
  "/",
  authenticate,
  couponCreateValidator,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await couponsController.create(req, res, next);
  },
);

router.get(
  "/",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await couponsController.findAll(req, res, next);
  },
);

router.get(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await couponsController.findOne(req, res, next);
  },
);

router.put(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await couponsController.update(req, res, next);
  },
);

router.delete(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await couponsController.delete(req, res, next);
  },
);

export default router;
