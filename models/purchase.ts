import mongoose from "mongoose";

interface Item {
  itemName: string;
  quantity: number;
  price: number;
}

const purchaseModel = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendors",
      required: true,
    },
    items: {
      type: [
        {
          itemId: String,
          itemName: String,
          quantity: Number,
          price: Number,
        },
      ],
      validate: [
        {
          validator: function (items: Item[]) {
            return items.length > 0;
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const PurchaseEntry =
  mongoose.models.PurchaseEntry ||
  mongoose.model("PurchaseEntry", purchaseModel);

export default PurchaseEntry;
