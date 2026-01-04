import { Router, RequestHandler } from "express";
import AddressesController from "./controller";
import AddressService from "./service";
import { AppDataSource } from "@/data-source";
import { Address } from "./entity";
import authenticate from "@/common/middlewares/authenticate";
import authorization from "@/common/middlewares/authorization";
import logger from "@/common/lib/logger";
import { ROLES } from "@/common/lib/constants";
import { addressCreateValidator } from "./validators";

const router = Router();

const addressesRepository = AppDataSource.getRepository(Address);
const addressService = new AddressService(addressesRepository);
const addressesController = new AddressesController(addressService, logger);

router.post(
  "/",
  authenticate,
  addressCreateValidator,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await addressesController.create(req, res, next);
  },
);

router.get(
  "/",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await addressesController.findAll(req, res, next);
  },
);

router.get(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await addressesController.findOne(req, res, next);
  },
);

router.put(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await addressesController.update(req, res, next);
  },
);

router.delete(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await addressesController.delete(req, res, next);
  },
);

export default router;
