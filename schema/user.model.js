import mongoose from "mongoose";
import bcrypt from "bcryptjs";

let userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address."],
    },
    password: {
      type: String,
      select: false,
    },
    accessToken: {
      type: String,
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre("save", async function () {
  if (!this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("user", userSchema);
