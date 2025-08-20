import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Tu nombre es muy corto"),
  email: z.string().email("Correo inválido"),
  lawyer_id: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^\+?[0-9\s-]{7,15}$/.test(v), "Teléfono inválido"),
  observations: z
    .string()
    .min(10, "Cuéntanos un poco más (mín. 10 caracteres)"),
  agree: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad" }),
  }),
});