import { Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "./env";
import { User } from "@prisma/client";

function revalidateJwtToken({ res, user }: { res: Response; user: User }) {
  // generate token
  const token = jwt.sign(user, env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.cookie("token", token, {
    // httpOnly: true, // Prevent JavaScript access to the cookie
    secure: true, // Use Secure flag (only send over HTTPS)
    sameSite: "none", // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // time in milliseconds
  });

  return token;
}

export { revalidateJwtToken };
