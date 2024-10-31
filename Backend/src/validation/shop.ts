import { ShopCategory } from "@prisma/client";
import { z } from "zod";

// name     String
// phone    String
// email    String
// website  String?
// logoUrl  String?
// category ShopCategory

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
    .regex(/^https:\/\/utfs\.io\/(?:a\/([^\/]+)\/|f\/)([^\/]+)$/, {
      message:
        "Invalid logo URL. If you are a developer, omit it or provide a valid URL from our upload endpoint.",
    })
    .optional(),

  category: z.nativeEnum(ShopCategory, {
    message: "Invalid shop category selected.",
  }),
});

export type NewShopValues = z.infer<typeof NewShopSchema>;

export { NewShopSchema };
