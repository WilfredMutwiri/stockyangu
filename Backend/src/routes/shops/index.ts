import { Router } from "express";

const shopsRouter = Router();

shopsRouter.get("/", (req, res) => {
    // we have to make sure the logged in user is an admin and then we can return the list of shops
  res.send("Shops route hit...");
});

shopsRouter.get("/new", (req, res) => {
    // we have to make sure the logged in user is a shop owner and then we can create a new shop
    res.send("New Shop creation route hit...");
});

export default shopsRouter;