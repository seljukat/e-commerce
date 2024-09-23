import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order: {
      type: Array,
    },
    orderId: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models?.Order || mongoose.model("Order", orderSchema);
