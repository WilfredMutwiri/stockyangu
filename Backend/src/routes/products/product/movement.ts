import { Request, Response, Router } from "express";
import { ApiResponseType } from "../../../types/api";
import { Price, ProductMovement } from "@prisma/client";
import prisma from "../../../lib/prisma";
import { ProductMovementSchema } from "../../../validation/productMovement";
import { getPaginationMeta } from "../../../lib/pagination";

const productMovementRouter = Router({ mergeParams: true });

productMovementRouter.get(
  "/",
  async (
    req: Request<{
      productId: string;
    }>,
    res: Response<ApiResponseType<ProductMovement[]>>
  ) => {
    try {
      const { limit, offset, page } = req.pagination;
      const productId = Number(req.params.productId);

      if (!req.user.shopId) {
        return res.status(404).json({
          success: false,
          message: `You are not a worker in any shop.`,
          data: [],
        });
      }

      //   check if the product exists
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
          shopId: req.user.shopId,
        },
        include: {
          movements: {
            take: limit,
            skip: offset,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
          data: [],
        });
      }

      // get product movements
      const productMovements = product.movements;

      const count = await prisma.productMovement.count({
        where: {
          productId,
        },
      });

      return res.json({
        success: true,
        message: "Succeeded.",
        data: productMovements,
        pagination: getPaginationMeta({
          originalUrl: req.originalUrl,
          limit,
          offset,
          page,
          total: count,
          returnedCount: productMovements.length,
        }),
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

productMovementRouter.post(
  "/",
  async (
    req: Request<{
      productId: string;
    }>,
    res: Response<
      ApiResponseType<
        ProductMovement & {
          price: Price;
        }
      >
    >
  ) => {
    try {
      const productId = Number(req.params.productId);
      if (!req.user.shopId) {
        return res.status(404).json({
          success: false,
          message: `You are not a worker in any shop.`,
          data: [],
        });
      }

      const validationResult = ProductMovementSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed.",
          data: validationResult.error.issues,
        });
      }

      //   check if the product exists
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
          shopId: req.user.shopId,
        },
        include: {
          priceHistory: {
            where: {
              endDate: null,
            },
          },
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
          data: [],
        });
      }

      const priceInEffect = product.priceHistory[0];

      if (!priceInEffect) {
        return res.status(400).json({
          success: false,
          message: "Please set an active price for this product first.",
          data: [],
        });
      }

      // create product movement
      const productMovement = await prisma.productMovement.create({
        data: {
          ...validationResult.data,
          productId,
          productPriceId: priceInEffect.id,
          workerId: req.user.id,
        },
      });

      return res.json({
        success: true,
        message: "Succeeded.",
        data: {
          ...productMovement,
          price: priceInEffect,
        },
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

export default productMovementRouter;
