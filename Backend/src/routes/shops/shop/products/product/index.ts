import { Router } from "express";

const productRouter = Router({
  mergeParams: true,
});

productRouter.get("/", (_, res) => {
  // this product id is in the req.params.id
  res.send("Product id get route hit...");
});

productRouter.put("/", (_, res) => {
  // this product id is in the req.params.id
  res.send("Product id put route hit...");
});

productRouter.delete("/", (_, res) => {
  // this product id is in the req.params.id
  res.send("Product id delete route hit...");
});

export default productRouter;
