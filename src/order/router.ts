import { Router, RequestHandler } from "express";
import OrdersController from "./controller";
import OrdersService from "./service";
import { AppDataSource } from "@/data-source";
import { Order } from "./entity";
import authenticate, {
  AuthenticatedRequest,
} from "@/common/middlewares/authenticate";
import authorization from "@/common/middlewares/authorization";
import logger from "@/common/lib/logger";
import { ROLES } from "@/common/lib/constants";
import { orderCreateValidator, orderUpdateValidator } from "./validators";
import CustomersService from "@/customer/service";
import { productService } from "@/product/service";
import { toppingService } from "@/toppings/service";
import AddressesService from "@/address/service";
import CouponsService from "@/coupon/service";
import IdempotencyService from "@/idempotency/service";
import { Idempotency } from "@/idempotency/entity";
import { Customer } from "@/customer/entity";
import { Coupon } from "@/coupon/entity";
import { Address } from "@/address/entity";

const router = Router();

const idempotencyRepository = AppDataSource.getRepository(Idempotency);
const idempotencyService = new IdempotencyService(idempotencyRepository);
const customersRepository = AppDataSource.getRepository(Customer);
const customerService = new CustomersService(customersRepository);
const addressRepository = AppDataSource.getRepository(Address);
const addressService = new AddressesService(addressRepository);
const couponRepository = AppDataSource.getRepository(Coupon);
const couponService = new CouponsService(couponRepository);

const ordersRepository = AppDataSource.getRepository(Order);
const orderService = new OrdersService(ordersRepository);
const ordersController = new OrdersController(
  orderService,
  idempotencyService,
  customerService,
  productService,
  toppingService,
  addressService,
  couponService,
  logger,
);

router.post(
  "/",
  authenticate,
  orderCreateValidator,
  authorization([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]) as RequestHandler,
  async (req, res, next) => {
    await ordersController.create(req as AuthenticatedRequest, res, next);
  },
);

router.get(
  "/",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]) as RequestHandler,
  async (req, res, next) => {
    await ordersController.findAll(req as AuthenticatedRequest, res, next);
  },
);

router.get(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]) as RequestHandler,
  async (req, res, next) => {
    await ordersController.findOne(req as AuthenticatedRequest, res, next);
  },
);

router.put(
  "/:id",
  authenticate,
  orderUpdateValidator,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  async (req, res, next) => {
    await ordersController.update(req as AuthenticatedRequest, res, next);
  },
);

router.delete(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  async (req, res, next) => {
    await ordersController.delete(req, res, next);
  },
);

export default router;
