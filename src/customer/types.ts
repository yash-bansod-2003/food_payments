import { z } from "zod";
import { customerQueryValidationSchema } from "./validators";

export type Customer = z.infer<typeof customerQueryValidationSchema>;
