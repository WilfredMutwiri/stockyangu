import { Response, Router } from "express";
import prisma from "../../lib/prisma";
import { ApiResponseType } from "../../types/api";
import { Notification } from "@prisma/client";
import notificationRouter from "./notification";
import { getPaginationMeta } from "../../lib/pagination";

const notificationsRouter = Router({
  mergeParams: true,
});

notificationsRouter.use("/:notificationId", notificationRouter);

notificationsRouter.get(
  "/",
  async (req, res: Response<ApiResponseType<Notification[], null>>) => {
    try {
      console.log(req.path);
      const { limit, offset } = req.pagination;
      const notificationsPromise = prisma.notification.findMany({
        where: {
          userId: req.user.id,
        },
        take: limit,
        skip: offset,
      });

      const countPromise = prisma.notification.count({
        where: {
          userId: req.user.id,
        },
      });

      const [notifications, count] = await Promise.all([
        notificationsPromise,
        countPromise,
      ]);

      return res.json({
        success: true,
        message: "Succeeded.",
        data: notifications,
        pagination: getPaginationMeta({
          req,
          total: count,
          returnedCount: notifications.length,
        }),
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

// mark all notifications as read
notificationsRouter.patch(
  "/mark-all-as-read",
  async (
    req,
    res: Response<
      ApiResponseType<
        {
          updated_notifications_count: number;
        },
        null
      >
    >
  ) => {
    try {
      const updatedNotifications = await prisma.notification.updateMany({
        where: {
          userId: req.user.id,
          read: false,
        },

        data: {
          read: true,
        },
      });

      return res.json({
        success: true,
        message: "Succeeded.",
        data: {
          updated_notifications_count: updatedNotifications.count,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error. Please retry.",
        data: null,
      });
    }
  }
);

export default notificationsRouter;
