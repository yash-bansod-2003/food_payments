import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const addressValidationSchema = z
  .object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string(),
  })
  .strict();

export const addressQueryValidationSchema = z
  .object({
    page: z.number().optional(),
    limit: z.number().optional(),
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
  })
  .strict();

export const addressCreateValidator = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.body);
    addressValidationSchema.parse(req.body);
    next();
    return;
  } catch (error) {
    next(error);
    return;
  }
};
