import { z } from "zod";

const NewPriceSchema = z.object({
  buying: z.coerce
    .number()
    .min(0, { message: "Buying price must be a positive number." }),

  selling: z.coerce
    .number()
    .min(0, { message: "Selling price must be a positive number." }),
});

const PatchPriceSchema = NewPriceSchema.partial();

export type NewPriceValues = z.infer<typeof NewPriceSchema>;
export type PatchPriceValues = z.infer<typeof PatchPriceSchema>;

export { NewPriceSchema, PatchPriceSchema };
