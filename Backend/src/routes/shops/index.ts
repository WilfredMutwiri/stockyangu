import { Response, Router } from "express";
import shopRouter from "./shop";
import { ApiResponseType } from "../../types/api";
import { NotificationAction, NotificationType, Shop, UserRole } from "@prisma/client";
import prisma from "../../lib/prisma";
import { NewShopSchema } from "../../validation/shop";

const shopsRouter = Router();

// /shops
shopsRouter.get(
  "/",
  async (req, res: Response<ApiResponseType<Shop[], null>>) => {
    // do we have permission to view all shops?
    const role = req.user.role;
    if (role !== UserRole.SYS_ADMIN) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view the requested data.",
        data: null,
      });
    }

    // fetch all shops paginated
    const { limit, offset, page } = req.pagination;

    const shopsPromise = prisma.shop.findMany({
      take: limit,
      skip: offset,
    });

    const countPromise = prisma.shop.count();

    const [shops, count] = await Promise.all([shopsPromise, countPromise]);

    const urlWithoutQuery = req.originalUrl.split("?")[0];

    return res.json({
      success: true,
      message: "Succeeded.",
      data: shops,
      pagination: {
        current_page: page,
        has_next: offset + limit < count,
        has_prev: offset > 0,
        available_count: count,
        returned_count: shops.length,
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

shopsRouter.use("/:shopId", shopRouter);

shopsRouter.post("/", async (req, res: Response<ApiResponseType<Shop>>) => {
  try {
    // if the user does not already own a shop, we can create a new shop with him as the manager
    const hasShop = req.user.shopId;
    if (hasShop) {
      return res.status(403).json({
        success: false,
        message:
          "Currently, you can only register as a worker in one organization.",
        data: [],
      });
    }

    const validationResult = NewShopSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "The data you provided has errors. Please correct them.",
        data: validationResult.error.issues,
      });
    }

    const shopPromise = prisma.shop.create({
      data: {
        category: validationResult.data.category,
        email: validationResult.data.email,
        name: validationResult.data.name,
        phone: validationResult.data.phone,
        logoUrl: validationResult.data.logoUrl || null,
        website: validationResult.data.website || null,
        workers: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    const updatedUserPromise = prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        role: UserRole.MANAGER,
        notifications: {
          create: {
            message: `You are now the manager of ${validationResult.data.name}. You can invite workers using their email addresses.`,
            type: NotificationType.Success,
            title: "Shop Registered Successfully",
            action:NotificationAction.VIEW_SHOP
          },
        },
      },
    });

    const [shop, _] = await Promise.all([shopPromise, updatedUserPromise]);

    return res.json({
      success: true,
      message: "Succeeded.",
      data: shop,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      data: [],
    });
  }
});

export default shopsRouter;
