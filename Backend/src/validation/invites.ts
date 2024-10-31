import { InviteStatus } from "@prisma/client";
import { z } from "zod";

const NewInvitesSchema = z
  .array(
    z.object({
      email: z.string().email({
        message: "Invalid email address.",
      }),
    })
  )
  .nonempty()
  .max(10, {
    message: "You can only invite up to 10 people at a time.",
  });

const UpdateInviteSchema = z.object({
  status: z.nativeEnum(InviteStatus, {
    message: `Invite status needs to be one of ${Object.values(
      InviteStatus
    ).join(", ")}.`,
  }),
});

export type NewInvitesValues = z.infer<typeof NewInvitesSchema>;
export type UpdateInviteValues = z.infer<typeof UpdateInviteSchema>;

export { NewInvitesSchema, UpdateInviteSchema };
