import { ShopCategory } from "@prisma/client";
import { Response, Router } from "express";
import { ApiResponseType } from "../types/api";
import { getPaginationMeta } from "../lib/pagination";

const categoriesRouter = Router();

const categories = Object.values(ShopCategory);

categoriesRouter.get(
  "/",
  (req, res: Response<ApiResponseType<ShopCategory[]>>) => {
    const { limit, offset } = req.pagination;
    const limitedCategories = categories.slice(offset, offset + limit);
    return res.json({
      data: limitedCategories,
      success: true,
      message: "Categories fetched successfully",
      pagination: getPaginationMeta({
        req,
        returnedCount: limitedCategories.length,
        total: categories.length,
      }),
    });
  }
);

export default categoriesRouter;