import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath);
    //File has been uploaded successfully
    //to remove file from server  after  upload
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    //to remove file from server if not uploaded
    fs.unlinkSync(localFilePath);
    console.log(error);
    return null;
  }
};
export default uploadFile;
