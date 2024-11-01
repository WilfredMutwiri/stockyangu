import { Shop, UserRole } from "@prisma/client";
import { Response, Router } from "express";
import { ApiResponseType } from "../../../types/api";
import prisma from "../../../lib/prisma";

const shopRouter = Router({ mergeParams: true });


shopRouter.get("/", async (req, res: Response<ApiResponseType<Shop, null>>) => {
  try {
    const role = req.user.role;

    if (role === UserRole.SELLER) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view the requested data.",
        data: null,
      });
    }

    if (role === UserRole.MANAGER) {
      const userWithShop = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          shop: true,
        },
      });

      if (
        !userWithShop ||
        !userWithShop.shop ||
        userWithShop.shop.id !== req.user.shopId
      ) {
        return res.status(404).json({
          success: false,
          message: "The requested data was not found.",
          data: null,
        });
      }

      return res.json({
        success: true,
        message: "Succeeded.",
        data: userWithShop.shop,
      });
    }

    if (role === UserRole.SYS_ADMIN) {
      const shopId = req.query["shopId"];
      if (!shopId || typeof shopId !== "number") {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid shop id.",
          data: null,
        });
      }
      const shop = await prisma.shop.findUnique({
        where: {
          id: shopId,
        },
      });

      if (!shop) {
        return res.status(404).json({
          success: false,
          message: "The requested data was not found.",
          data: null,
        });
      }

      return res.json({
        success: true,
        message: "Succeeded.",
        data: shop,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid request. (code: N.R)",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      data: null,
    });
  }
});

// shopRouter.put(
//   "/",
//   async (req, res: Response<ApiResponseType<Shop, null>>) => {}
// );



export default shopRouter;
