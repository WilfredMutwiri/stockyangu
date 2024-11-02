import { Product, UserRole } from "@prisma/client";
import { Request, Response, Router } from "express";
import prisma from "../../lib/prisma";
import { ApiResponseType } from "../../types/api";
import productRouter, { ProductWithPriceHistoryAndMovements } from "./product";
import { NewProductSchema } from "../../validation/product";
import { getPaginationMeta } from "../../lib/pagination";

const productsRouter = Router();

productsRouter.use("/:productId", productRouter);

productsRouter.get(
  "/",
  async (req, res: Response<ApiResponseType<Product[], null>>) => {
    try {
      const role = req.user.role;

      // TODO: in docs, specify that if role is sys admin, shopId can be passed as query param to retrieve products of any shop, if not sys_admin, the query param is ignored

      // if admin, expect a query param shopId, else use the user's shopId
      const shopIdFromQuery =
        typeof req.query["shopId"] === "string"
          ? parseInt(req.query["shopId"])
          : null;

      const shopId =
        role === UserRole.SYS_ADMIN
          ? shopIdFromQuery || req.user.shopId
          : req.user.shopId;

      if (!shopId) {
        return res.status(404).json({
          success: false,
          message: `${
            role === UserRole.SYS_ADMIN
              ? `No shop specified to retrieve products from.`
              : "There is no shop in which you are a worker."
          }`,
          data: null,
        });
      }

      // if sys admin or manager with the same shopId
      const { limit, offset, page } = req.pagination;

      const productsPromise = await prisma.product.findMany({
        where: {
          shopId: shopId,
        },
        take: limit,
        skip: offset,
      });

      const countPromise = prisma.product.count({
        where: {
          shopId: shopId,
        },
      });

      const [products, count] = await Promise.all([
        productsPromise,
        countPromise,
      ]);

      return res.json({
        success: true,
        message: "Succeeded.",
        data: products,
        pagination: getPaginationMeta({
          originalUrl: req.originalUrl,
          limit,
          offset,
          page,
          total: count,
          returnedCount: products.length,
        }),
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

productRouter.post(
  "/",
  async (
    req: Request,
    res: Response<ApiResponseType<ProductWithPriceHistoryAndMovements>>
  ) => {
    try {
      const shopId = req.user.shopId;

      if (!shopId) {
        return res.status(403).json({
          success: false,
          message: "There is no shop associated with your account.",
          data: [],
        });
      }

      // user cnnot create a product if he is not a manager

      const role = req.user.role;

      if (role !== UserRole.MANAGER) {
        return res.status(403).json({
          success: false,
          message: "Only managers can create products.",
          data: [],
        });
      }

      // create a new product
      const validationResult = NewProductSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided.",
          data: validationResult.error.issues,
        });
      }

      const product = await prisma.product.create({
        data: {
          name: validationResult.data.name,
          shopId: shopId,
          imageUrls: validationResult.data.imageUrls ?? [],
          description: validationResult.data.description,
          priceHistory: {
            create: {
              buying: validationResult.data.buyingPrice,
              selling: validationResult.data.sellingPrice,
            },
          },
        },
        include: {
          priceHistory: true,
          movements: true,
        },
      });

      return res.json({
        success: true,
        message: "Product created successfully.",
        data: product,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error. Please retry.",
        data: [],
      });
    }
  }
);

export default productsRouter;
