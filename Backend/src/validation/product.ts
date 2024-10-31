import { z } from "zod";

const NewProductSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Please enter a name with at least 2 characters." })
    .max(50, { message: "Name can be up to 50 characters only." }),

  buyingPrice: z.coerce
    .number()
    .min(0, { message: "Buying price must be a positive number." }),

  sellingPrice: z.coerce
    .number()
    .min(0, { message: "Selling price must be a positive number." }),

  description: z
    .string()
    .min(2, { message: "Description should be at least 2 characters long." })
    .max(255, { message: "Description can be up to 255 characters only." }),

  quantity: z.coerce
    .number()
    .min(0, { message: "Quantity should be a positive number." }),
  imageUrls: z
    .array(
      z.string().regex(utFileUrlRegex, {
        message:
          "Invalid image URL. If you are a developer, provide a valid URL from our upload endpoint.",
      })
    )
    .optional(),
});

export type NewProductValues = z.infer<typeof NewProductSchema>;

export default NewProductSchema;
