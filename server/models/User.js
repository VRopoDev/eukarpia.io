import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
      min: 11,
      max: 15,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 6,
      max: 1024,
    },
    role: {
      type: String,
      enum: ["standard", "admin", "superuser"],
      default: "admin",
    },
    organisation: {
      type: mongoose.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
