import { z } from "zod";

const UserRegistrationSchema = z
  .object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
    confirmPassword: z.string(),
    name: z.string().min(1, {
      message: "Please enter your name.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const UserLoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export type UserRegistrationValues = z.infer<typeof UserRegistrationSchema>;
export type UserLoginValues = z.infer<typeof UserLoginSchema>;
export { UserRegistrationSchema, UserLoginSchema };
