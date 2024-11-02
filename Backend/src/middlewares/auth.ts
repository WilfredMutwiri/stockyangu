import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../lib/env";
import { ApiResponseType } from "../types/api";
import { z } from "zod";
import { UserRole } from "@prisma/client";

async function auth(
  req: Request,
  res: Response<ApiResponseType<null, null>>,
  next: NextFunction
) {
  const token = req.cookies["token"];
  console.log(`inside auth middleware, token: `, token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login to continue. (ERR:0)",
      data: null,
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      success: false,
      message: "Please login to continue. (ERR:1)",
      data: null,
    });
  }

  const UserSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    password: z.string(),
    role: z.nativeEnum(UserRole),
    shopId: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  const validationResult = UserSchema.safeParse(decoded);

  if (!validationResult.success) {
    return res.status(401).json({
      success: false,
      message: "Please login to continue. (ERR:2)",
      data: null,
    });
  }

  req.user = validationResult.data;
  return next();
}

export default auth;
