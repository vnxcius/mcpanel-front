import { z } from "zod";

export const loginSchema = z.object({
  password: z
    .string({ required_error: "Senha obrigatória" })
    .min(1, { message: "Mínimo de 1 caractere" })
    .max(50, { message: "Máximo de 50 caracteres" }),
});
