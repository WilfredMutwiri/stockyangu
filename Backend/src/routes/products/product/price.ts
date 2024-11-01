import { Router } from "express";

const priceRouter = Router();

priceRouter.patch("/", async (req, res) => {
  res.send("Price updated.");
});

export default priceRouter;