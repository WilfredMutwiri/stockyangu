import { Invite } from "@prisma/client";
import { Request, Response, Router } from "express";
import prisma from "../../lib/prisma";
import { ApiResponseType } from "../../types/api";
import { UpdateInviteSchema } from "../../validation/invites";

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
inviteRouter.put(
  "/",
  async (
    req: Request<{ inviteId: string }>,
    res: Response<ApiResponseType<Invite>>
  ) => {
    try {
      const id = Number(req.params.inviteId);
      const validationResult = UpdateInviteSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "The data you provided has errors. Please correct them.",
          data: validationResult.error.issues,
        });
      }

      const invite = await prisma.invite
        .update({
          where: {
            id,
            OR: [{ senderId: req.user.id }, { recipientId: req.user.id }],
          },
          data: {
            status: validationResult.data.status,
          },
        })
        .catch((error) => {
          console.error(error);
          return null;
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

inviteRouter.delete(
  "/",
  async (
    req: Request<{ inviteId: string }>,
    res: Response<ApiResponseType<Invite>>
  ) => {
    try {
      const id = Number(req.params.inviteId);

      const invite = await prisma.invite
        .delete({
          where: {
            id,
            OR: [{ senderId: req.user.id }, { recipientId: req.user.id }],
          },
        })
        .catch((error) => {
          console.error(error);
          return null;
        });

      if (invite) {
        return res.json({
          success: true,
          message: "Invite deleted successfully.",
          data: invite,
        });
      }

      return res.status(404).json({
        success: false,
        message: "The requested invite was not found on the server.",
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

export default inviteRouter;
