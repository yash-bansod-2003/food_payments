import { z } from "zod";
import {
  orderCreateValidationSchema,
  orderUpdateValidationSchema,
  orderQueryValidationSchema,
  cartItemValidationSchema
} from "./validators";

export type CreateOrderDto = z.infer<typeof orderCreateValidationSchema>;
export type UpdateOrderDto = z.infer<typeof orderUpdateValidationSchema>;
export type OrderQuery = z.infer<typeof orderQueryValidationSchema>;
export type CartItem = z.infer<typeof cartItemValidationSchema>;

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
