import { Router } from "express";
import productsRouter from "./products";

const shopRouter = Router();

shopRouter.use("/products", productsRouter);


shopRouter.get("/", (_, res) => {
  // if the logged in user is a shop owner (or can view), we can return the shop details
  // already the id is in the req.params.id or "my" for the logged in user
  res.send("Shop route get hit...");
});


export default shopRouter;
