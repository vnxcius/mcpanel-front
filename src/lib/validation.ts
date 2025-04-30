import { z } from "zod";

export const loginSchema = z.object({
  password: z
    .string({ required_error: "Token obrigatório" })
    .min(8, { message: "Mínimo de 8 caracteres" })
    .max(50, { message: "Máximo de 128 caracteres" }),
});
