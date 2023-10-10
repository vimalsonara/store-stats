import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists."],
      required: [true, "Email is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
