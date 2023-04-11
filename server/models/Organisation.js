import mongoose from "mongoose";

const OrganisationSchema = new mongoose.Schema(
  {
    orgId: {
      type: Number,
      required: true,
      unique: true,
    },
    orgName: {
      type: String,
      trim: true,
    },
    weatherapi: {
      type: String,
      trim: true,
    },
    apikey: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Organisation = mongoose.model("Organisation", OrganisationSchema);
export default Organisation;
