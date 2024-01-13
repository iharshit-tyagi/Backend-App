import "dotenv/config";
import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

connectDB()
  .then((x) => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server is started Successfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// app.get("/", (req, res) => {
//   res.send("<h1>Welcome to our home page</h1>");
// });

// app.listen(3000, () => {
//   console.log("App is listening on port 3000");
//   console.log(process.env.MONGO_DB_URI);
// });
