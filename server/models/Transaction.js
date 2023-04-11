import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
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

    quantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      required: true,
      enum: ["expense", "sale"],
      default: "expense",
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

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
