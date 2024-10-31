import express, { Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import router from "./routes";
import { env } from "./lib/env";
import rateLimiter from "./middlewares/rate-limit";
import { ApiResponseType } from "./types/api";
import paginate from "./middlewares/pagination";

const app = express();

app.use(
  cors({
    origin: env.FRONTED_BASE_URL,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", rateLimiter, paginate, router);

app.all("*", function (req, res: Response<ApiResponseType<null, null>>) {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
    data: null,
  });
});

const PORT = process.env["PORT"] || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
