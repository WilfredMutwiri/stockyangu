import { Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { UserLoginSchema, UserRegistrationSchema } from "../validation/user";
import { ApiResponseType } from "../types/api";
import { User } from "@prisma/client";
import prisma from "../lib/prisma";
import { env } from "../lib/env";

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
      });

      if (userExists) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists.",
          data: [],
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
        },
      });
      // return success message

      // remove password, and return user
      const { password, ...userWithoutPassword } = user;

      return res.json({
        success: true,
        message: "Your account has been created successfully.",
        data: userWithoutPassword,
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

userRouter.post(
  "/login",
  async (
    req,
    res: Response<
      ApiResponseType<{
        token: string;
      }>
    >
  ) => {
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
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid login attempt.",
        data: [],
      });
    }
    // check if correct password
    const passwordMatch = bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid login attempt.",
        data: [],
      });
    }

    // generate token
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access to the cookie
      secure: true, // Use Secure flag (only send over HTTPS)
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // time in milliseconds
    });

    return res.json({
      success: true,
      message: "You have been logged in successfully.",
      data: {
        token,
      },
    });
  }
);

// this is why we use post instead of get: https://stackoverflow.com/questions/3521290/logging-out-get-or-post
userRouter.post("/logout", (_, res: Response<ApiResponseType<null>>) => {
  res.clearCookie("token");
  return res.json({
    success: true,
    message: "You have been logged out.",
    data: null,
  });
});

// get user details
userRouter.get(
  "/me",
  async (req, res: Response<ApiResponseType<Omit<User, "password">, null>>) => {
    // get user id from token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are no logged in.",
        data: null,
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Please login to continue.",
        data: null,
      });
    }

   if(typeof decoded === "string") {
    console.log(decoded, "decoded is a string, unexpected!!!!!");
      return res.status(401).json({
        success: false,
        message: "Please login to continue.",
        data: null,
      });
    }

    console.log(decoded);

    if(!("id" in decoded)) {
      return res.status(401).json({
        success: false,
        message: "Please login to continue.",
        data: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded["id"],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "This account no longer exists.",
        data: null,
      });
    }

    // remove password, and return user
    const { password, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: "User details fetched successfully.",
      data: userWithoutPassword,
    });
  }
);

export default userRouter;
