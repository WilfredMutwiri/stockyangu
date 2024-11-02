import { RequestHandler, Router } from "express";
import userRouter from "./users/user";
import shopsRouter from "./shops";
import usersRouter from "./users";
import auth from "../middlewares/auth";
import imagesRouter from "./images";
import notificationsRouter from "./notifications";
import invitesRouter from "./invites";
import productsRouter from "./products";
import {
  postAuthRateLimiter,
  preAuthRateLimiter,
} from "../middlewares/rate-limit";
const router = Router();

const routes: {
  path: string;
  authenticate?: boolean;
  middlewares?: RequestHandler[];
  router: Router;
}[] = [
  { path: "/user", authenticate: false, router: userRouter },
  { path: "/shops", router: shopsRouter },
  { path: "/users", router: usersRouter },
  { path: "/images", router: imagesRouter },
  { path: "/notifications", router: notificationsRouter },
  { path: "/invites", router: invitesRouter },
  { path: "/products", router: productsRouter },
];

// Loop through the routes and apply middlewares and routers
routes.forEach(
  ({ path, authenticate = true, middlewares = [], router: routeHandler }) => {
    const appliedMiddlewares = [
      preAuthRateLimiter, // Apply rateLimiter before auth and any other middlewares
      ...(authenticate ? [auth] : []), // Apply auth if authenticate is true
      ...middlewares, // Additional middlewares, if any
      postAuthRateLimiter, // Apply rateLimiter after auth and any other middlewares
    ];

    router.use(path, ...appliedMiddlewares, routeHandler);
  }
);

export default router;
