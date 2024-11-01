import { Response, Router } from "express";
import { NewInvitesSchema } from "../../validation/invites";
import prisma from "../../lib/prisma";
import {
  Invite,
  NotificationAction,
  NotificationType,
  UserRole,
} from "@prisma/client";
import { ApiResponseType } from "../../types/api";
import inviteRouter from "./invite";

const invitesRouter = Router();

invitesRouter.use(":inviteId", inviteRouter);

invitesRouter.post(
  "/",
  async (req, res: Response<ApiResponseType<Invite[]>>) => {
    const validationResult = NewInvitesSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "The data you provided has errors. Please correct them.",
        data: validationResult.error.issues,
      });
    }

    const role = req.user.role;

    if (
      (role !== UserRole.MANAGER && role !== UserRole.SYS_ADMIN) ||
      !req.user.shopId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
        data: [],
      });
    }

    //   no duplicates
    const emails = [
      ...new Set(validationResult.data.map((invite) => invite.email)),
    ]
      // remove the email of the sender
      .filter((email) => email !== req.user.email);

    const recipientsPromise = prisma.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      select: {
        email: true,
        id: true,
      },
    });

    //   get the name of the shop where the user is a manager
    const shopPromise = prisma.shop.findUnique({
      where: {
        id: req.user.shopId,
      },
      select: {
        name: true,
      },
    });

    const [recipients, shop] = await Promise.all([
      recipientsPromise,
      shopPromise,
    ]);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message:
          "The shop in which you are a manager was not found on the server.",
        data: [],
      });
    }

    const notFoundEmails = emails.filter(
      (email) => !recipients.map((r) => r.email).includes(email)
    );

    // if all emails are not found
    if (notFoundEmails.length === emails.length) {
      return res.status(404).json({
        success: false,
        message:
          "None of the email addresses provided were found in our system.",
        data: [],
      });
    }

    const invitePromises = recipients.map((recipient) =>
      prisma.invite.create({
        data: {
          recipientId: recipient.id,
          senderId: req.user.id,
        },
      })
    );

    //   send notifications to the recipients

    const notificationPromises = recipients.map((recipient) =>
      prisma.notification.create({
        data: {
          message: `${req.user.name} has invited you to join ${shop.name} as a worker. You may accept or decline the invitation.`,
          title: `Invitation to join ${shop.name}`,
          action: NotificationAction.VIEW_INVITES,
          userId: recipient.id,
          type: NotificationType.Info,
        },
      })
    );

    //   send notif to the sender
    const senderNotificationPromise = prisma.notification.create({
      data: {
        message: `
  Invitations have been successfully sent.

  A total of ${recipients.length} ${
          recipients.length === 1 ? "invitation was" : "invitations were"
        } sent to the following recipient${recipients.length === 1 ? "" : "s"}:
  ${recipients.map((r) => r.email).join(", ")}

  ${
    notFoundEmails.length > 0
      ? `Please note that the following email addresses were not found in our system: ${notFoundEmails.join(
          ", "
        )}.`
      : ""
  }
    `.trim(),
        title: "Invitations Sent",
        action: NotificationAction.NO_ACTION,
        userId: req.user.id,
        type: NotificationType.Success,
      },
    });

    const txnRes = await prisma.$transaction([
      ...invitePromises,
      ...notificationPromises,
      senderNotificationPromise,
    ]);

    // fileter senderId, recipientId, status
    const invites = txnRes.filter(
      (r) => "senderId" in r && "recipientId" in r && "status" in r
    );

    return res.json({
      success: true,
      message: "Invitations sent successfully.",
      data: invites,
    });
  }
);

invitesRouter.get(
  "/received",
  async (req, res: Response<ApiResponseType<Invite[], null>>) => {
    const { limit, offset, page } = req.pagination;
    const invitesPromise = prisma.invite.findMany({
      where: {
        recipientId: req.user.id,
      },
      take: limit,
      skip: offset,
    });

    const countPromise = prisma.invite.count({
      where: {
        recipientId: req.user.id,
      },
    });

    const [invites, count] = await Promise.all([invitesPromise, countPromise]);

    const urlWithoutQuery = req.originalUrl.split("?")[0];

    return res.json({
      success: true,
      message: "Succeeded.",
      data: invites,
      pagination: {
        current_page: page,
        has_next: offset + limit < count,
        has_prev: offset > 0,
        available_count: count,
        returned_count: invites.length,
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

invitesRouter.get(
  "/sent",

  async (req, res: Response<ApiResponseType<Invite[], null>>) => {
    const { limit, offset, page } = req.pagination;

    const invitesPromise = prisma.invite.findMany({
      where: {
        senderId: req.user.id,
      },
      include: {
        recipient: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });

    const countPromise = prisma.invite.count({
      where: {
        senderId: req.user.id,
      },
    });

    const [invites, count] = await Promise.all([invitesPromise, countPromise]);

    const urlWithoutQuery = req.originalUrl.split("?")[0];

    return res.json({
      success: true,
      message: "Succeeded.",
      data: invites,
      pagination: {
        current_page: page,
        has_next: offset + limit < count,
        has_prev: offset > 0,
        available_count: count,
        returned_count: invites.length,
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

export default invitesRouter;
