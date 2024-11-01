import { Shop, UserRole } from "@prisma/client";
import { Response, Router } from "express";
import { ApiResponseType } from "../../../types/api";
import prisma, { nullOnNotFound } from "../../../lib/prisma";
import { PatchShopSchema } from "../../../validation/shop";
import { removeEmpty } from "../../../utils";

const shopRouter = Router({ mergeParams: true });

shopRouter.get("/", async (req, res: Response<ApiResponseType<Shop, null>>) => {
  try {
    const role = req.user.role;

    if (role === UserRole.MANAGER || role === UserRole.SELLER) {
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

// patch shop
shopRouter.patch("/", async (req, res: Response<ApiResponseType<Shop>>) => {
  try {
    const role = req.user.role;

    if (role !== UserRole.MANAGER && role !== UserRole.SYS_ADMIN) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
        data: [],
      });
    }

    const validationResult = PatchShopSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided.",
        data: validationResult.error.issues,
      });
    }

    const shopId = req.user.shopId;

    if (!shopId && role === UserRole.SYS_ADMIN) {
      return res.status(503).json({
        success: false,
        message: "Not implemented.",
        data: [],
      });
    }

    if (!shopId) {
      return res.status(403).json({
        success: false,
        message: "There is no shop associated with your account.",
        data: [],
      });
    }

    const updatedShop = await nullOnNotFound(
      prisma.shop.update({
        where: {
          id: shopId,
        },
        data: {
          ...removeEmpty(validationResult.data),
        },
      })
    );

    if (!updatedShop) {
      return res.status(404).json({
        success: false,
        message: "The specified shop was not found.",
        data: [],
      });
    }

    return res.json({
      success: true,
      message: "Shop updated successfully.",
      data: updatedShop,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      data: [],
    });
  }
});

export default shopRouter;
