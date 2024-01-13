import mongoose from "mongoose";
import { dbName } from "../utils/constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGO_DB_URI + "/" + dbName
    );
    // console.log(connectionInstance.connections);
  } catch (error) {
    console.log(`MongoDB connection Failed : ${error}`);
  }
};
export default connectDB;
