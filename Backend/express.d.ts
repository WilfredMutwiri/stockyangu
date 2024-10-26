import { User } from "@prisma/client";
import express from "express";

declare global {
  namespace Express {
    export interface Request {
      user: Omit<User, "password">;
      pagination: {
        limit: number;
        page: number;
        offset: number;
      };
    }
  }
}

