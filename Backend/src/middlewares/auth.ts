import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../lib/env";
import prisma from "../lib/prisma";
import { ApiResponseType } from "../types/api";

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
    return res.status(401).json({
      success: false,
      message: "Please login to continue. (ERR:1)",
      data: null,
    });
  }

  if (typeof decoded === "string" || !("id" in decoded)) {
    return res.status(401).json({
      success: false,
      message: "Please login to continue. (ERR:2)",
      data: null,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded["id"],
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Please login to continue. (ERR:3)",
      data: null,
    });
  }

  req.user = user;
  return next();
}

export default auth;
