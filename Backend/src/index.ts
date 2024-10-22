import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./routes";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", router);

const PORT = process.env["PORT"] || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
