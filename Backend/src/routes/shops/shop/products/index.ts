import { Response, Router } from "express";
import productRouter from "./product";
import { Product, UserRole } from "@prisma/client";
import { ApiResponseType } from "../../../../types/api";
import prisma from "../../../../lib/prisma";

const productsRouter = Router();

productsRouter.get(
  "/",
  async (req, res: Response<ApiResponseType<Product[], null>>) => {
    // return all products in this shop
    // pagination can be added
    try {
      const role = req.user.role;

      if (role === UserRole.SELLER) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to view the requested data.",
          data: null,
        });
      }

      const shopId = req.query["shopId"];
      if (!shopId || typeof shopId !== "number") {
        return res.status(400).json({
          success: false,
          message: "No such shop found.",
          data: null,
        });
      }

      // if manager and shopId is not the same as the user's shopId
      if (role === UserRole.MANAGER && shopId !== req.user.shopId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to view the requested data.",
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

      const urlWithoutQuery = req.originalUrl.split("?")[0];

      return res.json({
        success: true,
        message: "Succeeded.",
        data: products,
        pagination: {
          current_page: page,
          has_next: offset + limit < count,
          has_prev: offset > 0,
          available_count: count,
          returned_count: products.length,
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
      return res.status(500).json({
        success: false,
        message: "An error occurred.",
        data: null,
      });
    }
  }
);

productsRouter.use("/:id", productRouter);

export default productsRouter;
