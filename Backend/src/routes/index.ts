import { Router } from "express";
import userRouter from "./user";
import shopsRouter from "./shops";
import usersRouter from "./users";
import auth from "../middlewares/auth";
import imagesRouter from "./images";
import notificationsRouter from "./notifications";
import invitesRouter from "./invites";

const router = Router();

router.use("/user", userRouter);
router.use("/shops", auth, shopsRouter);
router.use("/users", auth, usersRouter);
router.use("/images", auth, imagesRouter);
router.use("/notifications", auth, notificationsRouter);
router.use("/invites", auth, invitesRouter);

export default router;
