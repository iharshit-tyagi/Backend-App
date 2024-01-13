import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
export const app = express();

app.use(cors());
app.use(cookieParser());
app.use(
  urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(
  express.json({
    limit: "20kb",
  })
);
