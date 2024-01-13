import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Welcome to our home page</h1>");
});

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
