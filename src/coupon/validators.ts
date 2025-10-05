import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const couponValidationSchema = z
  .object({
    title: z.string(),
    code: z.string(),
    discount: z.number(),
    validity: z.string().transform((str) => new Date(str)),
    restaurantId: z.number(),
  })
  .strict();

export const couponQueryValidationSchema = z
  .object({
    page: z.number().optional(),
    limit: z.number().optional(),
    title: z.string().optional(),
    code: z.string().optional(),
    restaurantId: z.number().optional(),
  })
  .strict();

export const couponCreateValidator = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.body);
    couponValidationSchema.parse(req.body);
    next();
    return;
  } catch (error) {
    next(error);
    return;
  }
};
