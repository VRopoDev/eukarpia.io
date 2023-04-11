import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema(
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
    field: {
      type: mongoose.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    ipaddress: {
      type: String,
      trim: true,
      max: 256,
    },
    macaddress: {
      type: String,
      trim: true,
      max: 256,
      unique: true,
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

const Device = mongoose.model("Device", DeviceSchema);
export default Device;
