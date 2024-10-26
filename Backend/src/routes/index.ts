import { Router } from "express";
import userRouter from "./user";
import shopsRouter from "./shops";
import usersRouter from "./users";
import auth from "../middlewares/auth";

const router = Router();

router.use("/user", userRouter);
router.use("/shops", auth, shopsRouter);
router.use("/users", auth, usersRouter);

export default router;
