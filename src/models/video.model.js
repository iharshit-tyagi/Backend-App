import mongoose, { Schema } from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: "String",
    },
    thumbnail: {
      type: "String",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);
