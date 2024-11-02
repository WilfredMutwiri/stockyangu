import { MovementType } from "@prisma/client";
import { z } from "zod";

const ProductMovementSchema = z.object({
  quantity: z.coerce
    .number()
    .min(0, { message: "Quantity should be a positive number." }),
  type: z.nativeEnum(MovementType, {
    message: `Product movement type must be one of ${Object.values(
      MovementType
    ).join(", ")}.`,
  }),
  isPayable: z.boolean({
    message: "Is payable must be true or false.",
  }),
  discountDecimal: z.coerce
    .number()
    .gte(0, { message: "Discount must be a positive number." })
    .lte(1, { message: "Discount must be less than or equal to 1." }),
  comment: z
    .string()
    .min(2, { message: "Description should be at least 2 characters long." })
    .max(255, { message: "Description can be up to 255 characters only." })
    .optional(),
});

export type ProductMovementValues = z.infer<typeof ProductMovementSchema>;

export { ProductMovementSchema };
