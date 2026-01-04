import { z } from "zod";
import { addressQueryValidationSchema } from "./validators";

export type Address = z.infer<typeof addressQueryValidationSchema>;
