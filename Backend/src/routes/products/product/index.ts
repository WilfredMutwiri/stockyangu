import { Price, Product, ProductMovement, UserRole } from "@prisma/client";
import { Request, Response, Router } from "express";
import prisma, { nullOnNotFound } from "../../../lib/prisma";
import { ApiResponseType } from "../../../types/api";
import {
  PatchProductSchema,
  PutProductSchema,
} from "../../../validation/product";
import { removeEmpty } from "../../../utils";
import priceRouter from "./price";
export type ProductWithPriceHistoryAndMovements = Product & {
  priceHistory: Price[];
  movements: ProductMovement[];
};

const productRouter = Router({
  mergeParams: true,
});

productRouter.use("/price", priceRouter)

productRouter.get(
  "/",
  async (
    req: Request<{
      productId: string;
    }>,
    res: Response<ApiResponseType<ProductWithPriceHistoryAndMovements, null>>
  ) => {
    const productId = Number(req.params.productId);
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
            ? `No shop specified to retrieve product from.`
            : "Product not found."
        }`,
        data: null,
      });
    }

    // get product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        shopId,
      },
      include: {
        priceHistory: true,
        movements: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Succeeded.",
      data: product,
    });
  }
);

productRouter.put(
  "/",
  async (
    req: Request<{ productId: string }>,
    res: Response<ApiResponseType<Product>>
  ) => {
    // can update if he is a  manager of the shop

    const role = req.user.role;
    const shopId = req.user.shopId;

    if (role !== UserRole.MANAGER || !shopId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
        data: [],
      });
    }

    const productId = Number(req.params.productId);

    const validationResult = PutProductSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided.",
        data: validationResult.error.issues,
      });
    }

    const product = await nullOnNotFound(
      prisma.product.update({
        where: {
          id: productId,
          shopId,
        },
        data: validationResult.data,
      })
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        data: [],
      });
    }

    return res.json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  }
);

productRouter.patch(
  "/",
  async (
    req: Request<{ productId: string }>,
    res: Response<ApiResponseType<Product>>
  ) => {
    try {
      // can update if he is a  manager of the shop
      const role = req.user.role;
      const shopId = req.user.shopId;

      if (role !== UserRole.MANAGER || !shopId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
          data: [],
        });
      }

      const validationResult = PatchProductSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid data provided.",
          data: validationResult.error.issues,
        });
      }

      const productId = Number(req.params.productId);

      // update product (only the fields that are provided), dont replace arrays But push since it is a patch not a put

      const product = await nullOnNotFound(
        prisma.product.update({
          where: {
            id: productId,
            shopId,
          },
          data: {
            ...removeEmpty(validationResult.data),
          },
        })
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
          data: [],
        });
      }

      return res.json({
        success: true,
        message: "Product updated successfully.",
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

productRouter.delete(
  "/",
  async (
    req: Request<{ productId: string }>,
    res: Response<ApiResponseType<Product, null>>
  ) => {
    // can delete if he is a  manager of the shop
    try {
      const role = req.user.role;
      const shopId = req.user.shopId;

      if (role !== UserRole.MANAGER || !shopId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
          data: null,
        });
      }

      const productId = Number(req.params.productId);

      const deletedProduct = await nullOnNotFound(
        prisma.product.delete({
          where: {
            id: productId,
            shopId,
          },
        })
      );

      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
          data: null,
        });
      }

      return res.json({
        success: true,
        message: "Product deleted successfully.",
        data: deletedProduct,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error. Please retry.",
        data: null,
      });
    }
  }
);

export default productRouter;
