import { Request, Response, Router } from "express";
import { ApiResponseType } from "../../../types/api";
import { Product, ProductMovement, Price, UserRole } from "@prisma/client";
import prisma from "../../../lib/prisma";

type ProductWithPriceHistoryAndMovements = Product & {
  priceHistory: Price[];
  movements: ProductMovement[];
};

const productRouter = Router({
  mergeParams: true,
});

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

productRouter.put("/", (_, res) => {
  // this product id is in the req.params.id
  res.send("Product id put route hit...");
});

productRouter.delete(
  "/",
  async (
    req: Request<{ productId: string }>,
    res: Response<ApiResponseType<Product>>
  ) => {
    // can delete if he is a  manager of the shop
    try {
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

      const deletedProduct = await prisma.product.delete({
        where: {
          id: productId,
          shopId,
        },
      });

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
        data: [],
      });
    }
  }
);

export default productRouter;
