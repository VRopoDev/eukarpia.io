import mongoose from "mongoose";

const CommandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 256,
    },
    description: {
      type: String,
      trim: true,
      max: 256,
    },
    device: {
      type: mongoose.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      max: 256,
    },
    server: {
      type: String,
      trim: true,
    },
    port: {
      type: Number,
      max: 65536,
      min: 0,
    },
    access: {
      type: String,
      trim: true,
      enum: ["standard", "admin", "superuser"],
      default: "standard",
    },
    createdBy: {
      type: String,
      trim: true,
      required: true,
    },
    organisation: {
      type: mongoose.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
  },
  { timestamps: true }
);

const Command = mongoose.model("Command", CommandSchema);
export default Command;
