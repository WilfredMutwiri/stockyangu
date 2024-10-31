import { Response, Router } from "express";
import productRouter from "./product";
import { Product, UserRole } from "@prisma/client";
import { ApiResponseType } from "../../types/api";
import prisma from "../../lib/prisma";

const productsRouter = Router();

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
        message: "Internal server error. Please retry.",
        data: null,
      });
    }
  }
);

productsRouter.use("/:productId", productRouter);

export default productsRouter;
