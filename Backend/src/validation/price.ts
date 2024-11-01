import { z } from "zod";

const NewPriceSchema = z.object({
  buying: z.coerce
    .number()
    .min(0, { message: "Buying price must be a positive number." }),

  selling: z.coerce
    .number()
    .min(0, { message: "Selling price must be a positive number." }),
});


export type NewPriceValues = z.infer<typeof NewPriceSchema>;

export { NewPriceSchema };
