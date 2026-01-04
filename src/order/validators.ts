import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { PaymentMode } from "./types";

export const cartItemValidationSchema = z.object({
  product: z.object({
    _id: z.string(),
    name: z.string(),
    quantity: z.number().min(1),
  }),
  chosenConfiguration: z.object({
    priceConfigurations: z.object(),
    selectedToppings: z.array(
      z.object({
        _id: z.string(),
        name: z.string(),
        price: z.number(),
      }),
    ),
  }),
});

export const orderCreateValidationSchema = z
  .object({
    cart: z.array(cartItemValidationSchema).min(1),
    coupon: z.string().optional(),
    restaurantId: z.number(),
    comment: z.string().optional(),
    addressId: z.number(),
    customerId: z.number(),
    paymentMode: z.enum([PaymentMode.CASH, PaymentMode.CARD, PaymentMode.UPI]),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const orderUpdateValidationSchema = z
  .object({
    restaurantId: z.number().optional(),
    paymentMode: z
      .enum([PaymentMode.CARD, PaymentMode.CASH, PaymentMode.UPI])
      .optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    customer: z
      .object({
        id: z.number(),
      })
      .optional(),
    address: z
      .object({
        id: z.number(),
      })
      .optional(),
    coupon: z
      .object({
        id: z.number(),
      })
      .optional(),
  })
  .strict();

export const orderQueryValidationSchema = z
  .object({
    page: z.number().optional(),
    limit: z.number().optional(),
    restaurantId: z.number().optional(),
    paymentMode: z
      .enum([PaymentMode.CARD, PaymentMode.CASH, PaymentMode.UPI])
      .optional(),
  })
  .strict();

export const orderCreateValidator = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    orderCreateValidationSchema.parse(req.body);
    next();
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const orderUpdateValidator = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    orderUpdateValidationSchema.parse(req.body);
    next();
    return;
  } catch (error) {
    next(error);
    return;
  }
};
