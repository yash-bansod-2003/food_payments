import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { PaymentMode } from "./types";

export const orderCreateValidationSchema = z
  .object({
    restaurantId: z.number(),
    paymentMode: z.nativeEnum(PaymentMode),
    metadata: z.record(z.string(), z.unknown()).optional(),
    customer: z.object({
      id: z.number(),
    }),
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

export const orderUpdateValidationSchema = z
  .object({
    restaurantId: z.number().optional(),
    paymentMode: z.nativeEnum(PaymentMode).optional(),
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
    paymentMode: z.nativeEnum(PaymentMode).optional(),
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
