import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import router from "./routes";
import { env } from "./lib/env";

const app = express();

app.use(
  cors({
    origin: env.FRONTED_BASE_URL,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", router);

const PORT = process.env["PORT"] || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
