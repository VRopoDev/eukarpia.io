import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 256,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      max: 256,
    },
    access: {
      type: String,
      required: true,
      enum: ["standard", "admin", "superuser"],
      default: "standard",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    organisation: {
      type: mongoose.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
