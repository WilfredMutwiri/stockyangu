import { NotificationAction, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Response, Router } from "express";
import { revalidateJwtToken } from "../../lib/auth";
import prisma from "../../lib/prisma";
import { ApiResponseType } from "../../types/api";
import { UserLoginSchema, UserRegistrationSchema } from "../../validation/user";

const userRouter = Router();

userRouter.post(
  "/register",
  async (req, res: Response<ApiResponseType<Omit<User, "password">>>) => {
    const validationResult = UserRegistrationSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "The data you provided has errors. Please correct them.",
        data: validationResult.error.issues,
      });
    }

    console.log(validationResult.data);

    try {
      // check if user already exists
      const userExists = await prisma.user.findUnique({
        where: {
          email: validationResult.data.email,
        },
        select: {
          id: true,
        },
      });

      if (userExists) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists.",
          data: [
            {
              code: "custom",
              message: "User with this email already exists.",
              path: ["email"],
            },
          ],
        });
      }
      // create user
      const hashedPassword = await bcrypt.hash(
        validationResult.data.password,
        10
      );
      const user = await prisma.user.create({
        data: {
          email: validationResult.data.email,
          password: hashedPassword,
          name: validationResult.data.name,
          notifications: {
            create: {
              message: "Welcome to our platform! We are glad to have you.",
              title: "Welcome",
              action: NotificationAction.NO_ACTION,
              type: "Info",
            },
          },
        },
      });
      // return success message

      return res.json({
        success: true,
        message: "Your account has been created successfully.",
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error. Please retry.",
        data: [],
      });
    }
  }
);

userRouter.post("/login", async (req, res: Response<ApiResponseType<null>>) => {
  const validationResult = UserLoginSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid login attempt.",
      data: validationResult.error.issues,
    });
  }

  const { email, password } = validationResult.data;
  // get user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    omit: {
      password: false,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid login attempt.",
      data: [],
    });
  }
  // check if correct password
  const passwordMatch = await bcrypt.compare(password, user.password);

  console.log("passwordMatch", passwordMatch);

  if (!passwordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid login attempt.",
      data: [],
    });
  }

  // const token =
  revalidateJwtToken({
    res,
    user,
  });

  return res.json({
    success: true,
    message: "You have been logged in successfully.",
    data: null,
  });
});

// this is why we use post instead of get: https://stackoverflow.com/questions/3521290/logging-out-get-or-post
userRouter.post("/logout", (_, res: Response<ApiResponseType<null>>) => {
  res.clearCookie("token");
  return res.json({
    success: true,
    message: "You have been logged out.",
    data: null,
  });
});

export default userRouter;
