import { Router } from "express";
import productRouter from "./product";

const productsRouter = Router();

productsRouter.get("/", (_, res) => {
  // return all products
  // pagination can be added
  res.send("Products route hit...");
});

productsRouter.use("/:id", productRouter);

export default productsRouter;
