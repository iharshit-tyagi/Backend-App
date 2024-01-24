import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    // id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
