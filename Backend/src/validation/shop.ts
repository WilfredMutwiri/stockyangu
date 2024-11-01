import { ShopCategory } from "@prisma/client";
import { z } from "zod";

import { utFileUrlRegex } from "../utils"
const NewShopSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter the shop name.",
  }),
  phone: z.string().min(10, {
    message: "Invalid phone number.",
  }),

  email: z.string().email({
    message: "Invalid email address.",
  }),

  website: z.string().optional(),

  logoUrl: z
    .string()
    .regex(utFileUrlRegex, {
      message:
        "Invalid logo URL. If you are a developer, provide a valid URL from our upload endpoint.",
    })
    .optional(),

  category: z.nativeEnum(ShopCategory, {
    message: "Invalid shop category selected.",
  }),
});

export type NewShopValues = z.infer<typeof NewShopSchema>;

const PatchShopSchema = NewShopSchema.partial();

export type PatchShopValues = z.infer<typeof PatchShopSchema>;

export { NewShopSchema, PatchShopSchema };
