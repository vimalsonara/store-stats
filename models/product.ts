import mongoose from "mongoose";

const productModel = new mongoose.Schema(
  {
    product: {
      type: String,
      unique: [true, "Product already exists."],
      required: [true, "Product name required."],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      requried: true,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.products || mongoose.model("products", productModel);

export default Product;
