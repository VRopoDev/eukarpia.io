import mongoose from "mongoose";

const IoTSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    connection: {
      type: Boolean,
      default: false,
    },
    comms: {
      type: String,
      max: 1060,
      default: "No commnunication available.",
    },
    organisation: {
      type: mongoose.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
  },
  { timestamps: true }
);

const IoT = mongoose.model("IoT", IoTSchema);
export default IoT;
