import { Notification } from "@prisma/client";
import { Request, Response, Router } from "express";
import { ApiResponseType } from "../../types/api";
import prisma, { nullOnNotFound } from "../../lib/prisma";

const notificationRouter = Router({
  mergeParams: true,
});

notificationRouter.get(
  "/",
  async (
    req: Request<{
      notificationId: string;
    }>,
    res: Response<ApiResponseType<Notification, null>>
  ) => {
    try {
      const notificationId = Number(req.params.notificationId);

      if (isNaN(notificationId)) {
        return res.status(404).json({
          success: false,
          message: "The notification requested was not found.",
          data: null,
        });
      }

      // get notification
      const notification = await prisma.notification.findUnique({
        where: {
          id: notificationId,
          userId: req.user.id,
        },
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found.",
          data: null,
        });
      }

      return res.json({
        success: true,
        message: "Succeeded.",
        data: notification,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error. Please retry.",
        data: null,
      });
    }
  }
);

// mark as read
notificationRouter.patch(
  "/mark-as-read",
  async (
    req: Request<{
      notificationId: string;
    }>,
    res: Response<ApiResponseType<Notification, null>>
  ) => {
    try {
      const notificationId = Number(req.params.notificationId);

      // mark as read
      const notification = await nullOnNotFound(
        prisma.notification.update({
          where: {
            id: notificationId,
            userId: req.user.id,
          },
          data: {
            read: true,
          },
        })
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found.",
          data: null,
        });
      }

      return res.json({
        success: true,
        message: "Succeeded.",
        data: notification,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error. Please retry.",
        data: null,
      });
    }
  }
);

export default notificationRouter;
