import { Price } from "@prisma/client";
import { Request, Response, Router } from "express";

const priceRouter = Router({ mergeParams: true });

priceRouter.patch(
  "/",
  async (
    req: Request<{
      productId: string;
    }>,
    res: Response<Price>
  ) => {
    const productId = Number(req.params.productId);

    

  }
);

export default priceRouter;
