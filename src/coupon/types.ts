import { z } from "zod";
import { couponQueryValidationSchema } from "./validators";

export type Coupon = z.infer<typeof couponQueryValidationSchema>;
