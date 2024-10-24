import { Router } from "express";

const shopRouter = Router();


shopRouter.get("/shop", (req, res) => {
    // if the logged in user is a shop owner, we can return the shop details
  res.send("Shop ID: " + req.params.shopId);
});
