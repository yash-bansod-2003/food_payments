import { z } from "zod";
import {
  orderCreateValidationSchema,
  orderUpdateValidationSchema,
  orderQueryValidationSchema,
} from "./validators";

export type CreateOrderDto = z.infer<typeof orderCreateValidationSchema>;
export type UpdateOrderDto = z.infer<typeof orderUpdateValidationSchema>;
export type OrderQuery = z.infer<typeof orderQueryValidationSchema>;

export enum PaymentMode {
  CASH = "CASH",
  CARD = "CARD",
  UPI = "UPI",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
