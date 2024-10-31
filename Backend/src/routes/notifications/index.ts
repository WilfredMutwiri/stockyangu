import { Response, Router } from "express";
import prisma from "../../lib/prisma";
import { ApiResponseType } from "../../types/api";
import { Notification } from "@prisma/client";

const notificationsRouter = Router();

notificationsRouter.get(
  "/",
  async (req, res: Response<ApiResponseType<Notification[], null>>) => {
    const { limit, offset, page } = req.pagination;
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

    const urlWithoutQuery = req.originalUrl.split("?")[0];

    return res.json({
      success: true,
      message: "Succeeded.",
      data: notifications,
      pagination: {
        current_page: page,
        has_next: offset + limit < count,
        has_prev: offset > 0,
        available_count: count,
        returned_count: notifications.length,
        pages_count: Math.ceil(count / limit),
        links: {
          next:
            offset + limit < count
              ? `${urlWithoutQuery}?page=${page + 1}&limit=${limit}`
              : null,
          prev:
            offset > 0
              ? `${urlWithoutQuery}?page=${page - 1}&limit=${limit}`
              : null,
          self: req.originalUrl,
        },
      },
    });
  }
);

export default notificationsRouter;