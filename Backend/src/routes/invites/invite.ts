import { Invite, NotificationAction, NotificationType } from "@prisma/client";
import { Request, Response, Router } from "express";
import prisma, { nullOnNotFound } from "../../lib/prisma";
import { ApiResponseType } from "../../types/api";

const inviteRouter = Router({
  mergeParams: true,
});

inviteRouter.get(
  "/",
  async (
    req: Request<{
      inviteId: string;
    }>,
    res: Response<ApiResponseType<Invite, null>>
  ) => {
    const id = Number(req.params["inviteId"]);

    const invite = await prisma.invite.findUnique({
      where: {
        id,
        // check if the user is either the sender or the recipient
        OR: [{ senderId: req.user.id }, { recipientId: req.user.id }],
      },
    });

    if (invite) {
      return res.json({
        success: true,
        message: "Succeeded.",
        data: invite,
      });
    }

    return res.status(404).json({
      success: false,
      message: "The requested invite was not found on the server.",
      data: null,
    });
  }
);

inviteRouter.delete(
  "/",
  async (
    req: Request<{ inviteId: string }>,
    res: Response<ApiResponseType<Invite>>
  ) => {
    try {
      const id = Number(req.params.inviteId);

      const invite = await nullOnNotFound(
        prisma.invite.delete({
          where: {
            id,
            OR: [{ senderId: req.user.id }],
          },
        })
      );

      if (invite) {
        return res.json({
          success: true,
          message: "Invite deleted successfully.",
          data: invite,
        });
      }

      return res.status(404).json({
        success: false,
        message:
          "The requested invite was not found on the server.",
        data: [],
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        data: [],
      });
    }
  }
);

inviteRouter.patch(
  "/accept",
  async (
    req: Request<{ inviteId: string }>,
    res: Response<ApiResponseType<Invite>>
  ) => {
    try {
      const id = Number(req.params.inviteId);

      const invite = await nullOnNotFound(
        prisma.invite.update({
          where: {
            id,
            recipientId: req.user.id,
          },
          data: {
            status: "ACCEPTED",
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
        })
      );

      if (!invite) {
        return res.status(404).json({
          success: false,
          message: "The requested invite was not found on the server.",
          data: [],
        });
      }

      //  send notifs to the sender, and the recipient notifying them of the acceptance

      await prisma.notification.create({
        data: {
          userId: invite.senderId,
          title: "Invite accepted",
          // show both the name and the email of the recipient
          message: `${invite.recipient.name} (${invite.recipient.email}) has accepted your invite to work at your shop.`,
          action: NotificationAction.VIEW_INVITES,
          type: NotificationType.Info,
        },
      });

      return res.json({
        success: true,
        message: "Invite accepted successfully.",
        data: invite,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        data: [],
      });
    }
  }
);

inviteRouter.patch(
  "/reject",
  async (
    req: Request<{ inviteId: string }>,
    res: Response<ApiResponseType<Invite>>
  ) => {
    try {
      const id = Number(req.params.inviteId);

      const invite = await nullOnNotFound(
        prisma.invite.update({
          where: {
            id,
            recipientId: req.user.id,
          },
          data: {
            status: "REJECTED",
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
        })
      );

      if (!invite) {
        return res.status(404).json({
          success: false,
          message: "The requested invite was not found on the server.",
          data: [],
        });
      }

      //  send notifs to the sender, and the recipient notifying them of the acceptance

      await prisma.notification.create({
        data: {
          userId: invite.senderId,
          title: "Invite Rejected",
          // show both the name and the email of the recipient
          message: `${invite.recipient.name} (${invite.recipient.email}) has rejected your invite to work at your shop.`,
          action: NotificationAction.VIEW_INVITES,
          type: NotificationType.Info,
        },
      });

      return res.json({
        success: true,
        message: "Invite rejected successfully.",
        data: invite,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        data: [],
      });
    }
  }
);

export default inviteRouter;
