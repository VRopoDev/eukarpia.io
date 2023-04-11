import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema(
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
    product: {
      type: String,
      trim: true,
      max: 256,
    },

    supply: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: String,
      required: true,
      trim: true,
      max: 256,
    },
    longitude: {
      type: String,
      required: true,
      trim: true,
      max: 256,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      max: 256,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "arable",
        "vineyard",
        "forestry",
        "horticulture",
        "greenhouse",
        "hydroponic",
        "urban",
      ],
      default: "arable",
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

const Field = mongoose.model("Field", FieldSchema);
export default Field;
