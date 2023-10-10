import mongoose from "mongoose";

const vendorModel = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: [true, "Vendor name required."],
    },
    mobile: {
      type: String,
      unique: [true, "Mobile already exists."],
      required: [true, "Mobile is required."],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

const Vendor =
  mongoose.models.vendors || mongoose.model("vendors", vendorModel);

export default Vendor;
