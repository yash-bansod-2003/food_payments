import { Router, RequestHandler } from "express";
import CustomersController from "./controller";
import CustomerService from "./service";
import { AppDataSource } from "@/data-source";
import { Customer } from "./entity";
import authenticate from "@/common/middlewares/authenticate";
import authorization from "@/common/middlewares/authorization";
import logger from "@/common/lib/logger";
import { ROLES } from "@/common/lib/constants";
import { customerCreateValidator } from "./validators";

const router = Router();

const customersRepository = AppDataSource.getRepository(Customer);
const customerService = new CustomerService(customersRepository);
const customersController = new CustomersController(customerService, logger);

router.post(
  "/",
  authenticate,
  customerCreateValidator,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await customersController.create(req, res, next);
  },
);

router.get(
  "/",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await customersController.findAll(req, res, next);
  },
);

router.get(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await customersController.findOne(req, res, next);
  },
);

router.put(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await customersController.update(req, res, next);
  },
);

router.delete(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await customersController.delete(req, res, next);
  },
);

export default router;
