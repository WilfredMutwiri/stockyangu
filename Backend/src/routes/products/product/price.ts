import { Price, UserRole } from "@prisma/client";
import { Request, Response, Router } from "express";
import { NewPriceSchema } from "../../../validation/price";
import { ApiResponseType } from "../../../types/api";
import prisma from "../../../lib/prisma";

const priceRouter = Router({ mergeParams: true });

priceRouter.post(
  "/",
  async (
    req: Request<{
      productId: string;
    }>,
    res: Response<
      ApiResponseType<{
        history: Price[];
        current_price: Price | null;
      }>
    >
  ) => {
    try {
      const productId = Number(req.params.productId);
      const { limit, offset } = req.pagination;

      const validationResult = NewPriceSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "The data you provided has errors. Please correct them.",
          data: validationResult.error.issues,
        });
      }

      // can update if he is a  manager of the shop
      if (req.user.role !== UserRole.MANAGER || !req.user.shopId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
          data: [],
        });
      }

      // update the product by pushing a new price and add end date to the previous prices which doesn't have end date
      const updatedProduct = await prisma.product.update({
        where: {
          // Note:Must add shopId to the where clause to prevent writing to other shops' products
          shopId: req.user.shopId,
          id: productId,
        },
        data: {
          priceHistory: {
            create: {
              buying: validationResult.data.buying,
              selling: validationResult.data.selling,
            },
            updateMany: {
              where: {
                productId,
                endDate: null,
              },
              data: {
                endDate: new Date(),
              },
            },
          },
        },
        include: {
          priceHistory: {
            take: limit,
            skip: offset,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      const newPrice = updatedProduct.priceHistory.pop();

      if (!newPrice) {
        console.error(`catastrophic error: new price is not found`);
        return res.status(500).json({
          success: false,
          message:
            "There has been a catastrophic server error. Please add the price again.",
          data: [],
        });
      }

      return res.json({
        success: true,
        message: "Succeeded.",
        data: {
          history: updatedProduct.priceHistory,
          current_price: newPrice,
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

priceRouter.get(
  "/",
  async (
    req: Request<{
      productId: string;
    }>,
    res: Response<
      ApiResponseType<{
        history: Price[];
        current_price: Price | null;
      }>
    >
  ) => {
    try {
      // TODO: return the pagination details in the response

      const productId = Number(req.params.productId);

      const { limit, offset } = req.pagination;

      if (!req.user.shopId) {
        return res.status(403).json({
          success: false,
          message: "There is no shop in which you are a worker.",
          data: [],
        });
      }

      const product = await prisma.product.findUnique({
        where: {
          shopId: req.user.shopId,
          id: productId,
        },
        include: {
          priceHistory: {
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
          message: "The requested data was not found.",
          data: [],
        });
      }

      const currentPrice = product.priceHistory.find((price) => !price.endDate);

      return res.json({
        success: true,
        message: "Succeeded.",
        data: {
          history: product.priceHistory,
          current_price: currentPrice || null,
        },
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

export default priceRouter;
