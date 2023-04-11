import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 256,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 256,
    },
    company: {
      type: String,
      trim: true,
    },
    connection: {
      type: String,
      enum: ["worker", "customer", "supplier"],
      default: "customer",
    },
    email: {
      type: String,
      required: true,
      max: 50,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
      min: 11,
      max: 15,
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

const Contact = mongoose.model("Contact", ContactSchema);
export default Contact;
