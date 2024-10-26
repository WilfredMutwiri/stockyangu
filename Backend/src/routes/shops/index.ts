import { Router } from "express";
import shopRouter from "./shop";

const shopsRouter = Router();

// /shops
shopsRouter.get("/", (_, res) => {
  // return all shops
  // pagination can be added
  res.send("Shops route hit...");
});

shopsRouter.use("/:id", shopRouter);

shopsRouter.post("/new", (_, res) => {
  // if the user does not already own a shop, we can create a new shop with him as the manager
  res.send("New shop route hit...");
});

export default shopsRouter;
