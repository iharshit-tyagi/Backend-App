import express from "express";
import "dotenv/config";
import connectDB from "./db/connectDB.js";
const app = express();

connectDB();

// app.get("/", (req, res) => {
//   res.send("<h1>Welcome to our home page</h1>");
// });

// app.listen(3000, () => {
//   console.log("App is listening on port 3000");
//   console.log(process.env.MONGO_DB_URI);
// });
