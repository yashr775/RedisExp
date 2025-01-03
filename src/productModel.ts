import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    photos: {
      type: String,
      required: [true, "Please enter photo"],
    },
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    }
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);