import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const customerValidationSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    password: z.string(),
  })
  .strict();

export const customerQueryValidationSchema = z
  .object({
    page: z.number().optional(),
    limit: z.number().optional(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
  })
  .strict();

export const customerCreateValidator = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.body);
    customerValidationSchema.parse(req.body);
    next();
    return;
  } catch (error) {
    next(error);
    return;
  }
};
