import { Request, Response, Router } from "express";
import { ApiResponseType } from "../../../types/api";
import { ProductMovement } from "@prisma/client";
import prisma from "../../../lib/prisma";

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
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
          data: [],
        });
      }

      // get product movements
      const productMovements = await prisma.productMovement.findMany({
        where: {
          productId,
        },
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: "desc",
        },
      });

      const count = await prisma.productMovement.count({
        where: {
          productId,
        },
      });

      const urlWithoutQuery = req.originalUrl.split("?")[0];

      return res.json({
        success: true,
        message: "Succeeded.",
        data: productMovements,
        pagination: {
          available_count: count,
          returned_count: productMovements.length,
          current_page: page,
          has_next: offset + limit < count,
          has_prev: offset > 0,
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
